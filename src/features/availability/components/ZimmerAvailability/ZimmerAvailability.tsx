import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./ZimmerAvailability.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAvailabilityByZimmerQuery, useBlockDayMutation } from "../../redux/availabilityApi";
import { useAddBookingMutation } from "../../../booking/redux/bookingApi";
import { RootState } from "../../../../app/store";

interface Zimmer {
  zimmerId: number;
  nameZimmer: string;
  pricePerNight: number;
  ownerId: number; 
}

interface Props {
  zimmerId: number;
  pricePerNight: number;
  zimmer: Zimmer;
}

export default function ZimmerAvailability({ zimmerId, pricePerNight, zimmer }: Props) {
  const { data: days, refetch } = useGetAvailabilityByZimmerQuery(zimmerId);
  const [blockDay] = useBlockDayMutation();
  const [addBooking] = useAddBookingMutation();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const [range, setRange] = useState<[Date, Date] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isBooked = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return days?.some(d => d.startDate.split("T")[0] === dateStr && d.isBooked);
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;
    if (isPast(date)) return <abbr title="עבר"></abbr>;
    if (isBooked(date)) return <abbr title="תפוס"></abbr>;
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "";
    if (isPast(date)) return "blocked-day";
    if (isBooked(date)) return "booked-day";
    if (range && date >= range[0] && date <= range[1]) return "selected-day";
    return "";
  };

  const nightsCount = () => {
    if (!range) return 0;
    const diff = range[1].getTime() - range[0].getTime();
    return Math.round(diff / (1000 * 3600 * 24)) + 1;
  };

  const totalPrice = nightsCount() * pricePerNight;

  const getDateArray = (start: Date, end: Date) => {
    const arr: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      arr.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return arr;
  };

  const onClickDayHandler = (date: Date) => {
    if (!user || !(user.role === "Guest" || user.role === "Owner")) return;

    if (user.role === "Guest" && (isPast(date) || isBooked(date))) return;
    if (user.role === "Owner" && isPast(date)) return;

    if (!range) setRange([date, date]);
    else {
      const [start] = range;
      if (date < start) setRange([date, start]);
      else setRange([start, date]);
    }
  };

  
  const book = () => {
    if (!range || !user || user.role !== "Guest") return;
    setModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!range || !user || user.role !== "Guest") return;

    try {
      await addBooking({
        userId: user.id,
        userName: user.name,
        zimmerId,
        zimmerName: zimmer.nameZimmer,
        startDate: range[0].toISOString(),
        endDate: range[1].toISOString(),
        totalPrice,
        status: 1,
      }).unwrap();

      alert("ההזמנה בוצעה בהצלחה!");
      setRange(null);
      setModalOpen(false);
      await refetch();
    } catch (err: unknown) {
      console.error(err);
      alert("שגיאה ביצירת הזמנה: " + JSON.stringify(err));
    }
  };

  const blockSelected = async () => {
    if (!range || !user || user.role !== "Owner") return;

    if (zimmer.ownerId !== user.id) {
      alert("אין לך אפשרות לחסום ימים בצימר זה. זה לא צימר שלך.");
      setRange(null);
      return;
    }

    const dates = getDateArray(range[0], range[1]);

    for (const d of dates) {
      if (!isPast(d)) {
        try {
          await blockDay({
            zimmerId,
            startDate: d.toISOString(),
            endDate: d.toISOString(),
            isBooked: true,
          }).unwrap();
        } catch (err: unknown) {
          console.error("שגיאה בעת חסימת יום:", err);
          alert("שגיאה בחסימת ימים: " + JSON.stringify(err));
          return;
        }
      }
    }

    await refetch();
    alert("הימים נחסמו!");
    setRange(null);
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-box">
        <Calendar
          selectRange
          value={range}
          onClickDay={onClickDayHandler}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>

      {user && (user.role === "Guest" || user.role === "Owner") ? (
        <div className="booking-summary">
          {range && user.role === "Guest" && (
            <>
              <h3>סיכום הזמנה</h3>
              <p>📅 מתאריך: {range[0].toLocaleDateString()}</p>
              <p>📅 עד תאריך: {range[1].toLocaleDateString()}</p>
              <p>🌙 לילות: {nightsCount()}</p>
              <p>💰 מחיר ללילה: ₪{pricePerNight}</p>
              <hr />
              <h2>סה"כ: ₪{totalPrice}</h2>
            </>
          )}

          {range && user.role === "Owner" && zimmer.ownerId === user.id && (
            <>
              <h3>חסימת ימים</h3>
              <p>📅 מתאריך: {range[0].toLocaleDateString()}</p>
              <p>📅 עד תאריך: {range[1].toLocaleDateString()}</p>
            </>
          )}

          <div className="booking-buttons">
            {user.role === "Guest" && <button className="book-btn" onClick={book}>הזמן עכשיו</button>}
            {user.role === "Owner" && zimmer.ownerId === user.id && (
              <button className="block-btn" onClick={blockSelected}>חסום ימים</button>
            )}
          </div>
        </div>
      ) : (
        <p className="admin-message">אין אפשרות להזמין או לחסום ימים. התחבר כ‑Guest או Owner.</p>
      )}

      {modalOpen && user?.role === "Guest" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>אישור הזמנה</h3>
            <p>צימר: {zimmer.nameZimmer}</p>
            <p>מתאריך: {range?.[0].toLocaleDateString()}</p>
            <p>עד תאריך: {range?.[1].toLocaleDateString()}</p>
            <p>לילות: {nightsCount()}</p>
            <h3>סה"כ: ₪{totalPrice}</h3>
            <div className="modal-buttons">
              <button className="book-btn" onClick={confirmBooking}>אישור</button>
              <button className="block-btn" onClick={() => setModalOpen(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
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
  
}

interface Props {
  zimmerId: number;
  pricePerNight: number;
  zimmer: Zimmer;
}

export default function ZimmerAvailability({ zimmerId, pricePerNight, zimmer }: Props) {
  const { data: days } = useGetAvailabilityByZimmerQuery(zimmerId);
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
    if (isPast(date)) return   <abbr title="עבר"></abbr>;
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
    if (!user) return;

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
    if (!range) return;
    setModalOpen(true); 
  };

  const confirmBooking = async () => {
    if (!range || !user) return;
      console.log("Booking payload being sent:", {
    userId: user.id,
    userName: user.name,
    zimmerId,
    zimmerName: zimmer.nameZimmer,
    startDate: range[0].toISOString(),
    endDate: range[1].toISOString(),
    totalPrice,
    status: 1
  });

    try {
      const result = await addBooking({
        
        userId: user.id,
        userName: user.name,
        zimmerId,
        zimmerName: zimmer.nameZimmer,
        startDate: range[0].toISOString(),
        endDate: range[1].toISOString(),
        totalPrice,
        status: 1
      }).unwrap();
        console.log("Frontend received from API:", result); // <-- הדפס כאן

      alert("ההזמנה בוצעה בהצלחה!");
      setRange(null);
      setModalOpen(false);
    } catch (err: unknown) {
      console.error(err);
      alert("שגיאה ביצירת הזמנה: " + JSON.stringify(err));
    }
  };

const blockSelected = async () => {
  if (!range || !user || user.role !== "Owner") return;
  const dates = getDateArray(range[0], range[1]);

  for (const d of dates) {
    if (!isPast(d)) {
      await blockDay({
        zimmerId,
        startDate: d.toISOString(),
        endDate: d.toISOString(),
        isBooked: true
      }).unwrap();
    }
  }

  alert("הימים נחסמו!");
  setRange(null);
};


  return (
    <div className="calendar-wrapper">
      <h3>יומן זמינות</h3>

      <Calendar
        selectRange
        value={range}
        onClickDay={onClickDayHandler}
        tileClassName={tileClassName}
        tileContent={tileContent}
      />

      {range && (
        <div className="booking-info">
          <p>מתאריך: {range[0].toLocaleDateString()}</p>
          <p>עד תאריך: {range[1].toLocaleDateString()}</p>
          <p>לילות: {nightsCount()}</p>
          <p>מחיר ללילה: ₪{pricePerNight}</p>
          <p>סה"כ: ₪{totalPrice}</p>
        </div>
      )}

      <div className="booking-buttons">
        {user?.role === "Guest" && (
          <button className="book-btn" onClick={book}>הזמן עכשיו</button>
        )}
        {user?.role === "Owner" && (
          <button className="block-btn" onClick={blockSelected}>חסום ימים</button>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>סיכום הזמנה</h4>
            <p><strong>צימר:</strong> {zimmer.nameZimmer}</p>
            <p><strong>מתאריך:</strong> {range?.[0].toLocaleDateString()}</p>
            <p><strong>עד תאריך:</strong> {range?.[1].toLocaleDateString()}</p>
            <p><strong>לילות:</strong> {nightsCount()}</p>
            <p><strong>סה"כ:</strong> ₪{totalPrice}</p>
            <div className="modal-buttons">
              <button onClick={confirmBooking} className="book-btn">אישור</button>
              <button onClick={() => setModalOpen(false)} className="block-btn">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useGetGuestBookingsQuery } from "../../redux/bookingApi";
import "./guestBooking.css";

export default function MyBookings() {
const { data: bookings, isLoading, isError } = useGetGuestBookingsQuery();

  if (isLoading) return <p className="message">טוען הזמנות...</p>;
  if (isError) return <p className="message error">שגיאה בטעינת ההזמנות שלך.</p>;

  return (
    <div className="my-bookings">
      <h2>ההזמנות שלי</h2>

      {bookings && bookings.length > 0 ? (
        bookings.map((b) => (
          <div key={b.bookingId} className="booking-card">
            <h4>{b.zimmerName}</h4>

            <p>
              {new Date(b.startDate).toLocaleDateString()} -{" "}
              {new Date(b.endDate).toLocaleDateString()}
            </p>

            <p>מחיר כולל: ₪{b.totalPrice}</p>
          </div>
        ))
      ) : (
        <p className="message">לא נמצאו הזמנות עבורך במערכת.</p>
      )}
    </div>
  );
}
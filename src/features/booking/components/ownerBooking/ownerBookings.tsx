import { useGetOwnerBookingsQuery } from "../../redux/bookingApi";
import "./ownerBooking.css";

export default function OwnerBookings() {
  const { data: bookings, isLoading, isError } = useGetOwnerBookingsQuery();

  if (isLoading) {
    return (
      <div className="loading-state">
        <p>טוען נתונים...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="empty-state">
        <p>אירעה שגיאה בטעינת הנתונים. נסה שוב מאוחר יותר.</p>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">הזמנות לצימרים שלי</h2>
      
      <div className="bookings-grid">
        {bookings && bookings.length > 0 ? (
          bookings.map((b) => (
            <div key={b.bookingId} className="booking-card">
              <div className="booking-info-section">
                <h4 className="zimmer-name">{b.zimmerName}</h4>
                <p className="user-info">
                  <strong>אורח:</strong> {b.userName}
                </p>
                <p className="booking-dates">
                  <span className="calendar-icon">📅</span>
                  {new Date(b.startDate).toLocaleDateString('he-IL')} - {new Date(b.endDate).toLocaleDateString('he-IL')}
                </p>
              </div>
              
              <div className="booking-status">
                הזמנה מאושרת
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>לא נמצאו הזמנות קיימות במערכת.</p>
          </div>
        )}
      </div>
    </div>
  );
}
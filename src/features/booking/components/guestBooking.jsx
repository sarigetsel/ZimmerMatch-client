import { useGetOwnerBookingsQuery } from "../redux/bookingApi";

export default function MyBookings() {
  const { data: bookings, isLoading, isError } = useGetOwnerBookingsQuery();

  if (isLoading) return <p>טוען הזמנות...</p>;
  if (isError) return <p>שגיאה בטעינת ההזמנות שלך.</p>;

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <h2>ההזמנות שלי</h2>
      {bookings && bookings.length > 0 ? (
        bookings.map((b) => (
          <div key={b.bookingId} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px", borderRadius: "8px" }}>
            <h4>{b.zimmerName}</h4>
            <p>
              {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
            </p>
            <p>מחיר כולל: ₪{b.totalPrice}</p>
          </div>
        ))
      ) : (
        <p>לא נמצאו הזמנות עבורך במערכת.</p>
      )}
    </div>
  );
}
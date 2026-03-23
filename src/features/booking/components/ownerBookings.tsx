import { useGetOwnerBookingsQuery } from "../../booking/redux/bookingApi";

export default function OwnerBookings() {
  const { data: bookings, isLoading } = useGetOwnerBookingsQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>הזמנות לצימרים שלי</h2>
      {bookings?.map(b => (
        <div key={b.bookingId}>
          <h4>{b.zimmerName}</h4>
          <p>משתמש: {b.userName}</p>
          <p>
            {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
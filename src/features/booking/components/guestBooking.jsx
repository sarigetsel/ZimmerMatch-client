import { useGetBookingsQuery } from "../redux/bookingApi";

export default function MyBookings() {
  const { data: bookings, isLoading } = useGetBookingsQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>ההזמנות שלי</h2>
      {bookings?.map(b => (
        <div key={b.bookingId}>
          <h4>{b.zimmerName}</h4>
          <p>
            {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
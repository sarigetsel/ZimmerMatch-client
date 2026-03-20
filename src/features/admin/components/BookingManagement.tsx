import { useState } from "react"
import { useGetBookingsQuery, useUpdateBookingMutation } from "../../booking/redux/bookingApi"
import { Booking } from "../../booking/redux/bookingSlice"

export default function AdminBookings() {
  const { data: bookings, isLoading } = useGetBookingsQuery()
  const [updateBooking] = useUpdateBookingMutation()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  if (isLoading) return <p>טוען הזמנות...</p>

  const handleOpenModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setModalOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return
    try {
      await updateBooking({
        id: selectedBooking.bookingId,
        data: { ...selectedBooking, status: 2 } 
      }).unwrap()
      setModalOpen(false)
      alert("הביטול בוצע בהצלחה!")
    } catch (err) {
      console.error(err)
      alert("אירעה שגיאה בביטול ההזמנה.")
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedBooking(null)
  }

  return (
    <div>
      <h2>כל ההזמנות</h2>
      <table>
        <thead>
          <tr>
            <th>משתמש</th>
            <th>צימר</th>
            <th>תאריך התחלה</th>
            <th>תאריך סיום</th>
            <th>מחיר</th>
            <th>סטטוס</th>
            <th>פעולה</th>
          </tr>
        </thead>
        <tbody>
          {bookings?.map((b: Booking) => (
            <tr key={b.bookingId}>
              <td>{b.userName}</td>
              <td>{b.zimmerName}</td>
              <td>{new Date(b.startDate).toLocaleDateString()}</td>
              <td>{new Date(b.endDate).toLocaleDateString()}</td>
              <td>{b.totalPrice}</td>
              <td className={
                b.status === 0 ? "status-pending" :
                b.status === 1 ? "status-confirmed" :
                "status-cancelled"
              }>
                {b.status === 0 ? "Pending" :
                 b.status === 1 ? "Confirmed" :
                 "Cancelled"}
              </td>
              <td>
                {b.status !== 2 && (
                  <button className="cancel-btn" onClick={() => handleOpenModal(b)}>בטל</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>אישור ביטול</h4>
            <p>אתה בטוח שברצונך לבטל את ההזמנה של {selectedBooking.userName} בצימר "{selectedBooking.zimmerName}"?</p>
            <div className="modal-buttons">
              <button className="block-btn" onClick={handleCloseModal}>ביטול</button>
              <button className="book-btn" onClick={handleConfirmCancel}>אישור ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
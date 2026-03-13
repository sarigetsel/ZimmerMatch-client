import { createSlice } from "@reduxjs/toolkit"
import { bookingApi } from "./bookingApi"

export interface Booking {
  bookingId: number
  userId: number
  userName: string
  zimmerId: number
  zimmerName: string
  startDate: string
  endDate: string
  totalPrice: number
  status: number
}

interface BookingState {
  listBookings: Booking[]
  status: string
  message: string | null
}

const initialState: BookingState = {
  listBookings: [],
  status: "idle",
  message: null
}

const bookingSlice = createSlice({

  name: "booking",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addMatcher(
        bookingApi.endpoints.getBookings.matchFulfilled,
        (state, action) => {
          state.listBookings = action.payload
          state.status = "success"
        }
      )

      .addMatcher(
        bookingApi.endpoints.getBookings.matchRejected,
        (state) => {
          state.status = "error"
          state.message = "Failed to load bookings"
        }
      )

      .addMatcher(
        bookingApi.endpoints.addBooking.matchFulfilled,
        (state, action) => {
          state.listBookings.push(action.payload)
        }
      )

      .addMatcher(
        bookingApi.endpoints.deleteBooking.matchFulfilled,
        (state, action) => {

          const deletedId = action.meta.arg.originalArgs

          state.listBookings =
            state.listBookings.filter(b => b.bookingId !== deletedId)
        }
      )

  }

})

export default bookingSlice.reducer
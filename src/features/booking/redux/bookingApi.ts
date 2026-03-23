import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Booking } from "./bookingSlice"

export const bookingApi = createApi({
  reducerPath: "booking",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7195/api/Booking",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token)
        headers.set("Authorization", `Bearer ${token}`)
      return headers
    }
  }),
  tagTypes: ["booking", "availability"],
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => "",
      providesTags: ["booking"]
    }),
    getBookingById: builder.query<Booking, number>({
      query: (id) => `/${id}`
    }),
    getOwnerBookings: builder.query<Booking[], void>({
      query: () => "/my-bookings",
      providesTags: ["booking"]
    }),
    addBooking: builder.mutation<Booking, {
      userId: number,
      userName: string,
      zimmerId: number,
      zimmerName: string,
      startDate: string,
      endDate: string,
      totalPrice: number,
      status: number
    }>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" }
      }),
      invalidatesTags: ["booking", "availability"]
    }),
    updateBooking: builder.mutation<Booking, { id: number; data: Booking }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["booking"]
    }),
    deleteBooking: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["booking"]
    }),
  }),
})

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useGetOwnerBookingsQuery,
  useAddBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} = bookingApi
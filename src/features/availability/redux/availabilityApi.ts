import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Availability {
  availabilityId: number
  zimmerId: number
  startDate: string
  endDate: string
  isBooked: boolean
}

interface BlockDayDto {
  zimmerId: number
  startDate: string
  endDate: string
  isBooked: boolean
}

export const availabilityApi = createApi({

  reducerPath: "availability",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7195/api/Availability",

    prepareHeaders: (headers) => {

      const token = localStorage.getItem("token")

      if (token)
        headers.set("Authorization", `Bearer ${token}`)

      return headers
    }
  }),

  tagTypes: ["availability"],

  endpoints: (builder) => ({

    getAvailabilityByZimmer: builder.query<Availability[], number>({
      query: (zimmerId) => `/zimmer/${zimmerId}`,
      providesTags: ["availability"]
    }),

blockDay: builder.mutation<void, BlockDayDto>({
  query: (data) => ({
    url: "/",
    method: "POST",
    body: data
  })
})

  })

})

export const {
  useGetAvailabilityByZimmerQuery,
  useBlockDayMutation
} = availabilityApi
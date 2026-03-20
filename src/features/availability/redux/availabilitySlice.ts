import { createSlice } from "@reduxjs/toolkit"
import { availabilityApi } from "./availabilityApi"

export interface Availability {
  availabilityId: number
  zimmerId: number
  startDate: string
  endDate: string
  isBooked: boolean
}

interface AvailabilityState {
  days: Availability[]
}

const initialState: AvailabilityState = {
  days: []
}

const availabilitySlice = createSlice({

  name: "availability",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder.addMatcher(
      availabilityApi.endpoints.getAvailabilityByZimmer.matchFulfilled,
      (state, action) => {
        state.days = action.payload
      }
    )

  }

})

export default availabilitySlice.reducer
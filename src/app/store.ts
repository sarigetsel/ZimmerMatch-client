import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { zimmerApi } from '../features/zimmer/redux/zimmerApi'
import zimmerReducer from '../features/zimmer/redux/zimmerSlice'

import { userApi } from '../features/user/redux/userApi'
import userReducer from '../features/user/redux/userSlice'

import { bookingApi } from '../features/booking/redux/bookingApi'
import bookingReducer from '../features/booking/redux/bookingSlice'

import { availabilityApi } from '../features/availability/redux/availabilityApi'
import availabilityReducer from '../features/availability/redux/availabilitySlice'

export const store = configureStore({

  reducer: {

    zimmerState: zimmerReducer,
    [zimmerApi.reducerPath]: zimmerApi.reducer,

    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,

    bookingState: bookingReducer,
    [bookingApi.reducerPath]: bookingApi.reducer,

    availabilityState: availabilityReducer,
    [availabilityApi.reducerPath]: availabilityApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(zimmerApi.middleware)
      .concat(userApi.middleware)
      .concat(bookingApi.middleware)
      .concat(availabilityApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
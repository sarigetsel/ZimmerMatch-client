import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { zimmerApi } from '../features/zimmer/redux/zimmerApi';
import zimmerReducer from '../features/zimmer/redux/zimmerSlice';
import { userApi } from '../features/user/redux/userApi';
import userReducer from '../features/user/redux/userSlice';

export const store = configureStore({
  reducer: {
    zimmerState: zimmerReducer,
    [zimmerApi.reducerPath]: zimmerApi.reducer,

    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(zimmerApi.middleware)
      .concat(userApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice } from '@reduxjs/toolkit';

export interface Zimmer {
    zimmerId: number;
    ownerId: number;
    nameZimmer: string;
    description: string;
    city: string;
    address: string;
    latitude: number;
    longitude: number;
    numRooms: number;
    pricePerNight: number;
    createdAt: string;
    facilities: string;
    arrImages?: string[];
}

interface ZimmerState {
  message: string | null;
  status: string;
  selectedZimmer: Zimmer | null;
  listFavoriteZimmers: Zimmer[];
}

const initialState: ZimmerState = {
  message: null,
  status: "idle",
  selectedZimmer: null,
  listFavoriteZimmers: [],
};

const zimmerSlice = createSlice({
  name: "zimmer",
  initialState,
  reducers: {

    addToFavoriteZimmers: (state, action) => {
      const exists = state.listFavoriteZimmers.find(
        z => z.zimmerId === action.payload.zimmerId
      );

      if (!exists) {
        state.listFavoriteZimmers.push(action.payload);
      }
    },

    setSelectedZimmer: (state, action) => {
      state.selectedZimmer = action.payload;
    },

  }
});

export const { addToFavoriteZimmers, setSelectedZimmer } = zimmerSlice.actions;

export default zimmerSlice.reducer;
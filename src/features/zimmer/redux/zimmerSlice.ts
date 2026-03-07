import { createSlice } from '@reduxjs/toolkit';
import { zimmerApi } from './zimmerApi'; 

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
  listZimmers: Zimmer[];
  selectedZimmer: Zimmer | null;
  listFavoriteZimmers: Zimmer[];
}

const initialState: ZimmerState = {
  message: null,
  status: "idle",
  listZimmers: [],
  selectedZimmer: null,
  listFavoriteZimmers: [],
};

const zimmerSlice = createSlice({
  name: "zimmer",
  initialState,
  reducers: {
    addToFavoriteZimmers: (state, action) => {
      state.listFavoriteZimmers.push(action.payload);
    },
    setSelectedZimmer: (state, action) => {
      state.selectedZimmer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        zimmerApi.endpoints.getZimmers.matchFulfilled,
        (state, action) => {
          state.listZimmers = action.payload;
          state.status = "success";
        }
      )
      .addMatcher(
        zimmerApi.endpoints.getZimmers.matchRejected,
        (state) => {
          state.status = "error";
          state.message = "Failed to load zimmers";
        }
      )
      .addMatcher(
        zimmerApi.endpoints.addZimmer.matchFulfilled,
        (state, action) => {
          state.listZimmers.push(action.payload);
          state.status = "success";
        }
      )
      .addMatcher(
        zimmerApi.endpoints.deleteZimmer.matchFulfilled,
        (state, action) => {
          const deletedId = action.meta.arg.originalArgs; 
          state.listZimmers = state.listZimmers.filter((z) => z.zimmerId !== deletedId);
        }
      );
  },
});

export const { addToFavoriteZimmers, setSelectedZimmer } = zimmerSlice.actions;

export default zimmerSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    listFavoriteZimmers: JSON.parse(localStorage.getItem("favoriteZimmers") || "[]"),
};

const zimmerSlice = createSlice({
    name: "zimmer",
    initialState,
    reducers: {
addToFavoriteZimmers: (state, action: PayloadAction<Zimmer>) => {
    const exists = state.listFavoriteZimmers.find(
        z => z.zimmerId === action.payload.zimmerId
    );
    
    if (!exists) {
        const limitedZimmer = { 
            ...action.payload, 
            arrImages: action.payload.arrImages && action.payload.arrImages.length > 0 
                ? [action.payload.arrImages[0]] 
                : [] 
        };
        
        state.listFavoriteZimmers.push(limitedZimmer);
        
        try {
            localStorage.setItem("favoriteZimmers", JSON.stringify(state.listFavoriteZimmers));
        } catch (e) {
            console.error("הזיכרון מלא, לא ניתן לשמור עוד מועדפים", e);
        }
    }
},
        removeFromFavoriteZimmers: (state, action: PayloadAction<number>) => {
            state.listFavoriteZimmers = state.listFavoriteZimmers.filter(
                z => z.zimmerId !== action.payload
            );
            localStorage.setItem("favoriteZimmers", JSON.stringify(state.listFavoriteZimmers));
        },
        setSelectedZimmer: (state, action: PayloadAction<Zimmer | null>) => {
            state.selectedZimmer = action.payload;
        },
    }
});

export const { 
    addToFavoriteZimmers, 
    removeFromFavoriteZimmers, 
    setSelectedZimmer 
} = zimmerSlice.actions;

export default zimmerSlice.reducer;
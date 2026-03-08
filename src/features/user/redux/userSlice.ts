import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "Guest" | "Owner" | "Admin";
}

export interface LoginRequest {
    Email: string;
    Password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

interface UserState {
    currentUser: User | null;
    token: string | null;
    status: "idle" | "loading" | "success" | "error";
    message: string | null;
}

const initialState: UserState = {
    currentUser: (() => {
        const savedUser = localStorage.getItem("user");
        if (!savedUser || savedUser === "undefined") return null;
        try {
            return JSON.parse(savedUser);
        } catch (e) {
            return e; 
        }
    })(),
    token: localStorage.getItem("token") || null,
    status: "idle",
    message: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<LoginResponse>) => {
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.currentUser = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }
});

export const { setAuth, logout } = userSlice.actions;
export default userSlice.reducer;
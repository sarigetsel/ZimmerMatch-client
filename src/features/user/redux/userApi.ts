import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {type User,type LoginRequest,type LoginResponse } from "./userSlice";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: "https://localhost:7195/api/User",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["user"],
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => "/",
            providesTags: ["user"]
        }),

        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials
            })
        }),

        register: builder.mutation<LoginResponse, FormData>({ 
            query: (formData) => ({
                url: "/register",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["user"]
        }),

        deleteUser: builder.mutation<void, number>({
            query: (id) => ({ 
                url: `/${id}`, 
                method: "DELETE" 
            }),
            invalidatesTags: ["user"]
        })
    })
});

export const { 
    useGetUsersQuery, 
    useLoginMutation, 
    useRegisterMutation, 
    useDeleteUserMutation 
} = userApi;
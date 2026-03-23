import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Zimmer } from './zimmerSlice';

export const zimmerApi = createApi({
  reducerPath: "zimmer",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7195/api/Zimmer",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["zimmer"],
  endpoints: (builder) => ({
    getZimmers: builder.query<Zimmer[], void>({
      query: () => "",
      providesTags: ["zimmer"]
    }),
    addZimmer: builder.mutation<Zimmer, FormData>({
      query: (formData) => ({ url: "/", method: "POST", body: formData }),
      invalidatesTags: ["zimmer"]
    }),
    updateZimmer: builder.mutation<Zimmer, { id: number; data: FormData }>({
      query: ({ id, data }) => ({ url: `/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["zimmer"]
    }),
    deleteZimmer: builder.mutation<void, number>({
      query: (id) => ({ url: `${id}`, method: "DELETE" }),
      invalidatesTags: ["zimmer"]
    }),
    searchZimmers: builder.query<Zimmer[], Partial<ZimmerSearchDto>>({
      query: (params) => ({
        url: "search",
        params,
      }),
      providesTags: ["zimmer"]
    }),
    getCities: builder.query<string[], void>({
      query: () => "cities"
    })
  }),
});

export const {
  useGetZimmersQuery,
  useAddZimmerMutation,
  useUpdateZimmerMutation,
  useDeleteZimmerMutation,
  useSearchZimmersQuery,
  useGetCitiesQuery,
} = zimmerApi;

export interface ZimmerSearchDto {
  FreeText?: string;
  MaxPrice?: number;
  City?: string;
  NumOfRooms?: number;
  FromDate?: string;
  ToDate?: string;
  HasPool?: boolean;
  HasJacuzzi?: boolean;
  HasSauna?: boolean;
}
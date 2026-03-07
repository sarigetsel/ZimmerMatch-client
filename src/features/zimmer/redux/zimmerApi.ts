import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Zimmer } from './zimmerSlice';
 

type ZimmerResponse = Zimmer[];

export const zimmerApi = createApi({
    reducerPath: "zimmer",
    baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7195/api/Zimmer",
     prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
     },
    }),
    tagTypes:["zimmer"],

    endpoints: (builder) => ({
        getZimmers: builder.query<ZimmerResponse, void>({
            query: () => "",
            providesTags:["zimmer"]
        }),
        addZimmer: builder.mutation<Zimmer, FormData>({
            query: (formData) => ({
                url: "/",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["zimmer"],

             /*async onQueryStarted(newZimmer, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    zimmerApi.util.updateQueryData('getZimmers', undefined, (draft) => {
                        draft.push({
                            ...newZimmer,
                            zimmerId: Date.now(), 
                        } as Zimmer);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo(); 
                }
            }, */
        }),
        deleteZimmer: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["zimmer"],

            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    zimmerApi.util.updateQueryData('getZimmers', undefined,(draft) => {
                        const index = draft.findIndex((z) => z.zimmerId === id);
                        if (index !== -1) draft.splice(index, 1);
                        })
                    );
                  
                try{
                    await queryFulfilled;
                }
                catch{
                    patchResult.undo();
                }
            },
        }),
   
    updateZimmer: builder.mutation<Zimmer, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["zimmer"],
    }),
  }),
});

export const {
  useGetZimmersQuery,
  useAddZimmerMutation,
  useUpdateZimmerMutation,
  useDeleteZimmerMutation,
} = zimmerApi
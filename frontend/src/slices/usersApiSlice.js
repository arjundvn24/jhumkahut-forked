import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: (pageNumber) => ({
        url: USERS_URL,
        params: { pageNumber },
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getMyWishlist: builder.query({
      query: () => ({
        url: `${USERS_URL}/myWishlist`,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    updateWishlist: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/myWishlist`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    deleteFromWishlist: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/deleteFromWishlist`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getMyCart: builder.query({
      query: () => ({
        url: `${USERS_URL}/myCart`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
  useGetMyCartQuery,
  useGetMyWishlistQuery,
  useUpdateWishlistMutation,
  useDeleteFromWishlistMutation,
} = userApiSlice;

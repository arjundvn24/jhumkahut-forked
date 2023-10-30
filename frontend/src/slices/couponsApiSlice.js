import { COUPONS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query({
      query: ({ pageNumber}) => ({
        url: COUPONS_URL,
        params: {pageNumber},
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Coupons'],
    }),
    getOrderCoupons: builder.query({
      query: () => ({
        url: `${COUPONS_URL}/orderCoupons`,
      }),
      keepUnusedDataFor: 5,
    }),
    getCouponById: builder.query({
        query: (couponId) => ({
          url: `${COUPONS_URL}/${couponId}`,
        }),
        keepUnusedDataFor: 5,
      }),
    getCouponByCode: builder.query({
      query: (code) => ({
        url: `${COUPONS_URL}/code`,
        params: {code}
      }),
      keepUnusedDataFor: 5,
    }),
    createCoupon: builder.mutation({
      query: () => ({
        url: `${COUPONS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPONS_URL}/${data.couponId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),
    deleteCoupon: builder.mutation({
      query: (couponCode) => ({
        url: `${COUPONS_URL}/${couponCode}`,
        method: 'DELETE',
      }),
      providesTags: ['Coupon'],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetOrderCouponsQuery,
  useGetCouponByIdQuery,
  useGetCouponByCodeQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponsApiSlice;

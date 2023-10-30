import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProductStock: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/updateStock`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
    getLTHProducts: builder.query({
      query: () => `${PRODUCTS_URL}/lth`,
      keepUnusedDataFor: 5,
    }),
    getWholesaleProducts: builder.query({
      query: () => `${PRODUCTS_URL}/wholesale`,
      keepUnusedDataFor: 5,
    }),
    getCategoryProducts: builder.query({
      query: ({ pageNumber, category }) => ({
        url: `${PRODUCTS_URL}/category/${category}`,
        params: { pageNumber },
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStockMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetLTHProductsQuery,
  useGetCategoryProductsQuery,
  useGetWholesaleProductsQuery,
} = productsApiSlice;

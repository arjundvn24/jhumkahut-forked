import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'Online' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state, item);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveCouponDiscount: (state,action) => {
      state.CouponDiscount = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    clearCouponDiscount: (state, action) => {
      state.CouponDiscount = 0;
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    saveFlatDiscount: (state,action) => {
      state.FlatDiscount = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    clearFlatDiscount: (state, action) => {
      state.FlatDiscount = 0;
      localStorage.setItem('cart', JSON.stringify(state));
      return updateCart(state);
    },
    setShipCoupon: (state,action) => {
      state.shipCoupon = action.payload;
      localStorage.setItem('cart',JSON.stringify(state) );
      return updateCart(state);
    },
    resetShipCoupon: (state,action) => {
      state.shipCoupon = false;
      localStorage.setItem('cart',JSON.stringify(state) );
      return updateCart(state);
    }
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  saveCouponDiscount,
  clearCouponDiscount,
  saveFlatDiscount,
  clearFlatDiscount,
  setShipCoupon,
  resetShipCoupon,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;

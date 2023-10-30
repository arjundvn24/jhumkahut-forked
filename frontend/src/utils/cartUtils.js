// export const addDecimals = (num) => {
//   return (Math.round(num * 100) / 100).toFixed(2);
// };

// export const updateCart = (state) => {
//   // Calculate the items price
//   state.itemsPrice = addDecimals(
//     state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
//   );

//   //Calculate discount
//   state.discount = addDecimals(
//   state.cartItems.reduce((accum,item) => accum + ((item.price * item.hasSale / 100)* item.qty) , 0)
//   );

//   //Add Coupon
//   const couponDiscountPercentage = state.CouponDiscount; 
//   state.couponDis = (state.FlatDiscount === 0 ? (addDecimals((state.itemsPrice - state.discount- state.taxPrice) * couponDiscountPercentage / 100)) : ( addDecimals(state.FlatDiscount)));
//   const grossPrice = state.itemsPrice - state.discount - state.couponDis;

//   // Calculate the shipping price
//   state.shippingPrice = addDecimals((state.shipCoupon ? 0 : (grossPrice < 199 ? 50 : (grossPrice < 399 ? 40 : (grossPrice < 699 ? 30 : 0)))));

//   //calculate convenienceFee
//   state.convenienceFee = addDecimals(state.paymentMethod === 'COD' ? (grossPrice < 499 ? 30 : (grossPrice < 999 ? 50 : 70)) : 0)

//   // Calculate the tax price
//   state.taxPrice = addDecimals(Number((0.03 * grossPrice / 1.03).toFixed(2)));
//   // const netValue = state.convenienceFee + state.shippingPrice + grossPrice;
//   // const taxablePrice = addDecimals(Number(netValue / 103 * 100).toFixed(2));
//   // state.taxPrice = addDecimals(Number(netValue - taxablePrice).toFixed(2));
//   // Calculate the total price
//   state.totalPrice = (
//         Number(state.itemsPrice) -
//         Number(state.discount) -
//         Number(state.couponDis)+
//         Number(state.shippingPrice) +
//         Number(state.convenienceFee)
//       ).toFixed(2);

//   // Save the cart to localStorage
//   localStorage.setItem('cart', JSON.stringify(state));

//   return state;
// };

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate the items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  //Calculate discount
  state.discount = addDecimals(
  state.cartItems.reduce((accum,item) => accum + ((item.price * item.hasSale / 100)* item.qty) , 0)
  );

  //Add Coupon
  const couponDiscountPercentage = state.CouponDiscount; 
  state.couponDis = (state.FlatDiscount === 0 ? (addDecimals((state.itemsPrice - state.discount) * couponDiscountPercentage / 100)) : ( addDecimals(state.FlatDiscount)));
  const grossPrice = state.itemsPrice - state.discount - state.couponDis;

   // Calculate the shipping price
  state.shippingPrice = addDecimals((state.shipCoupon ? 0 : (grossPrice < 199 ? 50 : (grossPrice < 399 ? 40 : (grossPrice < 699 ? 30 : 0)))));

  //Calculate convenienceFee
  state.convenienceFee = addDecimals(state.paymentMethod === 'COD' ? (grossPrice < 499 ? 30 : (grossPrice < 999 ? 50 : 70)) : 0)

  // Calculate the tax price
  const netValue = Number(state.convenienceFee) + Number(state.shippingPrice) + grossPrice;
  const taxablePrice = addDecimals(Number(netValue / 103 * 100).toFixed(2));
  state.taxPrice = addDecimals(Number(netValue - taxablePrice).toFixed(2));

  // Calculate the total price
  state.totalPrice = (
            Number(state.itemsPrice) -
            Number(state.discount) -
            Number(state.couponDis)+
            Number(state.shippingPrice) +
            Number(state.convenienceFee)
          ).toFixed(2);
  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state));

  return state;
};
import mongoose from 'mongoose';

const CouponSchema = mongoose.Schema(
  {
    code:{
      type: String,
      required: true,
    },
    givesDiscount: {
      type: Number,
      default: 0,
    },
    minOrder: {
      type: Number,
      default: null, // if not set then there is no minimum order value.
    },
    flatOff: {
      type: Number,
      default: null,
    },
    freeShip: {
        type: Boolean,
        default: false,
    },
    publicCoupon: {
      type: Boolean,
      default: false,
  },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', CouponSchema);

export default Coupon;

import asyncHandler from '../middleware/asyncHandler.js';
import Coupon from '../models/couponModel.js';

// @desc    Fetch all coupons
// @route   GET /api/coupons
// @access  Public
const getCoupons = asyncHandler(async (req, res) => {
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;
    console.log(page);
    const count = await Coupon.countDocuments({});
    const coupons = await Coupon.find({})
      .limit(pageSize)
      .skip(pageSize * (page - 1));
  
    res.json({ coupons, page, pages: Math.ceil(count / pageSize) });
  });

//@desc Get Order Based Coupons
//@route GET /api/coupons/order
//@access Public
const getOrderCoupons = asyncHandler(async (req, res) => {

  const coupons = await Coupon.find({publicCoupon: true})
    res.json({ coupons });
});


// @desc    Fetch single coupon
// @route   GET /api/coupons/:id
// @access  Public
const getCouponById = asyncHandler(async (req, res) => {
// NOTE: checking for valid ObjectId to prevent CastError moved to separate
// middleware. See README for more info.

const coupon = await Coupon.findById(req.params.id);
if (coupon) {
    return res.json(coupon);
} else {
    res.status(404);
    throw new Error('Coupon Invalid');
}
});

const getCouponByCode = asyncHandler(async (req, res) => {
  const code = req.query.code;
  const coupon = await Coupon.find({code : code});
  if (coupon) {
      return res.json(coupon);
  } else {
      res.status(404);
      throw new Error('Coupon Invalid');
  }
  });

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const coupon = new Coupon({
      code: 'Sample name',
      givesDiscount: 0,
      minOrder: 0,
      flatOff:0,
      freeShip: false,
      publicCoupon: false,
    });
  
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  });

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
  
    if (coupon) {
      await coupon.deleteOne({ _id: coupon._id });
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
    const { code, givesDiscount, flatOff,  minOrder, freeShip, publicCoupon } = req.body;
  
    const coupon = await Coupon.findById(req.params.id);
  
    if (coupon) {
      coupon.code = code;
      coupon.givesDiscount = givesDiscount;
      coupon.flatOff = flatOff;
      coupon.minOrder = minOrder;
      coupon.freeShip = freeShip;
      coupon.publicCoupon = publicCoupon;
  
      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
}
);

export {
    getCoupons,
    getOrderCoupons,
    getCouponById,
    getCouponByCode,
    createCoupon,
    deleteCoupon,
    updateCoupon,
}
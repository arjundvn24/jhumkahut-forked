import express from 'express';
const router = express.Router();
import {
    getCoupons,
    getCouponById,
    getCouponByCode,
    createCoupon,
    deleteCoupon,
    updateCoupon,
    getOrderCoupons,
} from '../controllers/couponController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route('/orderCoupons').get(protect, getOrderCoupons)
router.route('/code').get(getCouponByCode)
router
  .route('/:id')
  .get(checkObjectId, getCouponById)
  .put(protect, admin, checkObjectId, updateCoupon)
  .delete(protect, admin, checkObjectId, deleteCoupon);

export default router;

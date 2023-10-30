import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useGetOrderCouponsQuery } from '../slices/couponsApiSlice';
import Loader from './Loader';
import Message from '../components/Message';


const CouponList = () => {
    const {data: coupons, isLoading, error} = useGetOrderCouponsQuery();
    console.log(coupons);

  return (
    <>
    {isLoading ? (<Loader/>)
    : error ? (
        <Message variant='danger'>
        <h5>Couldn't find coupons</h5>
        </Message>
    )
    : (
    <ListGroup className='bg-green'>
      {coupons.coupons.length === 0 ?(
        <Message variant='flush'>
        No Coupons available at the moment
        </Message>
      ):(coupons.coupons.map((coupon) => (
        <ListGroup.Item key={coupon.id} className='bg-green'>
          <div className="d-flex justify-content-between">
            <div>
              <strong>{coupon.code}</strong>
            </div>
            <div>
              Min Order: <strong>₹{coupon.minOrder}</strong>
            </div>
          </div>
        </ListGroup.Item>
      )))}
    </ListGroup>)}
    </>
  );
};

export default CouponList;

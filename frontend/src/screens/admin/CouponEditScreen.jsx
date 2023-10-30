import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetCouponByIdQuery,
  useUpdateCouponMutation,
} from '../../slices/couponsApiSlice';

const CouponEditScreen = () => {
  const { id: couponId } = useParams();
  const [code, setCode] = useState('');
  const [givesDiscount, setGivesDiscount] = useState(0);
  const [flatOff, setFlatOff] = useState(0);
  const [minOrder, setMinOrder] = useState(0);
  const [freeShip, setFreeShip] = useState(false);
  const [publicCoupon, setPublicCoupon] = useState(false);
  const {
    data: coupon,
    isLoading,
    refetch,
    error,
  } = useGetCouponByIdQuery(couponId);

  const [updatecoupon, { isLoading: loadingUpdate }] =
    useUpdateCouponMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updatecoupon({
        couponId,
        code,
        givesDiscount,
        flatOff,
        minOrder,
        freeShip,
        publicCoupon,
      });
      toast.success('coupon updated');
      refetch();
      navigate('/admin/couponlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code);
      setGivesDiscount(coupon.givesDiscount);
      setFlatOff(coupon.flatOff);
      setMinOrder(coupon.minOrder);
      setFreeShip(coupon.freeShip);
      setPublicCoupon(coupon.publicCoupon);
    }
  }, [coupon]);

  return (
    <>
      <Link to='/admin/couponlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1 className='heading-font'>Edit Coupon</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='code'>
              <Form.Label>Code</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Code'
                value={code}
                onChange={(e) => setCode(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='discount'>
              <Form.Label>Gives Discount</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Discount'
                value={givesDiscount}
                onChange={(e) => setGivesDiscount(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='min-order'>
              <Form.Label>Minimum Order</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Minimum Order Limit'
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='flat-off'>
              <Form.Label>Flat Off</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Flat Off value'
                value={flatOff}
                onChange={(e) => setFlatOff(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='freeShip'>
              {coupon.freeShip ? 
               (
                <Form.Check
                type='checkbox'
                label='No Free Shipping'
                onChange={(e) => setFreeShip(!e.target.checked)}
              ></Form.Check>
              ) 
              : (<Form.Check
                type='checkbox'
                label='Gives Free Shipping'
                onChange={(e) => setFreeShip(e.target.checked)}
              ></Form.Check>)}
            </Form.Group>

            <Form.Group className='my-2' controlId='publicCoupon'>
              {!coupon.publicCoupon ? 
               (
                <Form.Check
                type='checkbox'
                label='Make it public'
                onChange={(e) => setPublicCoupon(e.target.checked)}
              ></Form.Check>
              ) 
              : (<Form.Check
                type='checkbox'
                label='Make it hidden'
                onChange={(e) => setPublicCoupon(!e.target.checked)}
              ></Form.Check>)}
            </Form.Group>

            <div className='buttons'>
            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          
            
            </div>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default CouponEditScreen;

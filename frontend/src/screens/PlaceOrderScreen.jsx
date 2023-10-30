import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card, Form, ListGroupItem } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems, clearCouponDiscount, setShipCoupon, saveCouponDiscount,resetShipCoupon, saveFlatDiscount, clearFlatDiscount } from '../slices/cartSlice';
import ScrollToTop from '../components/ScrollToTop';
import { useUpdateProductStockMutation } from '../slices/productsApiSlice';
import { FaCheck } from 'react-icons/fa';
import { useGetCouponByCodeQuery} from '../slices/couponsApiSlice';
import BestSellers from '../components/BestSellers';
import CouponList from '../components/couponList';
import { useGetRazorpayClientIdQuery, usePayOrderMutation, useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import { updateCart } from '../utils/cartUtils';

const PlaceOrderScreen = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [updateStock, {isLoading: loadStock, error: err}] = useUpdateProductStockMutation();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const { data: coupon, isLoading: loadingCoupon, error: errorCoupon } = useGetCouponByCodeQuery(couponCode);


  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);


  // Razorpay code starts
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  let res = {};

  const {
    data: razorpayId,
    // refetch : refetchRazorpay,
    isLoading: loadRazorpay,
    error: errs,
  } = useGetRazorpayClientIdQuery();

  let amount = 0;
  if (!isLoading && cart) {
    amount = Math.round(cart.totalPrice * 100);
  }

  let key = ' ';
  if (!loadRazorpay && razorpayId) {
    key = razorpayId.clientId;
  }
  
  const onApprove = async (orderId,details) => {
    try {
    await payOrder({orderId, details});
    } catch(err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const options = {
    key: key,
    amount: amount,
    name: 'JhumkaHut',
    description: 'Thank you for shopping with us.',
    image: 'https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png',
    
    handler: function(response) {
        onApprove(res._id,response);
        toast.success('Payment Successful!');
        navigate(`/order/${res._id}`);
        dispatch(clearCartItems());
        dispatch(clearFlatDiscount(cart));
        dispatch(clearCouponDiscount(cart));
        dispatch(resetShipCoupon(cart));
        navigate(`/order/${res._id}`);
    },
    theme: {
        color: '#e1999f',
        hide_topbar: false
    }
};

const displayRazorpay = () => {
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
};

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
}, []);

  // razorpay code ends
  const placeOrderHandler = async () => {
      try {
        res = await createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          discount: cart.discount,
          couponDiscount: cart.couponDis,
          shippingPrice: cart.shippingPrice,
          convenienceFee: cart.convenienceFee,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }).unwrap()

        cart.cartItems.forEach(async (item) => {
          await updateStock({
            productId: item._id,
            stockReduceBy: item.qty,
          });
        });

        if(cart.paymentMethod === 'Online'){
          displayRazorpay();
        }

        if(cart.paymentMethod === 'COD'){
          dispatch(clearCartItems());
          dispatch(clearFlatDiscount(cart));
          dispatch(clearCouponDiscount(cart));
          dispatch(resetShipCoupon(cart));
          navigate(`/order/${res._id}`);
        }
      } catch (err) {
        toast.error(err);
      }
  };

  const checkCouponHandler = () => {

    if (!couponCode || couponCode === '') {
      toast.error('Please enter a coupon code');
    }

    else if(coupon.length === 1){
      if((cart.itemsPrice - cart.taxPrice - cart.discount) > coupon[0].minOrder)
      {
      dispatch(saveFlatDiscount(coupon[0].flatOff));
      dispatch(saveCouponDiscount(coupon[0].givesDiscount));
      dispatch(setShipCoupon(coupon[0].freeShip));
      setAppliedCouponCode(coupon[0].code);
      setCouponCode('');
      toast.success('Coupon Applied');
      }
      else{toast.error(`Add 
      ₹${(coupon[0].minOrder - (cart.itemsPrice - cart.taxPrice - cart.discount)).toFixed(2)} 
      more to apply this coupon`)}
    }
    else(toast.error('Invalid Coupon'))
  };

  return (
    <>
      <ScrollToTop/>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '},
                {cart.shippingAddress.State}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Discount</Col>
                  <Col className='text-green'> - ₹{cart.discount}</Col>
                </Row>
              </ListGroup.Item>
              {Number(cart.couponDis) !== 0 ? 
              (<>
              <ListGroup.Item>
                <Row>
                  <Col>Coupon Discount</Col>
                  <Col className='text-green'>- {cart.couponDis}</Col>
                </Row>
                <Row>
                  <Col className='text-green' style={{fontSize:'0.8rem'}}>{appliedCouponCode}</Col>
                </Row>
              </ListGroup.Item>
              </>
              )
               : ('')}

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{Number(parseFloat(cart.shippingPrice) + parseFloat(cart.convenienceFee))}</Col>
                </Row>
              </ListGroup.Item>

              {/* {cart.convenienceFee ? (<ListGroup.Item>
                <Row>
                  <Col>Convenience Fee</Col>
                  <Col>₹{cart.convenienceFee}</Col>
                </Row>
              </ListGroup.Item>) : (<></>)} */}

              <ListGroup.Item>
                <Row style={{fontWeight:'700'}}>
                  <Col >Total</Col>
                  <Col>₹{cart.totalPrice}</Col>
                </Row>
                <Row>
                  <Col style={{fontSize:'0.8rem'}}>( Including ₹{cart.taxPrice} in taxes )</Col>
                </Row>
              </ListGroup.Item>

              {/* tax birfurcation */}
              {/* <ListGroup.Item>
                <Row>
                  <Col>Tax (3%) </Col>
                  <Col>₹{cart.taxPrice}</Col>
                  {cart.shippingAddress.State === 'Rajasthan' && (
                    <>
                    <Row>
                    <Col>CGST (1.5%)</Col>
                    <Col>₹{cart.taxPrice / 2}</Col>
                    </Row>
                    <Row>
                    <Col>SGST (1.5%)</Col>
                    <Col>₹{cart.taxPrice / 2}</Col>
                    </Row>
                    </>
                  )}
                  {cart.shippingAddress.State !== 'Rajasthan' && (
                    <>
                    <Row>
                    <Col>IGST (3%)</Col>
                    <Col>₹{cart.taxPrice}</Col>
                    </Row>
                    </>
                  )}
                </Row>
              </ListGroup.Item> */}
              

          <ListGroup.Item>
          <Row>
            <Form.Group className='my-2' controlId='coupon'>
            <Form.Label>Have a Coupon Code ?</Form.Label>
            <div className='btn-flex'>
            <Form.Control style={{marginRight:'1rem'}}
              type='coupon'
              placeholder='Enter coupon'
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            ></Form.Control>
            <Button
                  type='button'
                  className='btn-block'
                  disabled={couponCode === ''}
                  onClick={checkCouponHandler}
                >
                  <FaCheck />
                </Button>
                </div>
            </Form.Group>
            <CouponList/>
          </Row>
        </ListGroup.Item>
              
                {(error || err) && 
                <ListGroup.Item>
                <Message variant='danger'>{error?.message}</Message>
                </ListGroup.Item>}
              
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {(isLoading || loadStock )&& <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row>
      <Col lg={8}>
      <h2 style={{padding:'1.2rem'}}>Recommended</h2>
      <BestSellers viewBorder={false}/>
      </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;

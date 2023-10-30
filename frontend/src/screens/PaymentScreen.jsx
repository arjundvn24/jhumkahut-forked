import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import ScrollToTop from '../components/ScrollToTop';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [shipCharge, setShipCharge] = useState(0);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    dispatch(savePaymentMethod(paymentMethod));
    setShipCharge(
      parseFloat(cart.convenienceFee) + parseFloat(cart.shippingPrice)
    );
  }, [paymentMethod, cart.convenienceFee, cart.shippingPrice, dispatch]);

 

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <ScrollToTop/>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-2'
              type='radio'
              label='Prepaid'
              id='Online'
              name='paymentMethod'
              value='Online'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <span style={{fontSize:'0.8rem',paddingLeft:'1.3rem',
                  position: 'relative',top:'-0.8rem'}}>
            ( UPI / Wallets / Debit or Credit Card ) 
            {paymentMethod === 'Online' && <span style={{fontWeight:'700'}}> Shipping: ₹{shipCharge} </span>}
            </span>
            <Form.Check
              className='my-2'
              type='radio'
              label='Cash On Delivery'
              id='COD'
              name='paymentMethod'
              value='COD'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <span style={{fontSize:'0.8rem',paddingLeft:'1.3rem',
                  position: 'relative',top:'-0.8rem'}}>
            ( Pay at your doorstep ) 
            {paymentMethod === 'COD' && <span style={{fontWeight:'700'}}> Shipping: ₹{shipCharge} </span>} 
            </span>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;

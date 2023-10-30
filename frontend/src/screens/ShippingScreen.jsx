import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import ScrollToTop from '../components/ScrollToTop';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [State, setState] = useState(shippingAddress?.State || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, 
      State,
       postalCode, country }));
    navigate('/payment');
  };

  useEffect(() => {
    const fetchPostalCodeDetails = async () => {
      try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${postalCode}`);
        const { Status, PostOffice } = response.data[0];

        if (Status === 'Success' && PostOffice) {
          const { District, 
            State,
             Country } = PostOffice[0];
          setCity(District);
          setState(State);
          setCountry(Country);
        } else {
          setCity('');
          setState('');
          setCountry('');
        }
      } catch (error) {
        console.log('Error:', error.message);
        alert("Sorry! We couldn't find the specified post code.");
      }
    };

    if (postalCode) {
      fetchPostalCodeDetails();
    }
  }, [postalCode]);

  return (
    <FormContainer>
      <ScrollToTop/>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='State'>
          <Form.Label>State</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter state'
            value={State}
            required
            onChange={(e) => setState(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;

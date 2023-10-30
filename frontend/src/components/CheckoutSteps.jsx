import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faTruckFast, faCreditCard, faBagShopping } from '@fortawesome/free-solid-svg-icons';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to='/login'>
            <Nav.Link className='icon-flex'>
            <FontAwesomeIcon icon={faCircleCheck} />
              Sign In
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='icon-flex'>
            <FontAwesomeIcon icon={faCircleCheck} className="thin-icon"/>
            Sign In
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to='/shipping'>
            <Nav.Link className='icon-flex'>
            <FontAwesomeIcon icon={faTruckFast} />
              Shipping
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='icon-flex'>
            <FontAwesomeIcon icon={faTruckFast}/>
            Shipping
            </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to='/payment'>
            <Nav.Link className='icon-flex'>
            <FontAwesomeIcon icon={faCreditCard} />
              Payment
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='icon-flex'>
            <FontAwesomeIcon icon={faCreditCard} />
            Payment
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step4 ? (
          <LinkContainer to='/placeorder'>
            <Nav.Link className='icon-flex'>
            <FontAwesomeIcon icon={faBagShopping} />
              Place Order
            </Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className='icon-flex'>
            <FontAwesomeIcon icon={faBagShopping} />
            Place Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;

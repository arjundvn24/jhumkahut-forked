import React from 'react'
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { useGetWholesaleProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ScrollToTop from '../components/ScrollToTop';

const WholeSale = () => {
  const { data, isLoading, error } = useGetWholesaleProductsQuery();
  return isLoading ? <><ScrollToTop/><Loader /></> : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <div>
    <ScrollToTop />
  <div className="wholesale-container">
    <div className='wholesale-inner-container'>
      <h2 className='heading-font text-black'>Wholesale Inquiry</h2>
      <p className='text-black'>The below products are available at WholeSale prices when bought in larger quantities.
      </p>
      <Row>
        {data.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='wholesale-products'>
            <Product product={product} viewPrice={false}/>
          </Col>
        ))}
      </Row>

      <p className='text-black'>
        <br/>
        For further enquiries contact: <span className='font-bold'>7014698318 / 8949440387</span>
      </p>
      
      </div>
    </div>
    </div>
  );
};

export default WholeSale

// import { Link } from 'react-router-dom';
// import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';


const BestSellers = ({viewBorder = true}) => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Row className={viewBorder ? 'bestseller-border' : ''}>
        {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='wide-50'>
            <Product product={product} />
            </Col>
        ))}
    </Row>
  );
};

export default BestSellers;

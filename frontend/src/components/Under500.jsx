import Message from './Message';
import { useGetLTHProductsQuery, useGetTopProductsQuery } from '../slices/productsApiSlice';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';


const Under500 = ({viewBorder = true}) => {
  const { data: products, isLoading, error } = useGetLTHProductsQuery();

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

export default Under500;

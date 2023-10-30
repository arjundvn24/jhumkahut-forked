import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import Category from '../components/Category';
import BestSellers from '../components/BestSellers';
import Divider from '../components/Divider';
import ScrollToTop from '../components/ScrollToTop';
import Under500 from '../components/Under500';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <>
        <ProductCarousel />
        <Divider />
        <h1 className='centered text-black heading-font'>SHOP BY CATEGORY</h1>
        <Category />
        <h1 className='centered text-black heading-font'>BESTSELLERS</h1>
        <BestSellers />
        <h1 className='centered text-black heading-font'>UNDER ₹500 STORE</h1>
        <Under500 viewBorder={false}/>
        <h1 className='centered text-black heading-font' id='shopall'>SHOP ALL</h1>
        </>
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          
          {keyword ? (<><ScrollToTop/><h1 className='centered heading-font'>Search results: “{keyword.toUpperCase()}”</h1></>) : ("") }
          {data.products.length < 1 ? 
          (
            <h5 className='centered heading-font' style={{fontWeight:'300'}}>No Products Found !</h5>
          ) : (
            <div>
            <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='wide-50'>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
          </div>
          )}
          
          
        </>
      )}
    </>
  );
};

export default HomeScreen;

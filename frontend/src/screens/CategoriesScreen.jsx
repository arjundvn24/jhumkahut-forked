import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetCategoryProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import ScrollToTop from '../components/ScrollToTop';
import { useNavigate } from 'react-router-dom';

const CategoriesScreen = () => {
  const { pageNumber, keyword, category} = useParams();
  const { data, isLoading, error } = useGetCategoryProductsQuery({
    keyword,
    pageNumber,
    category,
  });
  const navigate = useNavigate();
  const goBack = () => {
		navigate(-1);
	}
  return (
    <>  
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <>
          <Meta />
          <ScrollToTop/>
          <button onClick={goBack} className='btn btn-light mb-4'>
          Go Back
        </button>
          {/* <h1>New Arrivals</h1> */}
          <h1 className='centered heading-font' id='shopall'>SHOP {category.toUpperCase()}</h1>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='wide-50'>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            isCategoryPage = 'true'
            pages={data.pages}
            page={data.page}
            keyword=''
          />
          </>
          )}
    </>
  );
};

export default CategoriesScreen;

import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

import banner1 from '../assets/images/banner-1.jpg'
import banner2 from '../assets/images/banner-2.jpg'
import banner3 from '../assets/images/banner-3.jpg'
import banner4 from '../assets/images/banner-4.jpg'


const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {/* {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2 className='text-white text-right'>
                {product.name} (₹{product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))} */}
      
        <Carousel.Item>
          <Link to='/'>
            <Image src={banner1} className='image-fluid2' />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to='/'>
            <Image src={banner2} className='image-fluid2' />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to='/'>
            <Image src={banner3} className='image-fluid2' />
          </Link>
        </Carousel.Item>
        <Carousel.Item>
          <Link to='/'>
            <Image src={banner4} className='image-fluid2' />
          </Link>
        </Carousel.Item>
    </Carousel>
  );
};

export default ProductCarousel;

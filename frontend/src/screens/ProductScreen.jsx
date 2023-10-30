import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  Carousel,
  ListGroup,
  Button,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart, clearCouponDiscount, clearFlatDiscount, resetShipCoupon } from '../slices/cartSlice';
import ScrollToTop from '../components/ScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart, faShareNodes, faTruckFast}from '@fortawesome/free-solid-svg-icons';
import { useUpdateWishlistMutation } from '../slices/usersApiSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const state = useSelector((state) => state.cart);

  const [updateWishlist, { isLoading: loadingWishlist }] = useUpdateWishlistMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    dispatch(clearCouponDiscount(state));
    dispatch(resetShipCoupon(state));
    dispatch(clearFlatDiscount(state));
    navigate('/cart');
  };

  const addToWishListHandler = async() =>{
    navigate(`/login?redirect=/product/${productId}`);
    try {
      const res = await updateWishlist({productId});
      if(res.data.message === 'Item already exists in the wishlist')
      { toast.error(res.data.message); }
      else if(res.data.message === 'Item added to the wishlist')
      { toast.success(res.data.message); }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  }

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const copyToClipboard = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL)
      .then(() => {
        toast.success('URL copied to clipboard!');
      })
      .catch((err) => {
        toast.error('Failed to copy URL');
      });
    }

  function isImage(url) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const ext = url.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  }

  return (
    <>
    <ScrollToTop/>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className='small-container'>
          <Meta title={product.name+' - '+product.brand} description={product.description} />
          <Row className='sp-even'>
            <Col md={6} className='overflow-hidden height-adjust width-adjust'>
              <Carousel
              style={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height:'100%',
                width: '100%'}}
              >
                {/* {product.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <Image className='carousel-image' src={image} alt={product.name} fluid />
                  </Carousel.Item>
                ))} */}
                {product.images.map((item, index) => (
                  <Carousel.Item key={index}>
                    {!isImage(item) ? ( 
                     <video src={item} className='carousel-video' controls autoPlay loop muted
                      style={{objectFit: 'cover',
                        width:'100%',
                        height: '100%',
                    }}/>) 
                    : (
                      <Image className='carousel-image' src={item} alt={product.name} fluid
                      style={{objectFit: 'cover',
                      width:'100%',
                      height: '100%',
                    }} />
                  )}
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col md={3}>
            <ListGroup.Item>
                  <h3 className='py-2'>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: 
                  <div className='product-price'>
                  <h5 className={product.hasSale === 0 ? '' : 'strike-it'}>₹{product.price}</h5>
                  <h5 className='text-green'>{product.hasSale ? <span> &nbsp; ₹{(product.price - (product.price * product.hasSale/100)).toFixed(2)}</span> : (<span></span>)}</h5>
                  {/* <h5 className='text-green'>{product.hasSale ? <span> &nbsp; ₹{product.hasSale}</span> : (<span></span>)}</h5> */}
                  </div>
                </ListGroup.Item>
                         
                <ListGroup variant='flush'>
                  {/* <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>₹{product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item> */}
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Qty Select */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item className='btn-flex' style={{alignContent:'center'}}>
                    <Button
                      className='btn-block marRt'
                      type='button'
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>

                    <Button
                      className='btn-block'
                      type='button'
                      // disabled={product.countInStock === 0}
                      onClick={addToWishListHandler}
                    >
                      <FontAwesomeIcon icon={faHeart} className='fa-lg'/>
                    </Button>

                    <Button
                      className='btn-block'
                      type='button'
                      onClick={copyToClipboard}
                      style={{position: 'relative',
                        marginLeft:'0.5rem'}}
                    >
                      <FontAwesomeIcon style={{fontSize:'1.5rem'}}icon={faShareNodes}/>
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
            </Col>
          </Row>
          <Row className='review'>
          <Col md={6}>
           <ListGroup style={{fontWeight:'700'}}>
            <div className='text-black'>
            <span><FontAwesomeIcon icon={faTruckFast} /></span> FREE Shipping on prepaid orders above ₹699.
              </div>
              </ListGroup>
              <ListGroup style={{marginBottom:'1rem'}} variant='flush'>
                Delivery: Within 5-7 business days.
              </ListGroup>
              <ListGroup variant='flush'>
              Description: {product.description}
              </ListGroup>
            </Col>
            <Col md={3} className='add-pad'>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup>
                  <h2>Write a Customer Review</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default ProductScreen;

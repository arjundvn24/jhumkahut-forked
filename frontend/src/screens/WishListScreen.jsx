import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, clearCouponDiscount, clearFlatDiscount, resetShipCoupon } from '../slices/cartSlice';
import ScrollToTop from '../components/ScrollToTop';
import { useDeleteFromWishlistMutation, useGetMyWishlistQuery, useUpdateWishlistMutation } from '../slices/usersApiSlice';
import Loader from '../components/Loader';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


const WishListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState('No User Found');

//  useEffect(()=>{
//     if(userInfo){
//       setUserId(userInfo._id);
//     }
//   },[userInfo] )

  useEffect(() => {
    if(userInfo){
      setUserId(userInfo._id);
    }
    if (!userInfo) {
      // Navigate to the login page if the user is not logged in
      navigate('/login?redirect=/wishlist');
    }
  }, [userInfo, navigate]);

  const cart = useSelector((state) => state.cart);

    const { data: wishlist, isLoading, error } = useGetMyWishlistQuery();

  const addToCartHandler = async (product, qty = 1) => {
    dispatch(addToCart({ ...product, qty}));
    dispatch(clearCouponDiscount(cart));
    dispatch(clearFlatDiscount(cart));
    dispatch(resetShipCoupon(cart));
    removeFromWishlistHandler(product._id);
  };

  const [deleteFromWishlist, { isLoading: loadingWishlist }] = useDeleteFromWishlistMutation();

  const removeFromWishlistHandler = async(id) => {
    try {
      const res = await deleteFromWishlist({id, userId});
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const goBack = () => {
		navigate(-1);
	}

  return (
    <>
    <ScrollToTop/>
    <Row>
      <Col md={12} sm={8} >
        <h1 className="heading-font"style={{ marginBottom: '20px' }}>Your Wishlist</h1>
        {isLoading ? (<Loader/>) 
        : (<>
        {wishlist.wishlist.length === 0 ? (
          <Message>
            Products you add to your wishlist appear here <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <>
        <button onClick={goBack} className='btn btn-light mb-4'>
          Go Back
        </button>
          <ListGroup variant='flush'>
            {wishlist.wishlist.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>₹{(item.price - (item.price * item.hasSale / 100)).toFixed(2)}</Col>
                  <Col md={2}>
                    <Button
                      className='btn-block'
                      type='button'
                      disabled={item.countInStock === 0}
                      onClick={() => addToCartHandler(item)}
                    >
                      Add To Cart
                    </Button>
                  </Col>
                  <Col md={1}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromWishlistHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          </>
        )}
        </>)}
        
      </Col>
    </Row>
    </>
  );
};

export default WishListScreen;

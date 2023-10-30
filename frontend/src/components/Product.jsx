// import { Card } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import Rating from './Rating';

// const Product = ({ product, viewPrice=true }) => {
//   return (
//     <Card className='my-3 rounded cards__item__link'>
//       <Link to={`/product/${product._id}`} style={{textDecoration: 'none'}} >
//         <div className='cards__item__pic-wrap'>
//         <Card.Img src={product.image} variant='top' className='cards__item__img'/>
//         </div>
//       </Link>

//       <Card.Body className='cards__item__info'>
//         <Link to={`/product/${product._id}`} style={{textDecoration: 'none'}}>
//           <Card.Title as='div' className='product-title'>
//             <strong>{product.name}</strong>
//           </Card.Title>
//         </Link>

//         <Card.Text as='div' >
//           <Rating
//             value={product.rating}
//             text={`${product.numReviews} reviews`}
//           />
//         </Card.Text>
//         {product.countInStock > 0 ? (<div className='product-price'>
//         {viewPrice? (<Card.Text as='h5' className={product.hasSale === 0 ? '' : 'strike-it'}>₹{product.price}</Card.Text>) : ('') }
//         {viewPrice? ( <Card.Text as='h5' className='text-green'>{product.hasSale ? <span> &nbsp; ₹{product.price - (product.price * product.hasSale/100)}</span> : (<span></span>)}</Card.Text>) 
//         : ('')}
//         </div>) : (
//           <div className='product-price'>
//             <Card.Text as='h5' className='text-red'> Sold Out </Card.Text>
//           </div>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default Product;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-regular-svg-icons'
import { useUpdateWishlistMutation } from '../slices/usersApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Product = ({ product, viewPrice = true }) => {

  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => { setIsHovered(true); };
  const handleMouseLeave = () => { setIsHovered(false); };
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const checkScreenSize = () => { setIsSmallScreen(window.innerWidth <= 1024); };
  
  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const { userInfo } = useSelector((state) => state.auth);

  const [updateWishlist, { isLoading: loadingWishlist }] = useUpdateWishlistMutation();
  const addToWishListHandler = async(productId) =>{
    navigate('/login?');    
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

  return (
    <Card
      className={`my-3 rounded cards__item__link ${isHovered || isSmallScreen ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
        <div className='cards__item__pic-wrap'>
          <Card.Img src={product.image} variant='top' className='cards__item__img' />
        </div>
      </Link>

      <Card.Body className={`cards__item__info ${isHovered || isSmallScreen? 'hovered' : ''}`}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </Card.Text>
        {product.countInStock > 0 ? (
          <div className='product-price'>
            {viewPrice ? (
              <Card.Text as='h5' style={{fontSize:'1.15rem'}}>
                <span className={product.hasSale === 0 ? '' : 'strike-it'}>₹{product.price} </span>
                
                {product.hasSale ? (
                  <span className='text-green'> &nbsp; ₹{(product.price - (product.price * product.hasSale / 100)).toFixed(2)}</span>
                  // <span> &nbsp; ₹{product.hasSale}</span>
                ) : (
                  <span></span>
                )}
              </Card.Text>
            ) : (
              ''
            )}
          </div>
        ) : (
          <div className='product-price'>
            <Card.Text as='h5' className='text-red'>
              Sold Out
            </Card.Text>
          </div>
        )}
        {(isHovered || isSmallScreen) && (
        <div className='wishlist-button'>
          <button onClick={() => addToWishListHandler(product._id)}> <FontAwesomeIcon icon={faHeart} className='fa-lg'/> Add To Wishlist </button>
        </div>
      )}
      </Card.Body>
    </Card>
  );
};

export default Product;


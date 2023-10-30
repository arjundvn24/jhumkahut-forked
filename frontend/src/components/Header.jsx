import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart as fillHeart}from '@fortawesome/free-solid-svg-icons';
import {faHeart} from '@fortawesome/free-regular-svg-icons'
import './fonts.css'
const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleWishlistClick = () => {
    navigate('/login?redirect=/wishlist');
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect id='top'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              {/* <img src={logo} alt='ProShop' 
              height='40'
              loading='lazy'/> */}
              <span className='brand-name'>JhumkaHut</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav>
            <SearchBox />

            <LinkContainer to='/'>
                <Nav.Link>
                  Home
                </Nav.Link>
              </LinkContainer>

            <NavDropdown title='Categories'>
              <LinkContainer to='/Earrings'>
                <NavDropdown.Item>
                  Earrings
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to='/Necklaces'>
                <NavDropdown.Item>
                  Necklaces
                </NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to='/Chains'>
                <NavDropdown.Item>
                  Chains
                </NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>  

            <LinkContainer to="/wishlist" onClick={handleWishlistClick}>
              <Nav.Link>
              <FontAwesomeIcon icon={faHeart} className='fa-lg'/> Wishlist
              </Nav.Link>
            </LinkContainer>

              <LinkContainer to='/cart'> 
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/couponlist'>
                    <NavDropdown.Item>Coupons</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

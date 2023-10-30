import { useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  // useGetRazorpayClientIdQuery,
  // usePayOrderMutation,
  useReturnOrderMutation,
} from '../slices/ordersApiSlice';
import ScrollToTop from '../components/ScrollToTop';
import { useUpdateProductStockMutation } from '../slices/productsApiSlice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck} from '@fortawesome/free-regular-svg-icons';
import{faDownload} from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';


const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [returnOrder, {isLoading: loadingReturn }] = useReturnOrderMutation();
  const [updateStock, {isLoading: loadStock, error: err}] = useUpdateProductStockMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  },[order])
  
  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  const goBack = () => {
		navigate(-1);
	}

  const printContent = () => {
    const targetElement = document.getElementById('printable-content');
    html2canvas(targetElement).then(canvas => {
      const dataURL = canvas.toDataURL();
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${orderId}.png`; // The name of the downloaded file
      link.click();
    })};

  const returnHandler = async () => {
    await returnOrder(orderId);
    console.log(order.orderItems[0].product)
    order.orderItems.forEach(async (item) => {
      await updateStock({
        productId: item.product,
        stockIncreaseBy: item.qty,
      });
    });
    refetch();
    toast.success('order returned');
  }
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
    <ScrollToTop/>
      <div className='btns-orderscreen'>
        <button onClick={goBack} className='btn btn-light mb-4'>
          Go Back
        </button>
        <Button id='print-btn' 
        type='button'
        className='btn btn-block mb-4'
        onClick={printContent} >
          <FontAwesomeIcon icon={faDownload} />
        </Button>
      </div>
      <div id='printable-content'>
      <div className='centered icon-edit'><FontAwesomeIcon icon={faCircleCheck} className='text-green' /></div>
      <h1 className='text-green marBot-rm centered'> We Have Recieved Your Order</h1>
      <h5 className='font-adjust centered'>Order No {order._id}</h5>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '},
                {order.shippingAddress.State}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid && order.paymentMethod === 'Online' ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <>
                {order.paymentMethod === 'COD' ? (<></>) 
                : (
                  <Message variant='danger'>Not Paid</Message>
                )}
                </>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Discount</Col>
                  <Col className='text-green'> - ₹{order.discount}</Col>
                </Row>
              </ListGroup.Item>
              {Number(order.couponDiscount) !== 0 ? 
              (<>
              <ListGroup.Item>
                <Row>
                  <Col>Coupon Discount</Col>
                  <Col className='text-green'>- {order.couponDiscount}</Col>
                </Row>
              </ListGroup.Item>
              </>
              )
               : ('')}
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              { order.paymentMethod === 'COD'? (
                 <ListGroup.Item>
                 <Row>
                   <Col>Covinience Fee</Col>
                   <Col>₹{order.convenienceFee}</Col>
                 </Row>
               </ListGroup.Item>
              ) : (<></>)}
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                (order.isPaid || order.paymentMethod === 'COD' )&&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}

                {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                order.isDelivered &&
                // !order.isReturned (
                  (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={returnHandler}
                    >
                      Mark As Returned
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default OrderScreen;

import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes,FaCheck } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useParams } from 'react-router-dom';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import AdminPaginate from '../../components/AdminPaginate';
import ReactHTMLTableToExcel from 'react-html-table-to-excel'; // Import the library

const OrderListScreen = () => {
  const {pageNumber} = useParams();

  const { data: orders, isLoading, error } = useGetOrdersQuery(pageNumber);

  const renderExcelDownload = () => {
    return (
      <div>
        <ReactHTMLTableToExcel
          id="excel-button"
          className="btn btn-primary btn-sm font-small"
          table="order-table"
          filename="orders"
          sheet="orders"
          buttonText="Download as Excel"
        />
      </div>
    );
  };

  console.log(orders);

  return (
    <>
      <div style={{display:'flex', justifyContent:'flex-end'}}>{renderExcelDownload()}</div>
      <h1 className='heading-font'>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          Couldn't Load Orders!<br/>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
        <Table id="order-table" striped bordered hover responsive className='table-sm font-small'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>PAYMENT</th>
              <th>TAX</th>
              <th>SGST</th>
              <th>CGST</th>
              <th>IGST</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.taxPrice}</td>
                <td>{order.shippingAddress.State === 'Rajasthan' ? (order.taxPrice / 2): (0)}</td>
                <td>{order.shippingAddress.State === 'Rajasthan' ? (order.taxPrice / 2): (0)}</td>
                <td>{order.shippingAddress.State === 'Rajasthan' ? (0): (order.taxPrice)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid && order.paymentMethod === 'Online' && (
                    order.paidAt.substring(0, 10)
                    // <FaCheck style={{ color: 'green' }}/>
                  )}
                  {order.paymentMethod === 'COD' && (
                    // order.paidAt.substring(0, 10)
                    <span>COD</span>
                    // <FaCheck style={{ color: 'green' }}/>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm font-small'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <AdminPaginate
        isOrdersPage = 'true'
        pages={orders.pages}
        page={orders.page}
        keyword=''/>
        </>
      )}
    </>
  );
};

export default OrderListScreen;

import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
  useCreateCouponMutation,
} from '../../slices/couponsApiSlice';
import { toast } from 'react-toastify';

const CouponListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetCouponsQuery({
    pageNumber,
  });

  console.log(data);

  const [deleteCoupon, { isLoading: loadingDelete }] =
    useDeleteCouponMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteCoupon(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createCoupon, { isLoading: loadingCreate }] =
    useCreateCouponMutation();

  const createCouponHandler = async () => {
    if (window.confirm('Are you sure you want to create a new Coupon?')) {
      try {
        await createCoupon();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1 className='heading-font'>Coupons</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createCouponHandler}>
            <FaPlus /> Create Coupon
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          Couldn't Load Coupons! <br/>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>CODE</th>
                <th>DISCOUNT</th>
                <th>ORDER LIMIT</th>
                <th>FLAT OFF</th>
                <th>FREE SHIPPING</th>
                <th>PUBLIC?</th>
              </tr>
            </thead>
            <tbody>
              {data.coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.givesDiscount}</td>
                  <td>{coupon.minOrder}</td>
                  <td>{coupon.flatOff}</td>
                  {coupon.freeShip ? (<td><FaCheck className='text-green'/></td>) : (<td><FaTimes className='text-red'/></td>) }
                  {coupon.publicCoupon ? (<td><FaCheck className='text-green'/></td>) : (<td><FaTimes className='text-red'/></td>) }
                  <td>
                    <LinkContainer to={`/admin/coupon/${coupon._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(coupon._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default CouponListScreen;

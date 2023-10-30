import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


const AdminPaginate = ({ pages, page, isOrdersPage = false, isUsersPage = false, isMyordersPage = false }) => {

  return (
    pages > 1 && (
      <Pagination className="centered">
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
               !isOrdersPage
                ? isUsersPage
                  ? (`/admin/userlist/page/${x + 1}`)
                  : (isMyordersPage 
                    ? `/profile/page/${x + 1}`
                    : `/profile.page/1`                                       
                    )
                :`/admin/orderlist/page/${x + 1}`
              }
          >
          <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default AdminPaginate;

import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';


const Paginate = ({ pages, page, isAdmin = false, keyword = '', isCategoryPage = false }) => {

  const {category} = useParams()
  return (
    pages > 1 && (
      <Pagination className="centered">
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? (`/search/${keyword}/page/${x + 1}`)
                  : (isCategoryPage 
                    ? `/${category}/${x + 1}`
                    : `/page/${x + 1}`                                       
                    )
                :`/admin/productlist/${x + 1}`
              }
          >
          <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;

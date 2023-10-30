import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // FIX: uncontrolled input - urlKeyword may be undefined
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex' style = {{alignItems: 'center'}}>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        // className='mr-sm-2 ml-sm-5'
        className="mr-sm-2 ml-sm-5 bg-transparent border-0 border-bottom text-white"
        style={{ boxShadow: 'none', borderRadius: 0 ,padding: '0.5rem 0.2rem' }}
      ></Form.Control>
      
      <Button type='submit' variant='outline-search' className='p-2 mx-1'>
      <FontAwesomeIcon icon={faSearch} color="white" className='search-icon'/>
      </Button>
    </Form>
  );
};

export default SearchBox;

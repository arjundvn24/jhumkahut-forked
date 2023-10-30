import React from 'react';
import '../assets/styles/index.css';
import earrings from "../assets/images/1.jpg"
import necklaces from "../assets/images/2.jpg"
import chains from "../assets/images/3.jpg"
import seeAll from "../assets/images/4.jpg"
import {Col,Row} from 'react-bootstrap'
import { Link } from 'react-router-dom';


const Category = () => {
  return (
    <Row className="card2-container">
      <Col sm={4} md={3} lg={3} xl={3} className='wide-50 centered'>
      <div className="card2">
      <Link to={`/Earrings`} style={{ textDecoration: 'none' }}>
        <img src={earrings} alt=" " className="card2-image" />
        <h3 className="card2-heading">Earrings</h3>
      </Link>
      </div>

      </Col>
      <Col sm={4} md={3} lg={3} xl={3} className='wide-50 centered'>
      <div className="card2">
      <Link to={`/Necklaces`} style={{ textDecoration: 'none' }}>
        <img src={necklaces} alt=" " className="card2-image" />
        <h3 className="card2-heading">Necklaces</h3>
      </Link>
      </div>
      </Col>
      <Col sm={4} md={3} lg={3} xl={3} className='wide-50 centered'>
      <div className="card2">
      <Link to={`/Chains`} style={{ textDecoration: 'none' }}>
        <img src={chains} alt=" " className="card2-image" />
        <h3 className="card2-heading">Chains</h3>
      </Link>
      </div>
      </Col>
      <Col sm={4} md={3} lg={3} xl={3} className='wide-50 centered'>
      <div className="card2" onClick={() => window.location.replace("/#shopall")}>
        <img src={seeAll} alt=" " className="card2-image" />
        <h3 className="card2-heading">Can't Decide?</h3>
      </div>
      </Col>
    </Row>
  );
};

export default Category;


import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className='footer-content'>
        <div className="help">
            <h5 style={{color:'white', fontFamily: 'Roboto Condensed'}}>
              HELP
            </h5>
            <Link to="/help/returns">
            <span>Returns</span>
            </Link>
            <Link to="/help/wholesale">
            <span>Wholesale</span>
            </Link>
            <Link to="/help/contact">
            <span>Contact Us</span>
            </Link>
            <Link to="/help/about">
            <span>About Us</span>
            </Link>
          </div>
          <div className="social-media">
            <span className='text-white'>Follow Us</span>
            <a href="https://www.instagram.com/invites/contact/?i=1jlsuucv5ebmq&utm_content=lbymq2p" target="_blank" rel="noreferrer">
              <FaInstagram className="icon" />
            </a>
          </div> 
        </div>
     
        <div className="footer-text">
          <p>&copy; {currentYear} JhumkaHut. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


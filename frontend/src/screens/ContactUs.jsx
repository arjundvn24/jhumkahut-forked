import React from 'react'
import ScrollToTop from '../components/ScrollToTop';


function ContactUs() {
  return (
    <>
    <ScrollToTop />
    <div className="returns-container">
    <div className="inner-container">
    <h2 className='heading-font text-black'>Contact Us</h2>
    <p className='text-black'>
    <ul style=
    {{listStyle: "none", 
    display:'flex', 
    flexDirection:'column', 
    alignContent:'center', 
    marginLeft:'0px',
    paddingLeft:'0px',
    textAlign:'center'}}>

    <li>Phone/Whatsapp: 7014698318</li>
    <li>Email: jhumkahutalwar@gmail.com</li>
    <li>Physical Address: 233, Scheme 1, Alwar, Rajasthan, India</li>
    </ul>
    </p>
    </div>
    </div>
    </>
  )
}

export default ContactUs

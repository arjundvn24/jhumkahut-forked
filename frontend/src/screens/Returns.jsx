import React from 'react';
import ScrollToTop from '../components/ScrollToTop';
const Returns = () => {
  return (
    <>
    <ScrollToTop />
    <div className="returns-container">
    <div className="inner-container">
      <h2 className='heading-font text-black'>Returns And Refund</h2>
      <p className='text-black'>
      While we are pretty sure our products won't disappoint you a bit,
      this is just in case something goes wrong<br/> ( Don't worry, we're here! )<br/>
      <br/>
      While we try to deliver exactly as in the picture, there might be very slight difference. We don't offer return/exchanges in our accessories, however if you recieved a damaged 
      or incorrect item, here is what you need to do:<br/><br/>
      </p>
      <ul className='text-black'>
        <li>Update us within five working days, via Email or ping us on Whatsapp.</li>
        <li>You can also reach out to us via Instagram through this link <a href='https://www.instagram.com/invites/contact/?i=1jlsuucv5ebmq&utm_content=lbymq2p' target="_blank">here</a></li>
        <li>Your item will then be exchanged.</li>
        <li>Unboxing video is mandatory.</li>
        <li>Incase your item is unavailable your amount will be credited to your bank account.</li>
      </ul>
      <p className='text-black'>
        (Yeah, that's all it takes!)
      </p>
      <p className='text-black'>
      We value our customers and will always make sure your shopping experience is fun and hassle free!
      </p>
      </div>
    </div>
    </>
  );
};

export default Returns;


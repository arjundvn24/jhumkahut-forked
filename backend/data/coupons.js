const coupons = [
    {
      code: "10OFF",
      givesDiscount: 10,
      minOrder: 200,
      flatOff: 0,
      freeShip: false,
      publicCoupon: true,      
    },
    {
      code: "FLAT200",
      givesDiscount: 0,
      minOrder: 300,
      flatOff: 200,
      freeShip: false,
      publicCoupon: false,      
    },
    {
      code: "20OFF",
      givesDiscount: 20,
      minOrder: 599,
      flatOff: 0,
      freeShip: false,
      publicCoupon: true,      
    }
  ];

export default coupons;

// import { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { Form, Button } from 'react-bootstrap';
// import Message from '../../components/Message';
// import Loader from '../../components/Loader';
// import FormContainer from '../../components/FormContainer';
// import { toast } from 'react-toastify';
// import {
//   useGetProductDetailsQuery,
//   useUpdateProductMutation,
//   useUploadProductImageMutation,
// } from '../../slices/productsApiSlice';

// const ProductEditScreen = () => {
//   const { id: productId } = useParams();

//   const [name, setName] = useState('');
//   const [price, setPrice] = useState(0);
//   const [image, setImage] = useState('');
//   const [brand, setBrand] = useState('');
//   const [category, setCategory] = useState('');
//   const [countInStock, setCountInStock] = useState(0);
//   const [description, setDescription] = useState('');
//   const [isWholesale, setWholesale] = useState('false');
//   const [hasSale, setHasSale] = useState(0);
//   const [salePrice, setSalePrice] = useState(0);

//   const {
//     data: product,
//     isLoading,
//     refetch,
//     error,
//   } = useGetProductDetailsQuery(productId);

//   const [updateProduct, { isLoading: loadingUpdate }] =
//     useUpdateProductMutation();

//   const [uploadProductImage, { isLoading: loadingUpload }] =
//     useUploadProductImageMutation();

//   const navigate = useNavigate();

//   const calculateHasSale = (salePrice) =>{
//     if (product) {
//       const percentage = ((price - salePrice) / price) * 100;
//       setHasSale(percentage.toFixed(0));
//     }
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       console.log(hasSale);
//       await updateProduct({
//         productId,
//         name,
//         price,
//         image,
//         brand,
//         category,
//         description,
//         countInStock,
//         isWholesale,
//         hasSale,
//       });
//       toast.success('Product updated');
//       refetch();
//       navigate('/admin/productlist');
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   useEffect(() => {
//     calculateHasSale(salePrice);
//   }, [salePrice,product]);

//   useEffect(() => {
//     if (product) {
//       setName(product.name);
//       setPrice(product.price);
//       setImage(product.image);
//       setBrand(product.brand);
//       setCategory(product.category);
//       setCountInStock(product.countInStock);
//       setDescription(product.description);
//       setHasSale(product.hasSale);
//       setSalePrice(product.price - (product.price * product.hasSale / 100))
//     }
//   }, [product]);

//   const uploadFileHandler = async (e) => {
//     const formData = new FormData();
//     formData.append('image', e.target.files[0]);
//     try {
//       const res = await uploadProductImage(formData).unwrap();
//       toast.success(res.message);
//       setImage(res.image);
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };


//   return (
//     <>
//       <Link to='/admin/productlist' className='btn btn-light my-3'>
//         Go Back
//       </Link>
//       <FormContainer>
//         <h1 className='heading-font'>Edit Product</h1>
//         {loadingUpdate && <Loader />}
//         {isLoading ? (
//           <Loader />
//         ) : error ? (
//           <Message variant='danger'>{error}</Message>
//         ) : (
//           <Form onSubmit={submitHandler}>
//             <Form.Group controlId='name'>
//               <Form.Label>Name</Form.Label>
//               <Form.Control
//                 type='name'
//                 placeholder='Enter name'
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId='price'>
//               <Form.Label>Price</Form.Label>
//               <Form.Control
//                 type='number'
//                 placeholder='Enter price'
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId='image'>
//               <Form.Label>Image</Form.Label>
//               <Form.Control
//                 type='text'
//                 placeholder='Enter image url'
//                 value={image}
//                 onChange={(e) => setImage(e.target.value)}
//               ></Form.Control>
//               <Form.Control
//                 label='Choose File'
//                 onChange={uploadFileHandler}
//                 type='file'
//               ></Form.Control>
//               {loadingUpload && <Loader />}
//             </Form.Group>

//             <Form.Group controlId='brand'>
//               <Form.Label>Brand</Form.Label>
//               <Form.Control
//                 type='text'
//                 placeholder='Enter brand'
//                 value={brand}
//                 onChange={(e) => setBrand(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId='countInStock'>
//               <Form.Label>Count In Stock</Form.Label>
//               <Form.Control
//                 type='number'
//                 placeholder='Enter countInStock'
//                 value={countInStock}
//                 onChange={(e) => setCountInStock(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId='category'>
//               <Form.Label>Category</Form.Label>
//               <Form.Control
//                 type='text'
//                 placeholder='Enter category'
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId='sale-price'>
//               <Form.Label>Sale Price</Form.Label>
//               <Form.Control
//                 type='text'
//                 placeholder='Enter Sale Price'
//                 value={salePrice}
//                 onChange={(e) => setSalePrice(e.target.value)}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId='sale-percent'>
//               <Form.Label>Sale Percent</Form.Label>
//               <Form.Control
//                 type='text'
//                 placeholder='Enter Sale Percentage'
//                 disabled={true}
//                 value={hasSale}
//               ></Form.Control>
//             </Form.Group>

//             <Form.Group controlId='description'>
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 type='text'
//                 placeholder='Enter description'
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               ></Form.Control>
//             </Form.Group>
            

//             <div className='buttons'>
//             <Button
//               type='submit'
//               variant='primary'
//               style={{ marginTop: '1rem' }}
//             >
//               Update
//             </Button>
          
//             <Form.Group className='my-2' controlId='isadmin'>
//               {product.isWholesale ? 
//                (
//                 <Form.Check
//                 type='checkbox'
//                 label='Remove from Wholesale'
//                 onChange={(e) => setWholesale(!e.target.checked)}
//               ></Form.Check>
//               ) 
//               : (<Form.Check
//                 type='checkbox'
//                 label='Make Available Wholesale'
//                 onChange={(e) => setWholesale(e.target.checked)}
//               ></Form.Check>)}
              
//             </Form.Group>
//             </div>
//           </Form>
//         )}
//       </FormContainer>
//     </>
//   );
// };

// export default ProductEditScreen;

import { useState, useEffect,useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const imageInputRef = useRef(null);
  const[imagesNames, setImagesNames] = useState([])
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [isWholesale, setWholesale] = useState('false');
  const [hasSale, setHasSale] = useState(0);
  const [salePrice, setSalePrice] = useState(0);

  const imagesRef = useRef(images);

  useEffect(() => {
    // Update the ref whenever 'images' state changes
    console.log(images);
    imagesRef.current = images;
  }, [images]);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const calculateHasSale = (salePrice) =>{
    if (product) {
      const percentage = ((price - salePrice) / price) * 100;
      setHasSale(percentage);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      const recentImages = imagesRef.current;
      await updateProduct({
        productId,
        name,
        price,
        images: recentImages,
        brand,
        category,
        description,
        countInStock,
        isWholesale,
        hasSale,
      });
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    calculateHasSale(salePrice);
  }, [salePrice,product]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImages(product.images);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setHasSale(product.hasSale);
      setSalePrice(product.price - (product.price * product.hasSale / 100))
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file); // Use 'images' instead of 'image' for the form data key
    });

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      console.log(res);
      setImages(res.images); // Append the uploaded image to the 'images' state array
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(()=>{
    console.log(images);
  },[images])
  
  function isImage(url) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const ext = url.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  }
  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1 className='heading-font'>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => {setPrice(e.target.value); setSalePrice(0)}}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Images</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image urls'
                value={images.join(',')} // Join the array of images into a comma-separated string
                onChange={(e) => setImagesNames(e.target.value.split(','))} // Split the comma-separated string back to an array
              ></Form.Control>
              <div>
                <input
                  type='file'
                  ref={imageInputRef} // Set the ref to the file input element
                  style={{ display: 'none' }}
                  onChange={uploadFileHandler}
                  multiple // Allow multiple file selection
                />
                <Button
                  onClick={() => imageInputRef.current.click()} // Open the file input dialog when the button is clicked
                  variant='outline-secondary'
                  className='btn-sm my-2'
                >
                  Choose Files
                </Button>
                {loadingUpload && <Loader />}
              </div>
              {images.map((image, index) => (
                <div key={index} className='my-2'>
                  {isImage(image) ? (<img
                  style={{maxHeight: '15vh'}}
                    src={image}
                    alt={`Product ${index + 1}`}
                    className='admin-product-image'
                  />) : (
                    <video
                    style={{maxHeight: '15vh'}}
                    controls
                    autoPlay
                    muted
                    loop    
                    poster="\uploads\video-poster.png"
                    />
                  )}
                </div>
              ))}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='sale-price'>
              <Form.Label>Sale Price</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Sale Price'
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='sale-percent'>
              <Form.Label>Sale Percent</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Sale Percentage'
                disabled={true}
                value={hasSale}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            

            <div className='buttons'>
            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          
            <Form.Group className='my-2' controlId='isadmin'>
              {product.isWholesale ? 
               (
                <Form.Check
                type='checkbox'
                label='Remove from Wholesale'
                onChange={(e) => setWholesale(!e.target.checked)}
              ></Form.Check>
              ) 
              : (<Form.Check
                type='checkbox'
                label='Make Available Wholesale'
                onChange={(e) => setWholesale(e.target.checked)}
              ></Form.Check>)}
              
            </Form.Group>
            </div>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;

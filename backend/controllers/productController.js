import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
      $or: [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ],
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});


// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image:'/images/sample.jpg',
    images: ['/images/sample.jpg'],
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    isWholesale: false,
    hasSale: 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, images, brand, category, countInStock, isWholesale, hasSale } =
    req.body;

  const product = await Product.findById(req.params.id);

function isImage(url) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    const ext = url.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  }

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    {isImage(images[0]) ? (product.image = images[0]) : (product.image = images[1])};
    product.images = images;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    product.isWholesale = isWholesale;
    product.hasSale = hasSale;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const updateProductStock = asyncHandler(async (req, res) => {
  const { productId, stockReduceBy = 0, stockIncreaseBy = 0 } = req.body;

  const product = await Product.findById(productId);

  if (product) {
    // if(stockReduceBy)
    // { 
      product.countInStock = product.countInStock - stockReduceBy + stockIncreaseBy;
    //  }
    // else if(stockIncreaseBy)
    // { product.countInStock = product.countInStock + stockIncreaseBy; }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

// @desc    Get LTH rated products
// @route   GET /api/products/lth
// @access  Public
const getLTHProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ price: { $lt: 500 } }).sort({ price: 1 }).limit(8);
  res.json(products);
});

const getWholesaleProducts = asyncHandler(async (req,res) => {
  const products = await Product.find({ isWholesale: true });
  res.json(products);
});

const getCategoryProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Product.countDocuments({ category: req.params.category});
  const products = await Product.find({ category: req.params.category})
  .limit(pageSize)
  .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});


export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getLTHProducts,
  getWholesaleProducts,
  getCategoryProducts,
  updateProductStock,
};

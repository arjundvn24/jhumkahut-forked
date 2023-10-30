import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js'

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = process.env.ADMIN_PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const count = await User.countDocuments({ });
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
    res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Can not delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getMyWishList = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      wishlist: user.wishlist,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateMyWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const existingItem = user.wishlist.find((item) => item._id.toString() === productId);

      if (existingItem) {
        res.status(200).json({ message: 'Item already exists in the wishlist', wishlist: user.wishlist });
      } else {
        // Fetch the product details from your database
        const product = await Product.findById(productId);

        if (!product) {
          res.status(404).json({ message: 'Product not found' });
        } else {
          user.wishlist.push(product);
          await user.save();
          res.status(200).json({ message: 'Item added to the wishlist', wishlist: user.wishlist });
        }
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteFromWishlist = async (req, res) => {
  const productId = req.body;

  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      const existingItemIndex = user.wishlist.findIndex((item) => item._id.toString() === productId.id);
      // console.log(user.wishlist.findIndex((item) => item._id.toString() === '64a01545869b445468a33ef6'));
      if (existingItemIndex === -1) {
        res.status(404).json({ message: 'Item not found in the wishlist' });
      } else {
        user.wishlist.splice(existingItemIndex, 1);
        await user.save();
        res.status(200).json({ message: 'Item removed from the wishlist', wishlist: user.wishlist });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// const getMyCart = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     res.json({
//       wishList: user.wishlist,
//     });
//   } else {
//     res.status(404);
//     throw new Error('User not found');
//   }
// });

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getMyWishList,
  updateMyWishlist,
  deleteFromWishlist,
  // getMyCart,
  // updateMyCart,
};

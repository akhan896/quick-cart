const Product = require('../models/Product');

// @desc    Get all products with search & category filter
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { search, category, page = 1, limit = 12 } = req.query;

  const query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (category && category !== 'All') {
    query.category = category;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

  res.json({
    products,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    total,
  });
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;
  const product = await Product.create({ name, description, price, category, image, stock });
  res.status(201).json(product);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { name, description, price, category, image, stock } = req.body;
  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price ?? product.price;
  product.category = category ?? product.category;
  product.image = image ?? product.image;
  product.stock = stock ?? product.stock;

  const updated = await product.save();
  res.json(updated);
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };

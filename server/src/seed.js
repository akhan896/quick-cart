require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling with exceptional sound quality. 30-hour battery life.',
    price: 349.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 45,
    rating: 4.8,
    numReviews: 642,
  },
  {
    name: 'Apple MacBook Pro 14"',
    description: 'Supercharged by M3 Pro chip. Up to 22 hours battery life with stunning Liquid Retina XDR display.',
    price: 1999.00,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    stock: 20,
    rating: 4.9,
    numReviews: 312,
  },
  {
    name: 'Nike Air Max 270',
    description: 'Inspired by Air Max 93 and 180, this shoe features the largest Max Air unit yet for unrivaled comfort.',
    price: 150.00,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stock: 150,
    rating: 4.5,
    numReviews: 892,
  },
  {
    name: 'The Alchemist — Paulo Coelho',
    description: 'A magical story about following your dreams. One of the best-selling books in history.',
    price: 14.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
    stock: 200,
    rating: 4.7,
    numReviews: 1540,
  },
  {
    name: 'Samsung 65" 4K QLED TV',
    description: 'Quantum Dot technology for 100% Color Volume. Neo Quantum Processor 4K for intelligent picture.',
    price: 1197.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
    stock: 15,
    rating: 4.6,
    numReviews: 278,
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original blue jean since 1873. Straight leg with a regular fit. Made with premium denim.',
    price: 69.50,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    stock: 300,
    rating: 4.4,
    numReviews: 2103,
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Replaces 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer.',
    price: 89.95,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
    stock: 75,
    rating: 4.6,
    numReviews: 3421,
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Laser reveals invisible dust. Automatically adapts suction across all floor types. Up to 60 minutes run time.',
    price: 749.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    stock: 30,
    rating: 4.7,
    numReviews: 567,
  },
  {
    name: 'LEGO Star Wars Millennium Falcon',
    description: '7,541-piece ultimate collector series featuring highly detailed Millennium Falcon with rotating radar dish.',
    price: 849.99,
    category: 'Toys',
    image: 'https://images.unsplash.com/photo-1679589007083-e67d8ccf1898?w=500',
    stock: 12,
    rating: 4.9,
    numReviews: 423,
  },
  {
    name: 'The Ordinary Hyaluronic Acid 2%',
    description: 'Multi-depth hydration system targeting different skin layers for plumped, supple skin. Vegan formula.',
    price: 12.90,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    stock: 500,
    rating: 4.5,
    numReviews: 5820,
  },
];

const seed = async () => {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  console.log('🗑️  Cleared existing data');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@quickcart.com',
    password: 'admin123',
    isAdmin: true,
  });
  console.log(`👤 Admin created: ${admin.email}`);

  // Create sample user
  await User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
  });
  console.log('👤 Sample user created: john@example.com');

  // Insert products
  await Product.insertMany(products);
  console.log(`📦 ${products.length} products inserted`);

  console.log('\n✅ Database seeded successfully!');
  console.log('────────────────────────────────');
  console.log('Admin credentials:');
  console.log('  Email:    admin@quickcart.com');
  console.log('  Password: admin123');
  console.log('────────────────────────────────');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});

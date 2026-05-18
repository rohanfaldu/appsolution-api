import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: '✅ Test Auth route is working!' });
});


// // GET /api/admin/purchases
// router.get('/getAllPurchases', getAllPurchases);

// Create new admin user
router.post('/register-admin', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User with this email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN', // Prisma enum
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: '✅ Admin user created successfully',
      user: adminUser
    });

  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, passwordLength: password.length });
    
    const user = await prisma.user.findFirst({ 
      where: { email, isActive: true } 
    });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found:', { id: user.id, email: user.email, role: user.role });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log('Login successful for:', email);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Customer signup
router.post('/signup', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'An account with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'USER', isActive: true }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth login / signup
router.post('/google', async (req, res) => {
  try {
    const { token: accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: 'Access token is required.' });

    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!googleRes.ok) return res.status(401).json({ error: 'Invalid Google token.' });

    const { email, name, picture, sub: googleId } = await googleRes.json();
    if (!email) return res.status(400).json({ error: 'Could not retrieve email from Google.' });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email,
          password: await bcrypt.hash(googleId + process.env.JWT_SECRET, 12),
          role: 'USER',
          isActive: true
        }
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, picture: picture || null }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update current user profile
router.put('/me', auth, [
  body('name').notEmpty().trim().withMessage('Name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { name, password } = req.body;
    const updateData = { name };
    if (password) updateData.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

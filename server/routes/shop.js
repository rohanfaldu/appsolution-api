import express from 'express';
import prisma from '../lib/prisma.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/shop — return saved cart and favorites for logged-in customer
router.get('/', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { cart: true, favorites: true }
    });
    res.json({
      cartItems: user?.cart ?? [],
      favoriteItems: user?.favorites ?? []
    });
  } catch (error) {
    console.error('Shop get error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/shop/cart — persist cart items
router.put('/cart', auth, async (req, res) => {
  try {
    const { items } = req.body;
    await prisma.user.update({
      where: { id: req.user.id },
      data: { cart: items ?? [] }
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('Cart save error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/shop/favorites — persist favorite items
router.put('/favorites', auth, async (req, res) => {
  try {
    const { items } = req.body;
    await prisma.user.update({
      where: { id: req.user.id },
      data: { favorites: items ?? [] }
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('Favorites save error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

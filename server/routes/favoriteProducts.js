import express from 'express';
import prisma from '../lib/prisma.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/favorite-products — returns full product details for the authenticated user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      select: { productId: true },
      orderBy: { createdAt: 'desc' },
    });

    const productIds = favorites.map((f) => f.productId);

    if (!productIds.length) {
      return res.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'ACTIVE' },
    });

    // Preserve favorites order (most recently added first)
    const order = new Map(productIds.map((id, i) => [id, i]));
    products.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    res.json({ products });
  } catch (error) {
    console.error('Get favorite products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

import express from 'express';
import prisma from '../lib/prisma.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const getOrCreateCart = (userId) =>
  prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: { items: true },
  });

// GET /api/shop — return cart items and favorites (product_ids only)
router.get('/', auth, async (req, res) => {
  try {
    const [cart, favorites] = await Promise.all([
      getOrCreateCart(req.user.id),
      prisma.favorite.findMany({ where: { userId: req.user.id }, select: { productId: true } }),
    ]);

    res.json({
      cartItems: cart.items.map((i) => ({ id: i.productId, quantity: i.quantity })),
      favoriteItems: favorites.map((f) => f.productId),
    });
  } catch (error) {
    console.error('Shop get error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/shop/cart — replace cart contents
router.put('/cart', auth, async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const cart = await getOrCreateCart(req.user.id);

    await prisma.$transaction([
      prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
      ...items.map((item) =>
        prisma.cartItem.create({
          data: { cartId: cart.id, productId: String(item.id), quantity: Math.max(1, item.quantity || 1) },
        })
      ),
    ]);

    res.json({ ok: true });
  } catch (error) {
    console.error('Cart save error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/shop/favorites — replace favorites list
router.put('/favorites', auth, async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const productIds = [...new Set(items.map((i) => String(typeof i === 'object' ? (i.productId ?? i.id) : i)).filter(Boolean))];

    await prisma.favorite.deleteMany({ where: { userId: req.user.id } });

    if (productIds.length) {
      await prisma.favorite.createMany({
        data: productIds.map((productId) => ({ userId: req.user.id, productId })),
        skipDuplicates: true,
      });
    }

    res.json({ ok: true, favoriteItems: productIds });
  } catch (error) {
    console.error('Favorites save error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/shop/favorites/:productId — add single favorite
router.post('/favorites/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    await prisma.favorite.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      create: { userId: req.user.id, productId },
      update: {},
    });
    res.json({ ok: true, productId, favorited: true });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/shop/favorites/:productId — remove single favorite
router.delete('/favorites/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    await prisma.favorite.deleteMany({
      where: { userId: req.user.id, productId },
    });
    res.json({ ok: true, productId, favorited: false });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

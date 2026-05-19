import express from 'express';
import { randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const normalizeFavoriteItems = (items) => {
  if (!Array.isArray(items)) return [];

  const seen = new Set();
  return items.reduce((favorites, item) => {
    const value =
      typeof item === 'string' || typeof item === 'number'
        ? item
        : item?.productId || item?.id;

    if (typeof value !== 'string' && typeof value !== 'number') return favorites;

    const key = String(value).trim();
    if (!key || seen.has(key)) return favorites;

    seen.add(key);
    favorites.push(key);
    return favorites;
  }, []);
};

const mergeFavoriteItems = (...groups) => normalizeFavoriteItems(groups.flat());

const getRelationalFavoriteItems = async (user) => {
  try {
    const rows = await prisma.$queryRaw`
      SELECT "productId"
      FROM "favorite_items"
      WHERE "userId" = ${user.id}
         OR LOWER("userEmail") = LOWER(${user.email})
      ORDER BY "createdAt" DESC
    `;

    return normalizeFavoriteItems(rows.map((row) => row.productId));
  } catch (error) {
    return [];
  }
};

const saveRelationalFavoriteItems = async (user, favoriteItems) => {
  try {
    await prisma.$transaction(async (tx) => {
      if (favoriteItems.length) {
        await tx.$executeRaw`
          DELETE FROM "favorite_items"
          WHERE ("userId" = ${user.id} OR LOWER("userEmail") = LOWER(${user.email}))
            AND "productId" NOT IN (${Prisma.join(favoriteItems)})
        `;
      } else {
        await tx.$executeRaw`
          DELETE FROM "favorite_items"
          WHERE "userId" = ${user.id} OR LOWER("userEmail") = LOWER(${user.email})
        `;
      }

      for (const productId of favoriteItems) {
        await tx.$executeRaw`
          INSERT INTO "favorite_items" (
            "id", "userId", "userEmail", "productId", "createdAt", "updatedAt"
          )
          VALUES (
            ${randomUUID()}, ${user.id}, ${user.email}, ${productId}, NOW(), NOW()
          )
          ON CONFLICT ("userId", "productId")
          DO UPDATE SET "userEmail" = EXCLUDED."userEmail", "updatedAt" = NOW()
        `;
      }
    });
  } catch (error) {
    // Some installs still use the JSON favorites column only.
  }
};

// GET /api/shop — return saved cart and favorites for logged-in customer
router.get('/', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { cart: true, favorites: true }
    });
    const favoriteItems = mergeFavoriteItems(
      await getRelationalFavoriteItems(req.user),
      user?.favorites,
    );

    if (JSON.stringify(favoriteItems) !== JSON.stringify(user?.favorites ?? [])) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { favorites: favoriteItems }
      });
    }

    res.json({
      cartItems: user?.cart ?? [],
      favoriteItems
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
    const favoriteItems = normalizeFavoriteItems(items);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { favorites: favoriteItems }
    });
    await saveRelationalFavoriteItems(req.user, favoriteItems);
    res.json({ ok: true, favoriteItems });
  } catch (error) {
    console.error('Favorites save error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

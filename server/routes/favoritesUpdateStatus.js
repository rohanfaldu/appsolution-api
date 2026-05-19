import express from 'express';
import { randomUUID } from 'crypto';
import prisma from '../lib/prisma.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const ensureFavoriteItemsTable = async () => {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "favorite_items" (
      "id"          TEXT            NOT NULL,
      "userId"      TEXT            NOT NULL,
      "userEmail"   TEXT            NOT NULL,
      "productId"   TEXT            NOT NULL,
      "name"        TEXT            NOT NULL DEFAULT '',
      "image"       TEXT,
      "price"       DECIMAL(10,2)   NOT NULL DEFAULT 0,
      "description" TEXT,
      "category"    TEXT,
      "createdAt"   TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt"   TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "favorite_items_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "favorite_items_userId_productId_key" UNIQUE ("userId", "productId"),
      CONSTRAINT "favorite_items_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "favorite_items_productId_idx" ON "favorite_items"("productId")`
  );
};

// POST /api/favorites-update-status
router.post('/', auth, async (req, res) => {
  try {
    // Extract identifiers and status from body
    const { productId, slug, status, isFavorite: isFavBody, userId: bodyUserId } = req.body; // Ensure bodyUserId is extracted
    const userId = req.user?.id || bodyUserId;

    // Flexible validation: require at least one valid identifier (ID or Slug)
    if (!productId && !slug) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product identifier (productId or slug) is required'
      });
    }
    
    // Determine favorite status (accepting both 'status' and 'isFavorite' keys)
    const rawStatus = status !== undefined ? status : isFavBody;
    const isFavorite = rawStatus === true || rawStatus === 'true';

    // Ensure product exists and fetch details for the response
    let product = null;
    // Prioritize lookup by productId if provided, as it's a unique identifier
    if (productId) {
      product = await prisma.product.findUnique({
        where: { id: productId }
      });
    }

    // If not found by ID, and a slug was provided, try to find by slug
    if (!product && slug) {
      product = await prisma.product.findFirst({ // Fallback to slug lookup (slug is guaranteed to be present by validation above)
        where: { slug: slug, status: 'ACTIVE' }
      });
    }

    if (!product) {
      // If we reach here, it means a slug was provided, but no product was found for it.
      return res.status(404).json({
        success: false,
        message: `Product not found with slug: ${slug}`
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await ensureFavoriteItemsTable();

    if (isFavorite) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO "favorite_items" (
          "id", "userId", "userEmail", "productId", "name", "image", "price", "description", "category", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        ON CONFLICT ("userId", "productId") DO UPDATE SET
          "userEmail" = $3,
          "name" = $5,
          "image" = $6,
          "price" = $7,
          "description" = $8,
          "category" = $9,
          "updatedAt" = NOW()`,
        randomUUID(),
        userId,
        user.email,
        product.id,
        product.name,
        product.image || product.featuredImage || null,
        Number(product.price || 0),
        product.description || null,
        product.category || null
      );
    } else {
      await prisma.$executeRawUnsafe(
        `DELETE FROM "favorite_items" WHERE "userId" = $1 AND "productId" = $2`,
        userId,
        product.id
      );
    }

    return res.json({
      success: true,
      message: isFavorite ? "Product marked as favorite" : "Product removed from favorites",
      data: {
        id: product.id,
        slug: product.slug,
        title: product.name, // Mapping DB 'name' to the expected 'title' in response
        isFavorite: isFavorite
      }
    });
  } catch (error) {
    console.error('Favorites update status error:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

export default router;

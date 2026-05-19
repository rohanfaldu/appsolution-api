import express from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Fetch live product details from local products API (the external source)
const fetchProduct = async (productId, req) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  return product;
};

// POST /api/orders — create order + payment from cart
router.post(
  '/',
  auth,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.productId').notEmpty().isString(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('transactionId').notEmpty().isString(),
    body('paymentMethod').optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { items, transactionId, paymentMethod = 'PayPal' } = req.body;

      // Fetch live product details for each item
      const productDetails = await Promise.all(
        items.map(async ({ productId, quantity }) => {
          const product = await fetchProduct(productId, req);
          if (!product) throw Object.assign(new Error(`Product not found: ${productId}`), { status: 404 });
          return { productId, quantity, price: parseFloat(product.price) };
        })
      );

      const total = productDetails.reduce((sum, i) => sum + i.price * i.quantity, 0);

      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            userId: req.user.id,
            total,
            status: 'PENDING',
            items: {
              create: productDetails.map(({ productId, price, quantity }) => ({
                productId,
                price,
                quantity,
              })),
            },
          },
          include: { items: true },
        });

        await tx.payment.create({
          data: {
            orderId: newOrder.id,
            transactionId,
            amount: total,
            method: paymentMethod,
            status: 'COMPLETED',
          },
        });

        await tx.order.update({ where: { id: newOrder.id }, data: { status: 'COMPLETED' } });

        // Clear user cart after successful order
        const cart = await tx.cart.findUnique({ where: { userId: req.user.id } });
        if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return newOrder;
      });

      res.status(201).json({ orderId: order.id, total, status: 'COMPLETED' });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(error.status || 500).json({ error: error.message || 'Server error' });
    }
  }
);

// GET /api/orders — list orders for logged-in user with live product details
router.get('/', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich each order item with live product details
    const enriched = await Promise.all(
      orders.map(async (order) => {
        const items = await Promise.all(
          order.items.map(async (item) => {
            const product = await fetchProduct(item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: parseFloat(item.price),
              product: product
                ? { name: product.name, image: product.image, category: product.category }
                : null,
            };
          })
        );
        return {
          id: order.id,
          status: order.status,
          total: parseFloat(order.total),
          createdAt: order.createdAt,
          transactionId: order.payment?.transactionId ?? null,
          items,
        };
      })
    );

    res.json({ orders: enriched });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

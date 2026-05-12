import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const email = req.body.email;
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'UNSUBSCRIBED') {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            status: 'ACTIVE',
            ipAddress: req.ip
          }
        });
      }

      return res.json({ message: 'You are already subscribed.' });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        ipAddress: req.ip
      }
    });

    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', adminAuth, async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where = {};

    if (search) {
      where.email = { contains: search, mode: 'insensitive' };
    }

    if (status && status !== 'all') {
      where.status = String(status).toUpperCase();
    }

    const [subscribers, count] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        take: Number(limit),
        skip: offset,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.newsletterSubscriber.count({ where })
    ]);

    res.json({
      subscribers,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      total: count
    });
  } catch (error) {
    console.error('Get newsletter subscribers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

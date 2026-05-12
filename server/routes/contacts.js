import express from 'express';
import { body, validationResult } from 'express-validator';
import { randomUUID } from 'crypto';
import prisma from '../lib/prisma.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

const buildContactFilters = ({ search, status }) => {
  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search}%`);
    const index = values.length;
    conditions.push(`("name" ILIKE $${index} OR "email" ILIKE $${index} OR COALESCE("subject", '') ILIKE $${index} OR "message" ILIKE $${index})`);
  }

  if (status && status !== 'all') {
    values.push(status.toUpperCase());
    conditions.push(`"status" = $${values.length}::"ContactStatus"`);
  }

  return {
    whereSql: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '',
    values
  };
};

// Create contact (public)
router.post('/', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 20 })
    .withMessage('Name must be 20 characters or less')
    .matches(/^[A-Za-z][A-Za-z\s'.-]*$/)
    .withMessage('Name contains invalid characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address')
    .normalizeEmail(),
  body('subject').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('captcha').notEmpty().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    await prisma.$queryRaw`
      INSERT INTO "contacts" ("id", "name", "email", "subject", "message", "captcha", "status", "ipAddress", "updatedAt")
      VALUES (${randomUUID()}, ${req.body.name}, ${req.body.email}, ${req.body.subject || 'General Inquiry'}, ${req.body.message}, ${req.body.captcha}, 'UNREAD'::"ContactStatus", ${req.ip}, CURRENT_TIMESTAMP)
    `;
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get all contacts (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const take = parseInt(limit);
    const offset = (parseInt(page) - 1) * take;
    const { whereSql, values } = buildContactFilters({ search, status });

    const contactsQuery = `
      SELECT "id", "name", "email", "subject", "message", "captcha", "status", "ipAddress", "createdAt", "updatedAt"
      FROM "contacts"
      ${whereSql}
      ORDER BY "createdAt" DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    const countQuery = `SELECT COUNT(*)::int AS count FROM "contacts" ${whereSql}`;

    const [contacts, countRows, unreadRows] = await Promise.all([
      prisma.$queryRawUnsafe(contactsQuery, ...values, take, offset),
      prisma.$queryRawUnsafe(countQuery, ...values),
      prisma.$queryRaw`SELECT COUNT(*)::int AS count FROM "contacts" WHERE "status" = 'UNREAD'::"ContactStatus"`
    ]);

    const count = countRows[0]?.count || 0;
    const unreadCount = unreadRows[0]?.count || 0;

    res.json({
      contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
      unreadCount
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single contact (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const contacts = await prisma.$queryRaw`
      SELECT "id", "name", "email", "subject", "message", "captcha", "status", "ipAddress", "createdAt", "updatedAt"
      FROM "contacts"
      WHERE "id" = ${req.params.id}
      LIMIT 1
    `;
    const contact = contacts[0];
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Mark as read if it was unread
    if (contact.status === 'UNREAD') {
      await prisma.contact.update({
        where: { id: req.params.id },
        data: { status: 'READ' }
      });
    }

    res.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update contact status (admin only)
router.patch('/:id/status', adminAuth, [
  body('status').isIn(['UNREAD', 'READ', 'REPLIED'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id }
    });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const updatedContact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    
    res.json(updatedContact);
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete contact (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id }
    });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await prisma.contact.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import { adminAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;
    const offset = (page - 1) * limit;
    
    let where = { status: 'ACTIVE' };
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    let searchCondition = {};
    if (search) {
      searchCondition = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const [products, count] = await Promise.all([
      prisma.product.findMany({
        where: { ...where, ...searchCondition },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({
        where: { ...where, ...searchCondition }
      })
    ]);

    console.log(`Found ${products.length} products`);
    
    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching product with ID:', req.params.id);
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    
    if (!product) {
      console.log('Product not found with ID:', req.params.id);
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product found:', product.name);
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    console.error('Product ID that caused error:', req.params.id);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products for admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let where = {}; // Admin should see all products (active and inactive)
    
    let searchCondition = {};
    if (search) {
      searchCondition = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const [products, count] = await Promise.all([
      prisma.product.findMany({
        where: { ...where, ...searchCondition },
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({
        where: { ...where, ...searchCondition }
      })
    ]);

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 },
  { name: 'download', maxCount: 1 }
]), [
  body('name').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('category').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = { ...req.body };
    
    // Handle file uploads
    if (req.files.image) {
      productData.image = `/uploads/products/${req.files.image[0].filename}`;
    }
    
    if (req.files.screenshots) {
      productData.screenshots = req.files.screenshots.map(file => 
        `/uploads/products/${file.filename}`
      );
    }
    
    if (req.files.download) {
      productData.downloadUrl = `/uploads/downloads/${req.files.download[0].filename}`;
    }

    // Parse JSON fields
    if (productData.technologies && typeof productData.technologies === 'string') {
      productData.technologies = JSON.parse(productData.technologies);
    } else if (typeof productData.technologies === 'string') {
      productData.technologies = productData.technologies.split(',').map(tech => tech.trim());
    }
    
    if (productData.features && typeof productData.features === 'string') {
      productData.features = JSON.parse(productData.features);
    } else if (typeof productData.features === 'string') {
      productData.features = productData.features.split(',').map(feature => feature.trim());
    }
    
    if (productData.requirements && typeof productData.requirements === 'string') {
      productData.requirements = JSON.parse(productData.requirements);
    } else if (typeof productData.requirements === 'string') {
      productData.requirements = productData.requirements.split(',').map(req => req.trim());
    }
    
    if (productData.support && typeof productData.support === 'string') {
      productData.support = JSON.parse(productData.support);
    } else if (typeof productData.support === 'string') {
      productData.support = productData.support.split(',').map(sup => sup.trim());
    }
    
    // Convert price to float
    if (productData.price) {
      productData.price = parseFloat(productData.price);
    }

    // Set default values for required fields
    productData.status = productData.status || 'ACTIVE';
    productData.rating = productData.rating || 0;
    productData.sales = productData.sales || 0;
    
    console.log('Creating product with data:', productData);
    const product = await prisma.product.create({
      data: productData
    });
    
    console.log('Product created successfully:', product.id);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (admin only)
router.put('/:id', adminAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'screenshots', maxCount: 5 },
  { name: 'download', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Updating product:', req.params.id);
    console.log('Update data received:', req.body);
    console.log('Files received:', req.files);
    
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updateData = { ...req.body };
    
    // Handle file uploads
    if (req.files && req.files.image) {
      updateData.image = `/uploads/products/${req.files.image[0].filename}`;
    }
    
    if (req.files && req.files.screenshots) {
      updateData.screenshots = req.files.screenshots.map(file => 
        `/uploads/products/${file.filename}`
      );
    }
    
    if (req.files && req.files.download) {
      updateData.downloadUrl = `/uploads/downloads/${req.files.download[0].filename}`;
    }

    // Parse JSON fields
    if (updateData.technologies && typeof updateData.technologies === 'string') {
      try {
        updateData.technologies = JSON.parse(updateData.technologies);
      } catch {
        updateData.technologies = updateData.technologies.split(',').map(tech => tech.trim()).filter(Boolean);
      }
    }
    if (updateData.features && typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch {
        updateData.features = updateData.features.split(',').map(feature => feature.trim()).filter(Boolean);
      }
    }
    if (updateData.requirements && typeof updateData.requirements === 'string') {
      try {
        updateData.requirements = JSON.parse(updateData.requirements);
      } catch {
        updateData.requirements = updateData.requirements.split(',').map(req => req.trim()).filter(Boolean);
      }
    }
    if (updateData.support && typeof updateData.support === 'string') {
      try {
        updateData.support = JSON.parse(updateData.support);
      } catch {
        updateData.support = updateData.support.split(',').map(sup => sup.trim()).filter(Boolean);
      }
    }
    
    // Convert price to float
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    console.log('Final update data:', updateData);
    
    const updatedProduct = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    console.log('Product updated successfully:', updatedProduct.id);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
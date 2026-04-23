import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import dotenv from 'dotenv';
import prisma from './lib/prisma.js';
import bcrypt from 'bcryptjs';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const isPrivateNetworkHostname = (hostname) => (
  hostname === 'localhost'
  || hostname === '127.0.0.1'
  || hostname === '::1'
  || /^10\./.test(hostname)
  || /^192\.168\./.test(hostname)
  || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
);

const getNetworkAddresses = () => {
  const interfaces = os.networkInterfaces();
  const addresses = new Set();

  Object.values(interfaces).forEach((networkInterface) => {
    networkInterface?.forEach((details) => {
      if (details.family === 'IPv4' && !details.internal) {
        addresses.add(details.address);
      }
    });
  });

  return Array.from(addresses);
};

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000 // allow up to 1000 requests per IP per windowMs for development
// });
// app.use(limiter);

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (process.env.NODE_ENV === 'production') {
      callback(null, origin === 'https://appsellpoint.com');
      return;
    }

    try {
      const { hostname } = new URL(origin);
      callback(null, isPrivateNetworkHostname(hostname));
    } catch {
      callback(null, false);
    }
  },
  credentials: true
}));



// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://yourdomain.com'] 
//     : ['http://localhost:5173', 'http://localhost:3000','https://appsellpoint.com'],
//   credentials: true
// }));


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import blogRoutes from './routes/blog.js';
import contactsRoutes from './routes/contacts.js';
import purchasesRoutes from './routes/purchases.js';
import dashboardRoutes from './routes/dashboard.js';
import uploadRoutes from './routes/upload.js';

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all route for undefined API endpoints
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Database connection and server start
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connection established successfully.');
    
    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@appsolutions.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const adminExists = await prisma.user.findUnique({ 
      where: { email: adminEmail } 
    });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN'
        }
      });
      console.log(`Default admin user created: ${adminEmail}`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }
    
    app.listen(PORT, HOST, () => {
      const networkAddresses = getNetworkAddresses();

      console.log(`Server running on port ${PORT}`);
      console.log(`Local: http://localhost:${PORT}`);
      networkAddresses.forEach((address) => {
        console.log(`Network: http://${address}:${PORT}`);
      });
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

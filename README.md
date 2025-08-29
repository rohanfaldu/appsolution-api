# AppSolutions - Mobile App Marketplace

A full-stack web application for selling ready-made mobile app solutions with admin panel, blog, and e-commerce functionality.

## Features

### Frontend
- 🎨 Modern React + TypeScript application
- 🎯 Responsive design with Tailwind CSS
- 🔐 Admin authentication and dashboard
- 🛒 Product catalog with search and filtering
- 📝 Blog system with content management
- 📧 Contact form with captcha
- 💳 PayPal checkout integration
- 📱 Mobile-first responsive design

### Backend
- 🚀 Node.js + Express REST API
- 🗄️ PostgreSQL database with Prisma ORM
- 🔒 JWT authentication and authorization
- 📁 File upload handling (images, downloads)
- 🛡️ Security middleware (helmet, rate limiting)
- 📊 Admin dashboard with analytics
- 🔍 Search and pagination
- 📈 Purchase tracking and analytics

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- React Router
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js + Express
- PostgreSQL + Prisma
- JWT for authentication
- Multer for file uploads
- Bcrypt for password hashing
- Express Rate Limit
- Helmet for security

## Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd appsolutions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database:**
   ```sql
   CREATE DATABASE appsolutions;
   ```

4. **Set up database schema:**
   ```bash
   npx prisma db push
   ```

5. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

6. **Start backend server:**
   ```bash
   npm run server
   ```

7. **Start frontend (in another terminal):**
   ```bash
   npm run dev
   ```

8. **Access the application:**
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:3001`
     - Admin login: `admin@appsolutions.com` / `admin123`
   - Prisma Studio: `npx prisma studio` (Database GUI)

### Default Admin Credentials
- Email: `admin@appsolutions.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all active products (public)
- `GET /api/products/:id` - Get single product (public)
- `GET /api/products/admin/all` - Get all products (admin)
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Blog
- `GET /api/blog` - Get published blog posts (public)
- `GET /api/blog/:id` - Get single blog post (public)
- `GET /api/blog/admin/all` - Get all blog posts (admin)
- `POST /api/blog` - Create blog post (admin)
- `PUT /api/blog/:id` - Update blog post (admin)
- `DELETE /api/blog/:id` - Delete blog post (admin)

### Contacts
- `POST /api/contacts` - Submit contact form (public)
- `GET /api/contacts` - Get all contacts (admin)
- `GET /api/contacts/:id` - Get single contact (admin)
- `PATCH /api/contacts/:id/status` - Update contact status (admin)
- `DELETE /api/contacts/:id` - Delete contact (admin)

### Purchases
- `POST /api/purchases` - Create purchase (public)
- `GET /api/purchases/transaction/:id` - Get purchase by transaction ID (public)
- `POST /api/purchases/download/:id` - Track download (public)
- `GET /api/purchases` - Get all purchases (admin)
- `PATCH /api/purchases/:id/status` - Update purchase status (admin)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (admin)

## File Structure

```
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   └── App.tsx            # Main App component
├── server/                # Backend source code
│   ├── config/            # Database configuration
│   ├── models/            # Sequelize models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   └── app.js             # Express app setup
├── uploads/               # File upload directory
│   ├── products/          # Product images
│   ├── blog/              # Blog images
│   └── downloads/         # Product downloads
└── public/                # Static assets
```

## Development

### Running in Development Mode

1. **Backend with auto-reload**
   ```bash
   npm install -g nodemon
   npm run dev:server
   ```

2. **Frontend with hot reload**
   ```bash
   npm run dev
   ```

## Database Management

### Prisma Commands
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (Database GUI)

### Schema Changes
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` for development
3. Run `npx prisma generate` to update client
4. For production, use `npx prisma migrate deploy`

### File Uploads

Files are stored in the `uploads/` directory:
- Product images: `uploads/products/`
- Blog images: `uploads/blog/`
- Product downloads: `uploads/downloads/`

## Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   DATABASE_URL=your-production-database-url
   JWT_SECRET=your-production-jwt-secret
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

## Features in Detail

### Admin Dashboard
- Real-time statistics and analytics
- Revenue and sales tracking
- Recent purchases and contacts
- Monthly revenue trends

### Product Management
- CRUD operations for products
- Image and file upload
- Category and technology tagging
- Status management (active/inactive)

### Blog System
- Rich content management
- Image uploads
- Category and tag system
- View tracking
- SEO-friendly URLs

### Contact Management
- Contact form submissions
- Status tracking (unread/read/replied)
- Email integration
- Spam protection with captcha

### Purchase System
- Secure payment processing
- Transaction tracking
- Download management
- Customer information storage

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- File upload restrictions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
export type StaticProduct = {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  technologies: string[];
  features: string[];
  requirements: string[];
  support: string[];
  image: string;
  screenshots: string[];
  videoUrl: string;
  downloadUrl?: string;
  rating: number;
  sales: number;
  createdAt: string;
};

const demoVideo = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

export const STATIC_PRODUCTS: StaticProduct[] = [
  {
    id: 'sp-ecom-01',
    name: 'E-Commerce Starter Pro',
    description: 'A clean e-commerce app with catalog, cart, checkout flow, and admin management.',
    fullDescription:
      'Launch a polished e-commerce experience quickly. Includes product listing, search, filters, cart, checkout flow, and an admin-ready structure. Built to be customized for your brand and your payments.',
    price: 499,
    category: 'ecommerce',
    technologies: ['Flutter', 'iOS', 'Android', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    features: [
      'Product catalog with search and filters',
      'Cart and checkout UX',
      'Admin-ready product management',
      'Secure authentication flow',
      'Responsive layouts and animations',
    ],
    requirements: ['Node.js 16+', 'PostgreSQL 12+', 'PayPal developer account (optional)'],
    support: ['Installation support', 'Customization guidance', 'Bug-fix support window'],
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    screenshots: [
      'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/5632352/pexels-photo-5632352.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    videoUrl: demoVideo,
    rating: 4.8,
    sales: 312,
    createdAt: '2026-04-14T10:30:00.000Z',
  },
  {
    id: 'sp-del-01',
    name: 'Delivery & Logistics Suite',
    description: 'Delivery-style product with order tracking patterns and scalable backend structure.',
    fullDescription:
      'A delivery-ready foundation with modern UX, tracking-friendly flows, and a backend structure designed for future expansion. Great for local delivery, courier, or hyperlocal marketplaces.',
    price: 599,
    category: 'delivery',
    originalPrice: 749,
    technologies: ['React Native', 'iOS', 'Android', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    features: [
      'Order flow patterns and status timelines',
      'Admin panel structure for ops',
      'Clean UI with motion and transitions',
      'Secure APIs and validation patterns',
      'Ready for maps and notifications integration',
    ],
    requirements: ['Node.js 16+', 'PostgreSQL 12+', 'Maps API key (optional)'],
    support: ['Installation support', 'Architecture guidance', 'Bug-fix support window'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    screenshots: [
      'https://images.pexels.com/photos/7363094/pexels-photo-7363094.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/7363092/pexels-photo-7363092.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/7363091/pexels-photo-7363091.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    videoUrl: demoVideo,
    rating: 4.7,
    sales: 241,
    createdAt: '2026-03-26T08:15:00.000Z',
  },
  {
    id: 'sp-health-01',
    name: 'Health & Fitness Tracker',
    description: 'A fitness UI kit and app shell with dashboards, goals, and progress components.',
    fullDescription:
      'A modern fitness foundation featuring dashboard widgets, goal components, and a cohesive design language. Perfect for coaching platforms, gyms, and wellness startups.',
    price: 399,
    category: 'health',
    originalPrice: 499,
    technologies: ['Flutter', 'iOS', 'Android', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    features: [
      'Dashboard widgets and progress UI',
      'Goal and habit components',
      'Mobile-first layouts',
      'Reusable component system',
      'Clean animation patterns',
    ],
    requirements: ['Node.js 16+'],
    support: ['Installation support', 'UI customization tips'],
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
    screenshots: [
      'https://images.pexels.com/photos/4098227/pexels-photo-4098227.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3766226/pexels-photo-3766226.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    videoUrl: demoVideo,
    rating: 4.6,
    sales: 198,
    createdAt: '2026-03-18T14:05:00.000Z',
  },
  {
    id: 'sp-saas-01',
    name: 'SaaS Landing + Admin',
    description: 'A professional marketing site layout plus admin-style screens and components.',
    fullDescription:
      'A crisp, conversion-focused landing flow paired with admin-ready layouts. Great for subscription products or internal tooling with a public marketing presence.',
    price: 299,
    category: 'productivity',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'iOS', 'Android'],
    features: [
      'High-conversion landing sections',
      'Admin-like tables and filters',
      'Design tokens and motion utilities',
      'Reusable cards, badges, and buttons',
      'Fast performance baseline',
    ],
    requirements: ['Node.js 16+'],
    support: ['Installation support', 'Layout customization guidance'],
    image: 'https://images.unsplash.com/photo-1676277791608-ac54525aa94d?w=800&q=80',
    screenshots: [
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/326518/pexels-photo-326518.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    videoUrl: demoVideo,
    rating: 4.5,
    sales: 411,
    createdAt: '2026-04-10T12:45:00.000Z',
  },
  {
    id: 'sp-edu-01',
    name: 'Education Course Marketplace',
    description: 'Course browsing UI, lesson pages, and purchase-ready structure for education products.',
    fullDescription:
      'A course marketplace shell with browsing, course detail pages, lesson layouts, and purchase-ready structure. Built to scale into a full learning platform.',
    price: 549,
    category: 'education',
    technologies: ['React Native', 'iOS', 'Android', 'Node.js', 'PostgreSQL', 'Prisma'],
    features: [
      'Course browsing and detail pages',
      'Lesson layout components',
      'Search and category filters',
      'Admin-ready content structure',
      'Responsive and animated UI',
    ],
    requirements: ['Node.js 16+', 'PostgreSQL 12+'],
    support: ['Installation support', 'Content model guidance'],
    image: 'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=800&q=80',
    screenshots: [
      'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/5905711/pexels-photo-5905711.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/5905712/pexels-photo-5905712.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    videoUrl: demoVideo,
    rating: 4.7,
    sales: 167,
    createdAt: '2026-02-28T09:00:00.000Z',
  },
  {
    id: 'sp-social-01',
    name: 'Social Community App',
    description: 'Community feed layouts, profiles, and admin foundation for content moderation.',
    fullDescription:
      'A social/community starter with feed patterns, profiles, and admin-friendly foundations for moderation and content management.',
    price: 449,
    category: 'social',
    technologies: ['Flutter', 'iOS', 'Android', 'Node.js', 'Express'],
    features: [
      'Feed layouts and post components',
      'Profile shells and settings UI',
      'Admin moderation foundations',
      'Reusable UI primitives',
      'Motion patterns that feel modern',
    ],
    requirements: ['Node.js 16+'],
    support: ['Installation support', 'Architecture guidance'],
    image: 'https://images.unsplash.com/photo-1675557009875-436f7a7b5f6b?w=800&q=80',
    screenshots: [
      'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=900',
      'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=900',
    ],
    videoUrl: demoVideo,
    rating: 4.4,
    sales: 126,
    createdAt: '2026-02-12T17:20:00.000Z',
  },
];

export const getStaticProductById = (id: string | number | undefined) => {
  const key = String(id ?? '');
  return STATIC_PRODUCTS.find((p) => p.id === key || String(p.id) === key) || null;
};

export const getFeaturedStaticProducts = (limit = 3) => {
  return [...STATIC_PRODUCTS].sort((a, b) => b.sales - a.sales).slice(0, limit);
};

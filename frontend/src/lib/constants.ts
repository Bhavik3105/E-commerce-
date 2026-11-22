export const siteConfig = {
  name: 'Jummip',
  description: 'Women’s t-shirts, nightsuits and undergarments in soft everyday cotton.',
  tagline: 'Style Meets Comfort',
  url: 'https://jummip.com', // Update in production
  contact: {
    email: 'hello@jummip.com',
    phone: '+91 98765 43210',
    address: 'Shop No. 12, Fashion Street, Mumbai, Maharashtra 400001',
  },
  social: {
    instagram: 'https://instagram.com/jummip',
    facebook: 'https://facebook.com/jummip',
  },
  currency: 'INR',
  currencySymbol: '₹',
} as const;

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop All', href: '/products' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
] as const;

export const footerLinks = {
  shop: [
    { label: 'T-Shirts', href: '/category/tshirts' },
    { label: 'Nightsuits', href: '/category/nightsuits' },
    { label: 'Undergarments', href: '/category/undergarments' },
  ],
  support: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Returns & Refunds', href: '/return-policy' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
  ],
} as const;


export const siteConfig = {
  name: 'Jummip',
  description: 'Premium quality garments for men, women and kids.',
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
  { label: 'Products', href: '/products' },
  { label: "Men's", href: '/category/mens-wear' },
  { label: "Women's", href: '/category/womens-wear' },
  { label: "Kids'", href: '/category/kids-wear' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
] as const;

export const footerLinks = {
  shop: [
    { label: "Men's Wear", href: '/category/mens-wear' },
    { label: "Women's Wear", href: '/category/womens-wear' },
    { label: "Kids' Wear", href: '/category/kids-wear' },
    { label: 'Accessories', href: '/category/accessories' },
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


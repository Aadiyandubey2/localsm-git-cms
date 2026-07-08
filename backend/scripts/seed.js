require('dotenv').config();

const connectDB = require('../src/config/db');
const seedAdmin = require('../src/utils/seedAdmin');
const Branding = require('../src/models/Branding');
const Business = require('../src/models/Business');
const Contact = require('../src/models/Contact');
const Footer = require('../src/models/Footer');
const Founder = require('../src/models/Founder');
const Hero = require('../src/models/Hero');
const Navigation = require('../src/models/Navigation');
const WebsiteSettings = require('../src/models/WebsiteSettings');
const currentYear = new Date().getFullYear();

const heroData = [
  {
    title: "LocalSM isn’t just a name. It’s a mission statement.",
    subtitle: 'Corporate Announcement',
    description:
      'We are building enduring infrastructure to connect, empower, and scale local merchants, logistics, and communities. From quick-commerce to local branding, our platforms redefine hyper-local life.',
    image: '/images/hero-building.jpg',
    ctaText: '',
    ctaLink: '',
    isActive: true,
  },
];

const founderMessage = [
  'Dear Shareholders, Partners, and Friends,',
  '',
  "When we first wrote the code for our delivery platform in 2018, we had a simple, singular goal: to help local restaurants reach customers online. We didn't anticipate how deeply integrated we would become in the daily lives of millions of people, or how our operations would expand to encompass grocery delivery and merchant business software.",
  '',
  'Today, our business is no longer just food delivery. It is hyper-local commerce in its entirety.',
  '',
  'Over the past few years, we have operated several independent brands. We acquired and scaled Janhal, turning it into India\'s fastest-growing quick-commerce network, delivering fresh produce and daily essentials to households in under 10 minutes. We built Local Branding Software, a powerful merchant SaaS suite that empowers over 250,000 local store owners to manage their digital presence, run hyper-local campaigns, and gain deep customer insights.',
  '',
  'Internally, we have always viewed ourselves as a single, cohesive team working toward a shared mission. However, our corporate structure and external communication have remained fragmented.',
  '',
  'To align our long-term vision and build an institution that endures, our Board of Directors has approved the transition of our corporate entity to a unified name: LocalSM Limited.',
  '',
  'LocalSM isn\'t just a name. It\'s a mission statement.',
  '',
  'The name "LocalSM" represents our absolute commitment to the hyper-local ecosystem. The "Local" represents our roots—the neighborhood grocery store, the local bakery, the delivery partner on the street. The "SM" stands for Scale and Management—our promise to provide the world-class technology, logistics, and software infrastructure to help these local heroes scale and thrive in a digital world.',
  '',
  'I want to make it clear that this is a corporate-level change. Our consumer-facing applications—the apps you use to order food or groceries—will retain their familiar brands. LocalSM will serve as the parent corporate identity, uniting our three core pillars:',
  '',
  '01 / Delivery',
  'LocalSM Delivery (formerly our core food app), connecting diners and restaurants across 800+ cities.',
  '',
  '02 / Quick Commerce',
  'Janhal, our ultra-fast commerce network delivering groceries and essentials in minutes.',
  '',
  '03 / Software',
  'Local Branding Software, our merchant suite empowering retail store owners with marketing SaaS.',
  '',
  'Our mission remains unchanged: to endure, evolve, and empower.',
  '',
  'We are not building a company for the next quarter or the next fiscal year. We are building an institution that will stand for decades. This requires extreme operational discipline, a relentless focus on first-principles thinking, and an willingness to disrupt our own business models before others do.',
  '',
  'As we embark on this next chapter as LocalSM, our focus on sustainability and responsibility will only deepen. We are accelerating our transition to an all-electric delivery fleet by 2030, and we are working toward absolute net-zero emissions across our value chain by 2033.',
  '',
  'Thank you for your continued trust, partnership, and belief in our mission.',
  '',
  'Sincerely,',
  'Kabir Sharma',
  'Founder & CEO, LocalSM Limited',
].join('\n');

const founderData = [
  {
    name: 'Kabir Sharma',
    title: 'Founder & CEO',
    message: founderMessage,
    signatureImage: '',
    portraitImage: '/images/founder.jpg',
    quote:
      'Our journey has always been about empowering those who make our cities run. As we evolve, our responsibility to build a permanent, resilient, and sustainable ecosystem only deepens.',
    isActive: true,
  },
];

const businessData = [
  {
    title: 'LocalSM Delivery',
    description:
      'Our flagship logistics and food delivery network. Connecting millions of customers with over 500,000 restaurant and merchant partners across 800+ cities with unparalleled efficiency.',
    image: '/images/delivery-rider.jpg',
    points: [
      {
        title: 'Food & More',
        description: 'Flagship logistics and food delivery network.',
      },
      {
        title: '500,000+ Partners',
        description: 'Restaurants and merchant partners across 800+ cities.',
      },
      {
        title: 'Hyper-local Reach',
        description: 'Built for broad coverage and operational efficiency.',
      },
    ],
    ctaText: 'Explore Platform',
    ctaLink: '#',
    isActive: true,
    sortOrder: 0,
  },
  {
    title: 'Janhal',
    description:
      'Our ultra-fast commerce arm. Delivering groceries, fresh produce, electronics, and daily essentials to households within 10 minutes, powered by a dense network of hyper-local dark stores.',
    image: '/images/office-interior.jpg',
    points: [
      {
        title: 'Quick Commerce',
        description: 'Ultra-fast fulfillment for household essentials.',
      },
      {
        title: '10-Minute Delivery',
        description: 'Dense dark-store network for rapid dispatch.',
      },
      {
        title: 'Fresh & Daily Needs',
        description: 'Groceries, produce, electronics, and more.',
      },
    ],
    ctaText: 'Explore Platform',
    ctaLink: '#',
    isActive: true,
    sortOrder: 1,
  },
  {
    title: 'Local Branding Software',
    description:
      'Our proprietary merchant suite. Empowering local store owners to manage digital storefronts, run localized micro-campaigns, and build customer loyalty with advanced marketing analytics.',
    image: '/images/local-merchant.jpg',
    points: [
      {
        title: 'Merchant SaaS',
        description: 'Digital storefronts and localized campaign management.',
      },
      {
        title: 'Advanced Analytics',
        description: 'Data-rich tools for better customer insight.',
      },
      {
        title: 'Local Business Enablement',
        description: 'Built to help small merchants compete digitally.',
      },
    ],
    ctaText: 'Explore Platform',
    ctaLink: '#',
    isActive: true,
    sortOrder: 2,
  },
];

const navigationData = [
  {
    logo: '/images/localsm-logo.svg',
    menuItems: [
      { label: 'Home', href: '/' },
      { label: 'Culture', href: '/culture' },
      { label: 'Careers', href: '/careers' },
      { label: 'Investors', href: '/investors' },
      { label: 'Impact', href: '/impact' },
      { label: 'Contact', href: '/contact' },
    ],
    ctaLabel: '',
    ctaHref: '',
    isActive: true,
  },
];

const footerData = [
  {
    logo: '/images/localsm-logo.svg',
    description:
      'To endure, evolve, and empower. Building the hyper-local commerce infrastructure of tomorrow.',
    links: [
      { label: 'LocalSM Delivery', href: '/' },
      { label: 'Janhal', href: '/' },
      { label: 'Local Branding Software', href: '/' },
      { label: 'Culture', href: '/culture' },
      { label: 'Careers', href: '/careers' },
      { label: 'Investors', href: '/investors' },
      { label: 'Impact & Sustainability', href: '/impact' },
      { label: 'Founder’s Letter', href: '/founder-letter' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Use', href: '#' },
      { label: 'Sitemap', href: '#' },
    ],
    socialLinks: [],
    copyrightText: `© ${currentYear} LocalSM Limited. All rights reserved.`,
    isActive: true,
  },
];

const brandingData = [
  {
    siteName: 'LocalSM Limited',
    logo: '/images/localsm-logo.svg',
    favicon: '/images/localsm-logo.svg',
    primaryColor: '#0055ff',
    secondaryColor: '#f4f4f4',
    accentColor: '#f4b000',
    fontFamily: 'Berkshire Swash',
    isActive: true,
  },
];

const websiteSettingsData = [
  {
    siteName: 'LocalSM Limited',
    tagline: 'To endure, evolve, and empower.',
    description: 'Building the hyper-local commerce infrastructure of tomorrow.',
    email: 'corporate@localsm.com',
    phone: '+91 124 499 9999',
    address: '12th Floor, DLF Cyber City, Phase 3, Gurugram, Haryana - 122002, India',
    socialLinks: [],
    seo: {
      title: 'LocalSM Limited',
      description: 'Building the hyper-local commerce infrastructure of tomorrow.',
      keywords: [
        'LocalSM',
        'hyper-local commerce',
        'delivery',
        'quick commerce',
        'merchant software',
      ],
    },
    isActive: true,
  },
];

const seedCollection = async (Model, documents, label) => {
  await Model.deleteMany({});

  for (const doc of documents) {
    await new Model(doc).save();
  }

  console.log(`✅ Seeded ${label}: ${documents.length}`);
};

const seedContent = async () => {
  try {
    await connectDB();

    await seedAdmin();

    await seedCollection(Hero, heroData, 'heroes');
    await seedCollection(Founder, founderData, 'founders');
    await seedCollection(Business, businessData, 'businesses');
    await seedCollection(Navigation, navigationData, 'navigation');
    await seedCollection(Footer, footerData, 'footer');
    await seedCollection(Branding, brandingData, 'branding');
    await seedCollection(WebsiteSettings, websiteSettingsData, 'website settings');
    await seedCollection(Contact, [], 'contacts');

    console.log('✅ LocalSM website content seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding LocalSM website content:');
    console.error(error);

    process.exit(1);
  }
};

seedContent();
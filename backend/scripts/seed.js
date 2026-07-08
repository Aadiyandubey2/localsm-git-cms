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

const HomepageDocument = require('../src/models/HomepageDocument');
const CulturePageDocument = require('../src/models/CulturePageDocument');
const ImpactPageDocument = require('../src/models/ImpactPageDocument');
const CareersPageDocument = require('../src/models/CareersPageDocument');
const Job = require('../src/models/Job');
const ContactPageDocument = require('../src/models/ContactPageDocument');
const Office = require('../src/models/Office');
const InvestorsPageDocument = require('../src/models/InvestorsPageDocument');
const FinancialReport = require('../src/models/FinancialReport');
const ShareholdingPattern = require('../src/models/ShareholdingPattern');
const BoardMember = require('../src/models/BoardMember');

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

const founderData = [
  {
    name: 'Kabir Sharma',
    title: 'Founder & CEO',
    signatureImage: '',
    portraitImage: '/images/founder.jpg',
    quote: 'Our journey has always been about empowering those who make our cities run. As we evolve, our responsibility to build a permanent, resilient, and sustainable ecosystem only deepens.',
    letterDate: '6 FEBRUARY 2026',
    readTime: '6 MINS',
    letterTitle: 'A note from our Founder, Kabir Sharma.',
    introduction: [
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
      'To align our long-term vision and build an institution that endures, our Board of Directors has approved the transition of our corporate entity to a unified name: LocalSM Limited.'
    ].join('\n'),
    calloutQuote: "LocalSM isn't just a name. It's a mission statement.",
    middleText: 'The name "LocalSM" represents our absolute commitment to the hyper-local ecosystem. The "Local" represents our roots—the neighborhood grocery store, the local bakery, the delivery partner on the street. The "SM" stands for Scale and Management—our promise to provide the world-class technology, logistics, and software infrastructure to help these local heroes scale and thrive in a digital world.\n\nI want to make it clear that this is a corporate-level change. Our consumer-facing applications—the apps you use to order food or groceries—will retain their familiar brands. LocalSM will serve as the parent corporate identity, uniting our three core pillars:',
    pillars: [
      { numberLabel: '01 / Delivery', title: 'LocalSM Delivery', description: 'Connecting diners and restaurants across 800+ cities.' },
      { numberLabel: '02 / Quick Commerce', title: 'Janhal', description: 'Groceries and essentials delivered in minutes.' },
      { numberLabel: '03 / Software', title: 'Local Branding Software', description: 'Merchant marketing SaaS suite.' }
    ],
    conclusion: 'Our mission remains unchanged: to endure, evolve, and empower.\n\nWe are not building a company for the next quarter or the next fiscal year. We are building an institution that will stand for decades. This requires extreme operational discipline, a relentless focus on first-principles thinking, and a willingness to disrupt our own business models before others do.\n\nAs we embark on this next chapter as LocalSM, our focus on sustainability and responsibility will only deepen. We are accelerating our transition to an all-electric delivery fleet by 2030, and we are working toward absolute net-zero emissions across our value chain by 2033.\n\nThank you for your continued trust, partnership, and belief in our mission.',
    signOffLabel: 'Sincerely,',
    isActive: true
  }
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
    wordmarkText: 'LocalSM',
    wordmarkHighlightIndex: 5,
    wordmarkHighlightColor: '#f4b000',
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
    cin: 'L74999HR2026PLC099999',
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

const homepageData = [
  {
    heroImageCaption: 'LocalSM Corporate Headquarters',
    heroImageCode: 'HQ-01 // GURUGRAM',
    founderTeaser: "In my latest letter to shareholders and partners, I outline why we are bringing our delivery, quick-commerce, and merchant software arms under a single unified corporate identity: LocalSM. This isn't a rebranding of our customer-facing apps; it is an alignment of our long-term mission to build institutions that endure.",
    founderLetterDate: 'February 6, 2026',
    businessSectionSubtitle: 'Under the LocalSM umbrella, we operate three market-leading hyper-local platforms.',
    visionTitle: 'Enduring institutions built on local empowerment.',
    visionDescription: 'LocalSM envisions a future where local commerce, hyper-local connectivity, and sustainable growth form the foundation of enduring community success. We build systems that stand the test of time, adapting to changing consumer behaviors while keeping the local merchant at the core of the economy.',
    missionTitle: 'To endure, evolve, and empower.',
    missionDescription: 'We build hyper-local platforms that redefine local commerce, uplift communities, and embody the promise of permanence through constant adaptation. We challenge our own ideas daily, dismantle what works to build what is better, and share our success with the millions of partners who depend on us.',
    impactMetrics: [
      { category: 'Environmental', value: '100%', description: 'Electric vehicle-based deliveries across our entire fleet by 2030.' },
      { category: 'Climate', value: '2033', description: 'Target date to achieve Net-Zero greenhouse gas emissions across our value chain.' },
      { category: 'Socioeconomic', value: '1.2M+', description: 'Delivery partners and local merchants empowered with active livelihoods.' },
      { category: 'Ecology', value: '100%', description: 'Plastic-neutral food and grocery delivery order fulfillment achieved.' }
    ],
    cultureTeaserSubtitle: 'Working at LocalSM',
    cultureTeaserTitle: 'This place is designed to make you feel uncomfortable.',
    cultureTeaserDescription: 'We don’t settle. We don’t rest on legacy success. We operate with extreme transparency, high ownership, and a relentless pace. If you thrive on comfort, this is not the place for you. If you thrive on building enduring things that matter, we should talk.',
    cultureTeaserImage: '/images/office-interior.jpg',
    isActive: true,
  }
];

const culturePageData = [
  {
    heroTitle: 'This place is designed to make you feel uncomfortable.',
    heroDescription: 'We don’t settle. We don’t rest on legacy success. We operate with extreme transparency, high ownership, and a relentless pace. If you thrive on comfort, this is not the place for you.',
    philosophyImage: '/images/office-interior.jpg',
    philosophyImageAlt: 'LocalSM Collaboration Space',
    philosophyQuote: '"We don\'t manage people. We manage missions."',
    philosophyBody: [
      'We believe that standard corporate hierarchies are designed to optimize for predictability, not impact. At LocalSM, we do not want predictability. We want excellence, high-agency, and radical ownership.',
      'We speak the truth directly and immediately. We do not sugarcoat feedback because we believe that politeness at the expense of growth is a disservice to our colleagues and partners.',
      'Our team is built on intellectual honesty—we celebrate being wrong because it means we are closer to finding the right solution. If you want a comfortable job, this is not it. If you want to build enduring infrastructure, welcome.'
    ],
    valuesTitle: 'Our Core Values',
    valuesSubtitle: 'These are the principles that guide our daily actions and long-term decisions.',
    valuesList: [
      { num: '01', title: 'Extreme Ownership', description: 'We do not wait to be told what to do. If you see a problem, you own it until it is solved. We do not have room for spectators.' },
      { num: '02', title: 'Radical Candor', description: 'We speak the truth directly and immediately. We do not sugarcoat feedback.' },
      { num: '03', title: 'First Principles Thinking', description: 'We break problems down to their fundamental truths and build upward from there.' },
      { num: '04', title: 'Bias for Action', description: 'Speed matters. A good decision made today is infinitely better than a perfect decision next week.' },
      { num: '05', title: 'Obsession with Partners', description: 'Our merchants and delivery partners are our lifeblood. Every decision must make their lives better.' },
      { num: '06', title: 'Intellectual Honesty', description: 'We dismantle our own successful models if we find a better way forward.' }
    ],
    ctaTitle: 'Are you ready to do the most challenging work of your life?',
    ctaDescription: 'We are always looking for exceptional engineers, product thinkers, and operational leaders who want to build the future of hyper-local commerce.',
    ctaButtonText: 'Explore Open Roles',
    isActive: true,
  }
];

const impactPageData = [
  {
    heroTitle: 'Responsible growth at scale.',
    heroDescription: 'We believe that corporate growth is meaningless if it occurs at the expense of our environment or communities. We integrate ESG principles into our core operations.',
    metricsTitle: 'Key Progress Metrics',
    metricsSubtitle: 'Measuring our real-world impact in real-time.',
    metrics: [
      { label: 'EV Deliveries Completed', value: '42M+', subText: 'Up from 12M in FY25' },
      { label: 'Plastic Waste Recycled', value: '18,500 MT', subText: '100% of packaging footprint' },
      { label: 'Partner Education Grants', value: '₹12.5 Cr', subText: 'Awarded to 8,000+ children' },
      { label: 'Merchant Digital Training', value: '250,000+', subText: 'Small businesses upskilled' }
    ],
    initiativesTitle: 'Stewardship Initiatives',
    initiativesSubtitle: 'Hard targets we measure with scientific discipline.',
    initiatives: [
      { iconType: 'Leaf', title: 'Net-Zero Pathway (2033)', description: 'We are committed to achieving net-zero greenhouse gas emissions across our entire value chain by 2033.' },
      { iconType: 'Shield', title: '100% EV Deliveries (2030)', description: 'By 2030, all food and grocery deliveries across LocalSM Delivery and Janhal will be executed via electric vehicles.' },
      { iconType: 'Heart', title: 'Plastic Neutrality', description: 'We have achieved 100% plastic neutrality across our delivery order packaging.' }
    ],
    socialTitle: 'Socioeconomic Empowerment',
    socialDescription: 'Our growth is intrinsically linked to the health of our communities. We support over 1.2M delivery partners and merchants across the country with insurance, financial tools, and digital upskilling.',
    socialImage: '/images/delivery-rider.jpg',
    socialImageAlt: 'LocalSM Delivery Partner',
    isActive: true,
  }
];

const careersPageData = [
  {
    heroTitle: 'Build things that outlast you.',
    heroDescription: 'We do not offer jobs; we offer missions. We are looking for builders, thinkers, and operators who want to define hyper-local commerce.',
    philosophyTitle: 'Our Hiring Philosophy',
    philosophySubtitle: 'How we build high-agency, long-term teams.',
    principles: [
      { label: 'High Agency', title: 'We value individuals who find a way', description: 'We want people who get things done despite obstacles, run through walls, and refuse to accept standard constraints.' },
      { label: 'Intellectual Curiosity', title: 'Deep first-principles understanding', description: 'You must have a deep desire to understand how things work and build upwards from fundamental truths.' },
      { label: 'Resilience & Grit', title: 'Building for the long-term', description: 'Building enduring institutions is hard work. We value persistence and focus over short-term optimization.' }
    ],
    isActive: true,
  }
];

const jobData = [
  {
    title: 'Principal Software Engineer — Quick Commerce Platform',
    department: 'Engineering',
    location: 'Bengaluru',
    type: 'Full-time',
    description: 'Build and scale the hyper-local routing and order matching engines that power Janhal’s 10-minute delivery ecosystem. Experience with high-throughput distributed systems is required.',
    isActive: true,
  },
  {
    title: 'Senior Frontend Engineer — Merchant Suite',
    department: 'Engineering',
    location: 'Gurugram',
    type: 'Full-time',
    description: 'Lead the development of our next-generation Local Branding Software. You will build highly responsive, data-rich dashboards that empower local merchants to manage their digital presence.',
    isActive: true,
  },
  {
    title: 'Director of Product — Hyper-local Logistics',
    department: 'Product Management',
    location: 'Gurugram',
    type: 'Full-time',
    description: 'Own the product vision and roadmap for LocalSM Delivery’s core dispatch, allocation, and delivery partner experience. Drive efficiency gains across our 500,000+ courier fleet.',
    isActive: true,
  },
  {
    title: 'Head of Dark Store Operations',
    department: 'Operations',
    location: 'Mumbai',
    type: 'Full-time',
    description: 'Oversee operational performance, inventory accuracy, and picking efficiency across our network of 150+ Janhal dark stores in the Western region.',
    isActive: true,
  },
  {
    title: 'Lead Product Designer — Consumer Experience',
    department: 'Design',
    location: 'Bengaluru',
    type: 'Full-time',
    description: 'Craft intuitive, simple, and delightful consumer ordering journeys for LocalSM Delivery and Janhal. Strong visual design and interaction prototyping skills are essential.',
    isActive: true,
  },
  {
    title: 'Growth Marketing Lead — Merchant Acquisition',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design and execute multi-channel growth campaigns to acquire and onboard local merchants onto our software platforms. Experience in B2B SaaS marketing is required.',
    isActive: true,
  }
];

const contactPageData = [
  {
    heroTitle: 'Let\'s connect.',
    heroDescription: 'Reach out to our teams for media inquiries, partnership discussions, or corporate support.',
    departmentalContacts: [
      { label: 'Media & Public Relations', email: 'press@localsm.com', description: 'For press releases, brand assets, and official statements.' },
      { label: 'Investor Relations', email: 'investors@localsm.com', description: 'For shareholding queries, financial results, and analyst meets.' },
      { label: 'Merchant Partnerships', email: 'merchants@localsm.com', description: 'For store onboarding, software training, and billing support.' }
    ],
    formTitle: 'Send a Message',
    formInstructions: 'All fields are required.',
    officeSectionTitle: 'Our Offices',
    officeSectionSubtitle: 'Where we build the future of hyper-local commerce.',
    isActive: true,
  }
];

const officeData = [
  {
    city: 'Gurugram (Headquarters)',
    address: 'LocalSM Limited, 12th Floor, DLF Cyber City, Phase 3, Gurugram, Haryana - 122002',
    phone: '+91 124 499 9999',
    sortOrder: 0,
    isActive: true,
  },
  {
    city: 'Bengaluru Office',
    address: 'LocalSM Limited, 3rd Floor, Prestige Tech Park, Outer Ring Road, Kadubeesanahalli, Bengaluru, Karnataka - 560103',
    phone: '+91 80 499 9999',
    sortOrder: 1,
    isActive: true,
  },
  {
    city: 'Mumbai Office',
    address: 'LocalSM Limited, Level 4, Naman Centre, G Block, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra - 400051',
    phone: '+91 22 499 9999',
    sortOrder: 2,
    isActive: true,
  }
];

const investorsPageData = [
  {
    heroTitle: 'Long-term value through discipline.',
    heroDescription: 'LocalSM Limited (NSE: LOCALS / BSE: 544444) is committed to building a sustainable, profitable, and highly resilient hyper-local commerce ecosystem. We prioritize long-term cash flow generation and governance over short-term optimization.',
    stockSymbol: 'LOCALS',
    stockIsin: 'INE000001010',
    stockBasePrice: 246.65,
    marketCap: '₹78,450 Cr',
    peRatio: '68.4',
    fiftyTwoWeekHigh: '₹268.00',
    fiftyTwoWeekLow: '₹134.50',
    ytdPerformance: '+84.5%',
    chartStartDate: 'Feb 2025',
    chartEndDate: 'Feb 2026',
    isActive: true,
  }
];

const financialReportData = [
  { period: 'Q3 FY26 (Ended Dec 31, 2025)', revenue: '₹4,820 Cr', growth: '+32% YoY', profit: '₹285 Cr', sortOrder: 0, isActive: true },
  { period: 'Q2 FY26 (Ended Sep 30, 2025)', revenue: '₹4,410 Cr', growth: '+28% YoY', profit: '₹210 Cr', sortOrder: 1, isActive: true },
  { period: 'Q1 FY26 (Ended Jun 30, 2025)', revenue: '₹4,180 Cr', growth: '+25% YoY', profit: '₹180 Cr', sortOrder: 2, isActive: true },
  { period: 'FY25 Annual Report', revenue: '₹15,860 Cr', growth: '+30% YoY', profit: '₹620 Cr', sortOrder: 3, isActive: true }
];

const shareholdingPatternData = [
  { category: 'Promoters & Promoter Group', percentage: '31.4%', sortOrder: 0, isActive: true },
  { category: 'Foreign Institutional Investors (FII)', percentage: '38.2%', sortOrder: 1, isActive: true },
  { category: 'Mutual Funds & Domestic Institutions (DII)', percentage: '18.6%', sortOrder: 2, isActive: true },
  { category: 'Public & Retail Shareholders', percentage: '11.8%', sortOrder: 3, isActive: true }
];

const boardMemberData = [
  { name: 'Kabir Sharma', role: 'Founder, Managing Director & CEO', bio: 'Founded LocalSM in 2018. Under his leadership, the company has scaled to become India’s premier hyper-local commerce network.', sortOrder: 0, isActive: true },
  { name: 'Dr. Ananya Sen', role: 'Lead Independent Director', bio: 'Former Deputy Governor of the Reserve Bank of India with 35+ years of experience in economic policy and financial regulation.', sortOrder: 1, isActive: true },
  { name: 'Rajesh Khanna', role: 'Non-Executive Director', bio: 'Managing Partner at Cyber Ventures, with extensive experience in scaling consumer internet platforms across Asia.', sortOrder: 2, isActive: true },
  { name: 'Meera Deshpande', role: 'Independent Director', bio: 'Distinguished Professor of Computer Science at IIT Bombay, specializing in distributed databases and machine learning.', sortOrder: 3, isActive: true }
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

    await seedCollection(HomepageDocument, homepageData, 'homepage document');
    await seedCollection(CulturePageDocument, culturePageData, 'culture page document');
    await seedCollection(ImpactPageDocument, impactPageData, 'impact page document');
    await seedCollection(CareersPageDocument, careersPageData, 'careers page document');
    await seedCollection(Job, jobData, 'jobs');
    await seedCollection(ContactPageDocument, contactPageData, 'contact page document');
    await seedCollection(Office, officeData, 'offices');
    await seedCollection(InvestorsPageDocument, investorsPageData, 'investors page document');
    await seedCollection(FinancialReport, financialReportData, 'financial reports');
    await seedCollection(ShareholdingPattern, shareholdingPatternData, 'shareholding patterns');
    await seedCollection(BoardMember, boardMemberData, 'board members');

    console.log('✅ LocalSM website content seeded successfully.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding LocalSM website content:');
    console.error(error);

    process.exit(1);
  }
};

seedContent();
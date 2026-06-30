export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  basePrice: number; // PKR
  popularServices: string[];
}

export interface City {
  name: string;
  province: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  role: 'customer' | 'professional' | 'all';
}

export const CATEGORIES: Category[] = [
  {
    id: 'ac-technician',
    name: 'AC Technician',
    icon: 'Wind',
    description: 'Expert AC installation, repair, cleaning, and gas refilling services.',
    basePrice: 1500,
    popularServices: ['AC Installation', 'AC General Service', 'Gas Refilling', 'Leakage Repair']
  },
  {
    id: 'electrician',
    name: 'Electrician',
    icon: 'Zap',
    description: 'Professional wiring, fan repairs, UPS installation, and short-circuit fixes.',
    basePrice: 800,
    popularServices: ['Wiring & Rewiring', 'UPS Installation', 'Fan & Appliance Repair', 'Short Circuit Fixes']
  },
  {
    id: 'plumber',
    name: 'Plumber',
    icon: 'Droplet',
    description: 'Leak repairs, bathroom fittings installation, water tank cleaning, and pipe fixing.',
    basePrice: 1000,
    popularServices: ['Tap Repair & Leakages', 'Bathroom Fittings', 'Water Pump Repair', 'Drain Clogging']
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    icon: 'Hammer',
    description: 'Furniture repair, door installation, lock fixing, and kitchen woodwork.',
    basePrice: 1200,
    popularServices: ['Door Repair & Locks', 'Furniture Assembly', 'Kitchen Cabinet Repair', 'Sofa Polish']
  },
  {
    id: 'painter',
    name: 'Painter',
    icon: 'Paintbrush',
    description: 'Interior & exterior painting, wall putty, waterproofing, and wallpapers.',
    basePrice: 2000,
    popularServices: ['Wall Painting', 'Waterproofing', 'Wall Putty Application', 'Wallpaper Fixing']
  },
  {
    id: 'cleaner',
    name: 'Home Cleaner',
    icon: 'Sparkles',
    description: 'Full house deep cleaning, sofa cleaning, carpet washing, and fumigation.',
    basePrice: 2500,
    popularServices: ['Deep House Cleaning', 'Sofa & Carpet Cleaning', 'Water Tank Cleaning', 'Fumigation']
  },
  {
    id: 'mechanic',
    name: 'Auto Mechanic',
    icon: 'Wrench',
    description: 'On-road car breakdown help, periodic maintenance, engine repair, and tuning.',
    basePrice: 1800,
    popularServices: ['Engine Tuning', 'Brake Repair', 'Car Diagnostics', 'Battery Jumpstart']
  },
  {
    id: 'beautician',
    name: 'Barber & Beautician',
    icon: 'Scissors',
    description: 'Professional hair cutting, makeup, facial, and salon services at the comfort of your home.',
    basePrice: 1000,
    popularServices: ['Haircut & Beard Trim', 'Facial & Scrub', 'Bridal/Party Makeup', 'Manicure & Pedicure']
  }
];

export const CITIES: City[] = [
  { name: 'Karachi', province: 'Sindh' },
  { name: 'Lahore', province: 'Punjab' },
  { name: 'Islamabad', province: 'ICT' },
  { name: 'Rawalpindi', province: 'Punjab' },
  { name: 'Peshawar', province: 'KPK' },
  { name: 'Faisalabad', province: 'Punjab' },
  { name: 'Multan', province: 'Punjab' },
  { name: 'Sialkot', province: 'Punjab' },
  { name: 'Quetta', province: 'Balochistan' },
  { name: 'Gujranwala', province: 'Punjab' }
];

export const BLOGS: BlogArticle[] = [
  {
    id: 'ac-maintenance-tips',
    title: '5 Crucial Signs Your AC Needs Servicing Immediately',
    excerpt: 'Is your AC not cooling enough? Learn the top warning signs of AC failure and save money on expensive repair bills this summer.',
    content: 'Summers in Pakistan can be brutal, with temperatures regularly soaring past 40°C in cities like Lahore, Karachi, and Multan. Your air conditioner works overtime to keep your home cool. However, without timely maintenance, AC units can lose efficiency, consume more electricity, and eventually break down. Here are 5 critical signs that indicate your air conditioner needs a professional service right away:\n\n1. Weak Airflow or Warm Air: If you feel weak airflow or warm air blowing from your vents, it usually indicates a clogged air filter, compressor failure, or a gas leak.\n\n2. High Electricity Bills: A dirty AC compressor or clogged condenser coils force the machine to work twice as hard, leading to a massive surge in electricity bills.\n\n3. Strange Noises: Squealing, grinding, or rattling sounds are warning signs of a failing motor, damaged bearings, or loose internal components.\n\n4. Bad Odors: A musty smell points to mold growth inside the AC unit, whereas a burning smell indicates an electrical fault.\n\n5. Water Dripping: Water leakage from the indoor unit is usually caused by a blocked drainage pipe or frozen evaporator coils.\n\nDon\'t wait for your AC to break down completely in the middle of a hot summer day. Hire a verified AC technician on FixKer.pk to get your unit professionally serviced and optimized for peak cooling.',
    author: 'Engr. Kamran Khan',
    category: 'AC Technician',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&q=80&w=800',
    readTime: '4 mins read',
    date: 'June 25, 2026'
  },
  {
    id: 'electrical-safety-pakistan',
    title: 'Essential Home Electrical Safety Guide for Monsoon Season',
    excerpt: 'Monsoon brings rain and relief, but also high electrical risks. Learn how to secure your home wiring, UPS systems, and appliances.',
    content: 'The monsoon season in Pakistan brings a welcome break from the sweltering heat, but it also increases the risk of electrical accidents, short-circuits, and electrocutions due to high humidity and rain. Preparing your home for the rainy season can prevent major fire hazards and keep your family safe.\n\nHere are crucial safety measures recommended by expert electricians on FixKer.pk:\n\n1. Check for Exposed Wiring: Inspect your roofs, lawns, and balconies for any open or naked wires. Rainwater contacting bare wires is a leading cause of domestic short-circuits and shock hazards.\n\n2. Secure Your UPS and Inverters: Keep your UPS systems, solar inverters, and heavy batteries in a dry, ventilated, and elevated place. Avoid touching batteries or terminals with wet hands.\n\n3. Install a Circuit Breaker (ELCB/RCCB): Earth Leakage Circuit Breakers detect minor leaks in the electrical current and instantly cut off power, saving lives in case of a fault.\n\n4. Unplug Appliances During Heavy Storms: Heavy monsoon storms are often accompanied by lightning and voltage fluctuations that can destroy expensive refrigerators, LED TVs, and AC units. Unplug them when a storm hits.\n\n5. Avoid Using Metal Ladders or Tools Near Lines: If you need to fix anything, do not do it in the rain. Ground water increases electrical conductivity dramatically.\n\nIf you notice frequent tripping, sparkling sockets, or damp walls, call a professional electrician on FixKer.pk to inspect and upgrade your home wiring.',
    author: 'Muhammad Bilal',
    category: 'Electrician',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    readTime: '5 mins read',
    date: 'June 18, 2026'
  },
  {
    id: 'plumbing-leaks-solution',
    title: 'How to Prevent Water Seepage and Wall Dampness (Seem) in Pakistan',
    excerpt: 'Wall dampness or "Seem" is a common nightmare for Pakistani homeowners. Discover why it occurs and how to fix plumbing leaks permanently.',
    content: 'Water seepage, locally known as "Seem" or "Shor", is one of the biggest challenges for homeowners in Pakistan. It destroys plaster, flakes paint, breeds mold, and weakens the foundation of the house. Most people try to repaint the wall, but this only hides the symptom. To fix seem permanently, you must address the root cause, which is almost always a plumbing leak or poor waterproofing.\n\nLet\'s understand how to tackle seem effectively:\n\n1. Find the Source: Look for hidden plumbing lines behind the damp walls. Taps, toilets, showers, and drainage pipes running through walls are common leakage culprits.\n\n2. Use Pressure Tests: Professional plumbers use water pressure tests to locate hairline cracks or leaks in internal water pipes without breaking the entire wall.\n\n3. Water Proof the Roof and Bathrooms: Water seeping from the roof or bathroom floor can travel down walls. Applying professional waterproofing chemical coats before tiling is highly recommended.\n\n4. Fix Blocked Roof Drains: In many Pakistani houses, roof drains get choked with dust and plastic wrappers, causing rain water to pool on the roof and seep through concrete.\n\n5. Maintain Bathrooms and Kitchens: Re-apply high-quality silicone gel or white cement grouting to gaps between tiles and around washbasins every year.\n\nIf you are facing persistent wall dampness, hire a premium plumber from FixKer.pk who can diagnose hidden leaks and execute water-proofing repairs with durable materials.',
    author: 'Ustad Sajid Ali',
    category: 'Plumber',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
    readTime: '6 mins read',
    date: 'June 10, 2026'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do you verify the professionals on FixKer.pk?',
    answer: 'Every professional registered with us undergoes a thorough identity verification process. We collect their national identity cards (CNIC), check their past work experience, and require them to provide proof of certifications where applicable. Approved professionals are given a "Verified Pro" badge on their profile.',
    role: 'all'
  },
  {
    id: 'faq-2',
    question: 'Is there a booking or registration fee for customers?',
    answer: 'No, registration and booking are absolutely free for customers on FixKer.pk. You only pay the professional for the work done, based on the agreed rates (hourly or project-based).',
    role: 'customer'
  },
  {
    id: 'faq-3',
    question: 'How do I pay the professional?',
    answer: 'Currently, you can pay professionals directly via Cash on Service, JazzCash, EasyPaisa, or direct bank transfer upon completion of the task. Be sure to discuss and confirm the payment method with the professional prior to starting work.',
    role: 'customer'
  },
  {
    id: 'faq-4',
    question: 'How can I register as a professional on FixKer.pk?',
    answer: 'Registering as a service provider is simple. Go to the Sign Up page, select the "Professional" role, fill in your business details, city, category, and hourly rate. After signing up, upload your CNIC photo and experience details in your dashboard. Our admin team will review and approve your profile within 24-48 hours.',
    role: 'professional'
  },
  {
    id: 'faq-5',
    question: 'What should I do if a professional does not show up?',
    answer: 'If a professional fails to arrive at the scheduled time, you can contact them directly via their phone or the WhatsApp button on their profile. If they remain unreachable, you can cancel the booking from your Customer Dashboard and book another professional, or contact our support team.',
    role: 'customer'
  },
  {
    id: 'faq-6',
    question: 'Are there any commissions charged to professionals?',
    answer: 'FixKer.pk is currently in its introductory phase, so we are charging 0% commission! Professionals keep 100% of their earnings. In the future, a very nominal monthly subscription or lead fee might be introduced, which will be announced well in advance.',
    role: 'professional'
  }
];

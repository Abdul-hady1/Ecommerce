import { StoreConfig } from './types';

export const DEFAULT_STORES: StoreConfig[] = [
  {
    id: 'aether',
    name: 'Aether Athletics',
    tagline: 'Precision engineered performance gear.',
    themeColor: 'emerald',
    fontFamily: 'sans',
    bannerText: 'THE CARBON REVOLUTION — GET 15% OFF WITH CODE: RUNATHLETICS',
    bannerImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'aether-1',
        name: 'Aether Zoom Alpha',
        price: 180,
        description: 'Encircled by dual carbon launching plates and wrapped in hyper-threaded vapor mesh, the Zoom Alpha provides unparalleled energy return and light cushioning for elite road marathons and speed records.',
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        colors: ['#EF4444', '#10B981', '#3B82F6'],
        sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
        rating: 4.8,
        reviewsCount: 342,
        features: ['Dual-density carbon fiber propulsion flyplate', 'Hyper-breathable VaporWeave engineered mesh upper', 'Responsive Pebax nitrogen-infused foam cushion']
      },
      {
        id: 'aether-2',
        name: 'Vapor Shell Windbreaker',
        price: 140,
        description: 'An ultralight, packable membrane designed for severe mountain trail sessions. Windproof, waterproof, and micro-vented to prevent heat lock while remaining as thin as a single sheet of tracing paper.',
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80',
        colors: ['#1F2937', '#15803D', '#4B5563'],
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.6,
        reviewsCount: 118,
        features: ['Microporous hydrostatic head ventilation', 'Packs completely into chest pocket with double-sided zip', '3M reflective details for night visibility']
      },
      {
        id: 'aether-3',
        name: 'Helix 40L Gym Duffle',
        price: 85,
        description: 'A structural, ripstop duffle that morphs instantly into an ergonomic backpack. Featuring isolated moisture-draining compartments for mud-soaked shoes or wet gear alongside heavy-duty weatherproof zippers.',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
        colors: ['#111827', '#4B5563'],
        sizes: ['One Size'],
        rating: 4.9,
        reviewsCount: 206,
        features: ['Waterproof CORDURA® ballistic shell', 'FIDLOCK® quick-release magnetic harness buckles', 'Deodorizing dry ventilated compartment']
      },
      {
        id: 'aether-4',
        name: 'Aether 32oz Hydro Flask',
        price: 45,
        description: 'Double-walled copper vacuum steel bottle engineered to preserve sub-zero temperatures for up to 36 hours. Topped with a high-flow magnetic tether capping rig for seamless flow under high exertion.',
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
        colors: ['#D1FAE5', '#374151', '#F59E0B'],
        sizes: ['32oz'],
        rating: 4.7,
        reviewsCount: 94,
        features: ['Double-wall copper vacuum insulation layer', 'Food-grade 18/8 kitchen stainless steel', '100% leak-proof magnetic flip locking spout']
      }
    ]
  },
  {
    id: 'nova',
    name: 'Nova Tech',
    tagline: 'Acoustic perfection. Minimalist footprint.',
    themeColor: 'sky',
    fontFamily: 'mono',
    bannerText: 'THE FUTURE OF AUDIO IN YOUR HANDS — USE CODE: NOVASOUND',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'nova-1',
        name: 'Nova ANC Pulse Headphones',
        price: 299,
        description: 'Engineered with hybrid dual-feedforward microphones and custom 40mm biodynamic transducers, the Nova Pulse creates a pristine negative-noise soundstage while tracking head gestures for real-time spatial positioning.',
        category: 'Audio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        colors: ['#111827', '#F3F4F6'],
        sizes: ['Standard'],
        rating: 4.9,
        reviewsCount: 412,
        features: ['45dB Smart Hybrid Active Noise Cancellation', '96kHz/24-bit Hi-Res LDAC audio decoding', 'Dynamic spatial audio with integrated head-tracking gyroscope']
      },
      {
        id: 'nova-2',
        name: 'SoundBar Mini Sphere',
        price: 150,
        description: 'An omnidirectional acoustic powerhouse encased in seamless circular structural felt. Employs micro-acoustic wave reflection lenses to distribute crisp high frequencies and deep punchy bass equally across entire rooms.',
        category: 'Speakers',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
        colors: ['#374151', '#9CA3AF'],
        sizes: ['Compact'],
        rating: 4.5,
        reviewsCount: 76,
        features: ['360-degree acoustic horizontal dispersion lens', 'Bespoke custom woven acoustic-wool baffle sleeve', '12-hour continuous internal li-ion cell fuel tank']
      },
      {
        id: 'nova-3',
        name: 'Nova Watch Chronos',
        price: 349,
        description: 'A flawless smartwatch of monolithic titanium. Features an adaptive always-on micro-OLED panel, advanced heart-rate array tracking, and bespoke mechanical haptic tickers that provide pleasant rhythmic vibration alerts.',
        category: 'Wearables',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
        colors: ['#030712', '#E5E7EB'],
        sizes: ['41mm', '45mm'],
        rating: 4.7,
        reviewsCount: 224,
        features: ['Monolith grade-5 sandblasted titanium casing', 'Heart-rate HRV and clinical SpO2 photodiode array', 'True haptic virtual fly-wheel crown dial']
      },
      {
        id: 'nova-4',
        name: 'Nova MagCharge Dock',
        price: 79,
        description: 'A 3-in-1 weighted premium charging rig carved from an solid block of aerospace grade-6 aluminum. Natively delivers 15W high-efficiency wireless juice to your phone, headset, and wearables simultaneously.',
        category: 'Power',
        image: 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&auto=format&fit=crop&q=80',
        colors: ['#4B5563', '#9CA3AF'],
        sizes: ['One Size'],
        rating: 4.4,
        reviewsCount: 52,
        features: ['Anodized aluminum alloy body with slip-free base', '15W rapid wireless magnetic inductive coils', 'Single neat high-speed USB-C braided rear feed']
      }
    ]
  },
  {
    id: 'vellum',
    name: 'Vellum Slate',
    tagline: 'Tangible essentials for the thoughtful creator.',
    themeColor: 'amber',
    fontFamily: 'serif',
    bannerText: 'THE TOUCH OF REAL FLAX AND BULLET PEN — 10% OFF CODE: ARTIFACT',
    bannerImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'vellum-1',
        name: 'Modernist Linen Journal',
        price: 32,
        description: 'Flat-lay 160 GSM dot grid journal featuring binding wrapped in organic, unbleached Belgian flax linen. Acid-free crisp cream paper engineered to resist pigment bleeding even under intense fountain pen flows.',
        category: 'Paper',
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80',
        colors: ['#B45309', '#14532D', '#9A3412'],
        sizes: ['A5 Dot Grid', 'A5 Ruled'],
        rating: 4.9,
        reviewsCount: 153,
        features: ['Acid-free 160 GSM premium wood-free cream leaves', '180° perfect lay-flat exposed binding structure', 'Expandable linen back pocket with cotton ribbon markers']
      },
      {
        id: 'vellum-2',
        name: 'Vellum Matte Brass Pen',
        price: 65,
        description: 'A heavy, continuous-body pen precision micro-machined from raw solid C360 brass. Develops a deeply personal, gorgeous dark oxide patina as its surface reacts uniquely over time to your hands.',
        category: 'Writing',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
        colors: ['#F59E0B', '#111827'],
        sizes: ['0.5mm Fine'],
        rating: 4.8,
        reviewsCount: 229,
        features: ['Zero-backlash solid brass internal threads', 'Compatible with Schmidt P900 Parker-style liquid ink refills', 'Hand-polished raw tactical matte finishing']
      },
      {
        id: 'vellum-3',
        name: 'Lana Wool Woolen Desk Pad',
        price: 55,
        description: 'Delineate your active focus space. Composed of double fleece compressed merino wool felt backed by an ultra-grippy natural cork stratum, preserving warm tactile workspace hand rests.',
        category: 'Workspace',
        image: 'https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=600&auto=format&fit=crop&q=80',
        colors: ['#4B5563', '#D1D5DB'],
        sizes: ['Medium (30x60cm)', 'Large (40x95cm)'],
        rating: 4.7,
        reviewsCount: 88,
        features: ['100% pure merino pressed wool top face', 'Slip-resistant organic self-healing rubber cork bottom', 'Precision micro-stitched clean edge anti-fray border']
      },
      {
        id: 'vellum-4',
        name: 'Minimalist Walnut Valet Tray',
        price: 48,
        description: 'Carefully sculpted from a single solid block of certified FSC American Black Walnut. Features perfectly radius-milled cavities padded with split-hide leather inserts to protect fine brass tools, watches, and keys.',
        category: 'Workspace',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80',
        colors: ['#78350F'],
        sizes: ['Standard'],
        rating: 4.6,
        reviewsCount: 72,
        features: ['Responsibly harvested premium solid American Walnut', 'CNC-milled and hand-finished with natural orange oil', 'Ultra-soft padded split suede leather compartment inserts']
      }
    ]
  }
];

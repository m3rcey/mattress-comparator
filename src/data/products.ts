export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  financingAPR: number;
  financingTerm: number;
  warrantyYears: number;
  deliveryDays: number;
  type: 'memory-foam' | 'hybrid' | 'innerspring' | 'latex';
}

export interface Competitor {
  id: string;
  name: string;
  logo: string;
  products: Product[];
}

// Lifetime warranty constant
const lifetime = 999;

// Mock Mattress Firm Products
export const mattressFirmProducts: Product[] = [
  {
    id: 'mf-1',
    name: 'Tempur-Pedic ProAdapt',
    brand: 'Tempur-Pedic',
    price: 3499,
    financingAPR: 0,
    financingTerm: 48,
    warrantyYears: 10,
    deliveryDays: 7,
    type: 'memory-foam'
  },
  {
    id: 'mf-2',
    name: 'Serta iComfort Hybrid',
    brand: 'Serta',
    price: 1899,
    financingAPR: 0,
    financingTerm: 36,
    warrantyYears: 10,
    deliveryDays: 5,
    type: 'hybrid'
  },
  {
    id: 'mf-3',
    name: 'Beautyrest Black Hybrid',
    brand: 'Beautyrest',
    price: 2799,
    financingAPR: 0,
    financingTerm: 48,
    warrantyYears: 10,
    deliveryDays: 7,
    type: 'hybrid'
  },
  {
    id: 'mf-4',
    name: 'Purple Plus',
    brand: 'Purple',
    price: 1599,
    financingAPR: 0,
    financingTerm: 24,
    warrantyYears: 10,
    deliveryDays: 3,
    type: 'memory-foam'
  },
  {
    id: 'mf-5',
    name: 'Nectar Premier Copper',
    brand: 'Nectar',
    price: 1299,
    financingAPR: 0,
    financingTerm: 24,
    warrantyYears: lifetime,
    deliveryDays: 3,
    type: 'memory-foam'
  }
];

// Mock Competitors
export const competitors: Competitor[] = [
  {
    id: 'carol-house',
    name: 'Carol House Furniture',
    logo: '🏠',
    products: [
      {
        id: 'ch-1',
        name: 'Sleep Essentials Hybrid',
        brand: 'Sleep Essentials',
        price: 2199,
        financingAPR: 9.99,
        financingTerm: 36,
        warrantyYears: 5,
        deliveryDays: 14,
        type: 'hybrid'
      },
      {
        id: 'ch-2',
        name: 'Classic Innerspring',
        brand: 'Sleep Essentials',
        price: 899,
        financingAPR: 14.99,
        financingTerm: 24,
        warrantyYears: 1,
        deliveryDays: 10,
        type: 'innerspring'
      }
    ]
  },
  {
    id: 'mattress-warehouse',
    name: 'Mattress Warehouse',
    logo: '🏭',
    products: [
      {
        id: 'mw-1',
        name: 'TEMPUR-ProMedium',
        brand: 'TEMPUR-Pedic',
        price: 3799,
        financingAPR: 4.99,
        financingTerm: 48,
        warrantyYears: 10,
        deliveryDays: 10,
        type: 'memory-foam'
      },
      {
        id: 'mw-2',
        name: 'Serta Perfect Sleeper',
        brand: 'Serta',
        price: 1699,
        financingAPR: 7.99,
        financingTerm: 36,
        warrantyYears: 5,
        deliveryDays: 7,
        type: 'innerspring'
      }
    ]
  },
  {
    id: 'sleep-number',
    name: 'Sleep Number',
    logo: '💤',
    products: [
      {
        id: 'sn-1',
        name: 'c4 Hybrid',
        brand: 'Sleep Number',
        price: 2299,
        financingAPR: 0,
        financingTerm: 36,
        warrantyYears: 15,
        deliveryDays: 21,
        type: 'hybrid'
      },
      {
        id: 'sn-2',
        name: 'p6 Smart Bed',
        brand: 'Sleep Number',
        price: 3499,
        financingAPR: 0,
        financingTerm: 48,
        warrantyYears: 15,
        deliveryDays: 21,
        type: 'hybrid'
      }
    ]
  },
  {
    id: 'wayfair',
    name: 'Wayfair',
    logo: '🛋️',
    products: [
      {
        id: 'wf-1',
        name: 'Allswell Hybrid',
        brand: 'Allswell',
        price: 799,
        financingAPR: 0,
        financingTerm: 12,
        warrantyYears: 10,
        deliveryDays: 5,
        type: 'hybrid'
      },
      {
        id: 'wf-2',
        name: 'Brooklyn Bedding Aurora',
        brand: 'Brooklyn Bedding',
        price: 1499,
        financingAPR: 0,
        financingTerm: 24,
        warrantyYears: 10,
        deliveryDays: 7,
        type: 'hybrid'
      }
    ]
  },
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    products: [
      {
        id: 'az-1',
        name: 'Zinus Green Tea',
        brand: 'Zinus',
        price: 349,
        financingAPR: 0,
        financingTerm: 0,
        warrantyYears: 10,
        deliveryDays: 2,
        type: 'memory-foam'
      },
      {
        id: 'az-2',
        name: 'Lucid 12" Hybrid',
        brand: 'Lucid',
        price: 599,
        financingAPR: 0,
        financingTerm: 0,
        warrantyYears: 10,
        deliveryDays: 2,
        type: 'hybrid'
      }
    ]
  }
];

export const comparisonCategories = [
  { id: 'price', label: 'Price', icon: '💰', lowerIsBetter: true },
  { id: 'financingAPR', label: 'Financing APR', icon: '💳', lowerIsBetter: true },
  { id: 'financingTerm', label: 'Financing Term (months)', icon: '📅', lowerIsBetter: false },
  { id: 'warrantyYears', label: 'Warranty (years)', icon: '🛡️', lowerIsBetter: false },
  { id: 'deliveryDays', label: 'Delivery (days)', icon: '🚚', lowerIsBetter: true },
];

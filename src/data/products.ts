export interface Model {
  id: string;
  name: string;
  sizes: string[];
}

export interface Brand {
  id: string;
  name: string;
  models: Model[];
}

export interface Competitor {
  id: string;
  name: string;
}

export interface CompetitorData {
  brand: string;
  model: string;
  size: string;
  competitors: {
    [competitorId: string]: {
      price?: number;
      financingAPR?: number;
      financingTerm?: number;
      warrantyYears?: number;
      deliveryDays?: number;
      notAvailable?: boolean;
    };
  };
}

export const brands: Brand[] = [
  {
    id: "sleepys",
    name: "Sleepy's",
    models: [
      { id: "basic-foam", name: "Basic Foam", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "basic-innerspring", name: "Basic Innerspring", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "rest-2-0-firm", name: "Rest 2.0 9.5\" Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "rest-2-0-medium", name: "Rest 9.5\" Medium", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "basic-hybrid", name: "Basic Hybrid", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-foam-firm", name: "By Sealy 8\" Mem Foam Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-foam-medium", name: "By Sealy 10\" Mem Foam Medium", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-foam-plush", name: "By Sealy 12\" Mem Foam Plush", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-spring-medium", name: "By Sealy Spring Medium 12\"", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-spring-firm", name: "By Sealy Spring Firm 12\"", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-spring-plush", name: "By Sealy Spring Plush 13\"", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-spring-ppt", name: "By Sealy Spring Prem PPT 14\"", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-hybrid-firm", name: "By Sealy Hybrid HD Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "by-sealy-hybrid-premium", name: "By Sealy Hybrid HD Premium", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "serta",
    name: "Serta",
    models: [
      { id: "ps-excellence-extra-firm", name: "PS Sleep Excellence Extra Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "ps-excellence-medium-pt", name: "PS Sleep Excellence Medium PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "beautyrest",
    name: "Beautyrest",
    models: [
      { id: "greenwood-firm", name: "Greenwood 9.5\" Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pressuresmart-firm", name: "PressureSmart 2.0 Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pressuresmart-plush", name: "PressureSmart 2.0 Plush", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pressuresmart-plush-pt", name: "PressureSmart 2.0 Plush PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pressuresmart-ex-firm", name: "PressureSmart 2.0 Ex Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pressuresmart-lux-plush-pt", name: "PressureSmart 2.0 Lux PLSH PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pressuresmart-lux-firm-pt", name: "PressureSmart 2.0 Lux Firm PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pressuresmart-hybrid-firm", name: "PressureSmart 2.0 Hybrid Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pressuresmart-hybrid-medium", name: "PressureSmart 2.0 Hybrid Med", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "beautyrest-black",
    name: "Beautyrest Black",
    models: [
      { id: "series-three-medium", name: "Series Three Medium", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "series-three-firm", name: "Series Three Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "series-three-plush-ppt", name: "Series Three Plush Pillow Top", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "series-four-medium-summit", name: "Series Four Medium Summit PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "black-hybrid-cx-med", name: "Black Hybrid CX-Class 13.5\" Med", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "black-hybrid-cx-plush", name: "Black Hybrid CX-Class 15\" Plush", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "stearns-foster",
    name: "Stearns & Foster",
    models: [
      { id: "studio-medium", name: "Studio 14\" Med", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "estate-firm", name: "Estate 14.5\" Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "estate-plush", name: "Estate 14.5\" Plush", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "estate-firm-euro-pt", name: "Estate 15\" Firm Euro PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "estate-plush-euro-pt", name: "Estate 15\" Plush Euro PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "lux-estate-medium-euro-pt", name: "Lux Estate 16\" Med Euro PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "lux-estate-elite-medium-pt", name: "Lux Estate Elite Med PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "reserve-plush-euro-pt", name: "Reserve 17\" Plush Euro PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "reserve-firm-euro-pt", name: "Reserve 17\" Firm Euro PT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "tempur-pedic",
    name: "Tempur-Pedic",
    models: [
      { id: "adapt-medium", name: "Adapt 11\" Med", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "adapt-medium-hybrid", name: "Adapt 11\" Med Hybrid", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "proadapt-firm", name: "ProAdapt 12\" Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "proadapt-medium", name: "ProAdapt 12\" Med", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "proadapt-medium-hybrid", name: "ProAdapt 12\" Med Hybrid", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "proadapt-soft", name: "ProAdapt 12\" Soft", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "luxeadapt-firm", name: "LuxeAdapt 13\" Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "luxeadapt-medium-hybrid", name: "LuxeAdapt 13\" Med Hybrid", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "luxeadapt-soft", name: "LuxeAdapt 13\" Soft", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "probreeze-medium", name: "ProBreeze 12\" Med", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "probreeze-medium-hybrid", name: "ProBreeze 12\" Med Hybrid 2.0", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "luxebreeze-firm", name: "LuxeBreeze 13\" Firm 2.0", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "luxebreeze-soft", name: "LuxeBreeze 13\" Soft 2.0", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "luxebreeze-medium-hybrid", name: "LuxeBreeze 13\" Med Hybrid", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "sealy-pp-innerspring",
    name: "Sealy PP Innerspring",
    models: [
      { id: "essentials-sudley-firm", name: "Essentials Sudley 8.5\" Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "sealy-frisco-medium-et", name: "Sealy Frisco 2.0 Medium ET", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "sealy-frisco-medium-et-1", name: "Sealy Frisco 1.0 Medium ET", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "sealy-ashurst-medium", name: "Sealy Ashurst II Med", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pp-plus-norman-medium", name: "PP Plus Norman II Medium ET", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pp-pro-lacey-medium", name: "PP Pro Lacey II Medium ET", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pp-elite-albany-firm", name: "PP Elite Albany II Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pp-elite-brenham-medium", name: "PP Elite Brenham II Medium", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pp-elite-brenham-medium-ept", name: "PP Elite Brenham II Med EPT", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "sealy-pp-hybrid",
    name: "Sealy PP Hybrid",
    models: [
      { id: "plus-hybrid-norman-medium", name: "Plus Hybrid Norman II Medium", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "pro-hybrid-lacey-firm", name: "Pro Hybrid Lacey II Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "elite-hybrid-albany-medium", name: "Elite Hybrid Albany II Medium", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "elite-hybrid-high-point-firm", name: "Elite Hybrid High Point II Firm", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "elite-hybrid-high-point-medium", name: "Elite Hybrid High Point II Medium", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "elite-hybrid-high-point-soft", name: "Elite Hybrid High Point II Soft", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "purple",
    name: "Purple",
    models: [
      { id: "purple-original", name: "Purple Original", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "purple-plus", name: "Purple Plus", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "restore-cooltouch", name: "Restore Cooltouch", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "restore-plus-cooltouch", name: "Restore Plus Cooltouch", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "restore-premier-cooltouch", name: "Restore Premier Cooltouch", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "rejuvenate", name: "Rejuvenate", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "rejuvenate-plus", name: "Rejuvenate Plus", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "rejuvenate-premier", name: "Rejuvenate Premier", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  },
  {
    id: "nectar",
    name: "Nectar",
    models: [
      { id: "classic-firm", name: "Classic 12\" Firm Mem Foam", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "premier-medium", name: "Premier 13\" Med Mem Foam", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "luxe-medium", name: "Luxe 14\" Med Mem Foam", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] },
      { id: "luxe-medium-hybrid", name: "Luxe 14\" Med Hybrid", sizes: ["King", "Queen", "Full", "Twin XL", "Twin"] }
    ]
  }
];

export const competitors = [
  { id: "carol-house", name: "Carol House Furniture" },
  { id: "mattress-warehouse", name: "Mattress Warehouse" },
  { id: "sleep-number", name: "Sleep Number" },
  { id: "wayfair", name: "Wayfair" },
  { id: "amazon", name: "Amazon" }
];

// Mock competitor data - will be replaced by daily price updates
export const competitorData: { [key: string]: any } = {};

export let lastUpdated: Date | null = null;

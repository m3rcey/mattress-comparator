import productsData from './products.json';

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

export const brands: Brand[] = productsData.brands;

export const competitors = [
  { id: "carol-house", name: "Carol House Furniture" },
  { id: "muellers", name: "Mueller's Furniture" },
  { id: "wayfair", name: "Wayfair" },
  { id: "jcpenney", name: "JCPenney" }
];

// Mock competitor data - will be replaced by daily price updates
export const competitorData: { [key: string]: any } = {};

export let lastUpdated: Date | null = null;

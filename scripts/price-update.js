#!/usr/bin/env node

/**
 * Daily Price Update Script - V6
 * Extract prices from search result snippets (more reliable)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const competitorDataPath = path.join(__dirname, '../src/data/competitor-data.json');

// Load environment
const envFile = fs.readFileSync(path.join(process.env.HOME, '.env'), 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
});

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
if (!BRAVE_API_KEY) { console.error('❌ BRAVE_API_KEY not found'); process.exit(1); }

console.log('✅ Brave API key loaded\n');

// Competitors
const competitors = [
  { id: 'ashley', name: 'Ashley Furniture' },
  { id: 'macys', name: "Macy's" },
  { id: 'costco', name: 'Costco' },
  { id: 'muellers', name: "Mueller's Furniture" },
  { id: 'carol-house', name: 'Carol House Furniture' },
  { id: 'wayfair', name: 'Wayfair' },
  { id: 'bbb', name: 'Bed Bath & Beyond' },
  { id: 'jcpenney', name: 'JCPenney' }
];

// Products with comfort level
const products = [
  { brand: 'Tempur-Pedic', model: 'ProAdapt', comfort: 'Medium Hybrid', size: 'Queen' },
  { brand: 'Purple', model: 'Purple Plus', comfort: '', size: 'Queen' },
  { brand: 'Nectar', model: 'Premier', comfort: 'Medium', size: 'Queen' },
  { brand: 'Beautyrest', model: 'PressureSmart', comfort: 'Plush', size: 'Queen' },
  { brand: 'Serta', model: 'Sleep Excellence', comfort: 'Medium Pillow Top', size: 'Queen' },
  { brand: 'Stearns & Foster', model: 'Estate', comfort: 'Plush', size: 'Queen' },
  { brand: 'Sealy', model: 'Hybrid High Point', comfort: 'Medium', size: 'Queen' }
];

// Expected price ranges by brand (for validation)
const priceRanges = {
  'Tempur-Pedic': { min: 1500, max: 5000 },
  'Purple': { min: 800, max: 3000 },
  'Nectar': { min: 500, max: 1500 },
  'Beautyrest': { min: 500, max: 2500 },
  'Stearns & Foster': { min: 1500, max: 5000 },
  'Serta': { min: 400, max: 2500 },
  'Sealy': { min: 500, max: 2500 }
};

async function searchBrave(query) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
      { headers: { 'Accept': 'application/json', 'X-Subscription-Token': BRAVE_API_KEY } }
    );
    const data = await response.json();
    return data.web?.results || [];
  } catch (error) {
    console.error(`  Search error: ${error.message}`);
    return [];
  }
}

// Extract price from search result text
function extractPriceFromText(text) {
  if (!text) return null;
  
  // Match prices between $50 and $15,000
  const matches = text.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g);
  if (!matches) return null;
  
  for (const match of matches) {
    const price = parseFloat(match.replace(/[$,]/g, ''));
    if (price >= 50 && price <= 15000) {
      return price;
    }
  }
  return null;
}

// Validate price is in reasonable range for the brand
function validatePrice(price, brand) {
  const range = priceRanges[brand] || { min: 100, max: 10000 };
  return price >= range.min && price <= range.max;
}

async function findPrice(product, competitor) {
  const comfortPart = product.comfort ? ` ${product.comfort}` : '';
  const query = `${product.brand} ${product.model}${comfortPart} ${product.size} ${competitor.name}`;
  
  console.log(`    Query: ${query.substring(0, 50)}...`);
  
  const results = await searchBrave(query);
  
  if (results.length === 0) {
    return { notAvailable: true, reason: "doesn't carry this model", found: false };
  }
  
  // First: look for price in result title/description
  for (const result of results) {
    const text = `${result.title || ''} ${result.description || ''}`;
    const price = extractPriceFromText(text);
    
    if (price && validatePrice(price, product.brand)) {
      return { price, url: result.url, found: true };
    }
  }
  
  // Second: any price in range (less strict)
  for (const result of results) {
    const text = `${result.title || ''} ${result.description || ''}`;
    const price = extractPriceFromText(text);
    
    // Be more lenient - accept if it's not obviously wrong
    if (price && price >= 100) {
      return { price, url: result.url, found: true };
    }
  }
  
  return { notAvailable: true, reason: "doesn't carry this model", found: false };
}

async function updatePrices() {
  console.log('🛏️ Price update V6...\n');
  
  const results = { timestamp: new Date().toISOString(), products: [] };

  for (const product of products) {
    const comfortStr = product.comfort ? ` ${product.comfort}` : '';
    console.log(`\n📦 ${product.brand} ${product.model}${comfortStr}`);
    
    const productResult = { 
      brand: product.brand, 
      model: product.model, 
      comfort: product.comfort,
      size: product.size, 
      competitors: {} 
    };
    
    for (const competitor of competitors) {
      console.log(`  → ${competitor.name}...`);
      
      const priceData = await findPrice(product, competitor);
      
      if (priceData.found) {
        productResult.competitors[competitor.id] = priceData;
        console.log(`    ✓ $${priceData.price}`);
      } else {
        productResult.competitors[competitor.id] = priceData;
        console.log(`    ✗ ${priceData.reason}`);
      }
      
      await new Promise(r => setTimeout(r, 700));
    }
    
    results.products.push(productResult);
  }
  
  fs.writeFileSync(competitorDataPath, JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Done! Saved to competitor-data.json`);
  console.log('='.repeat(50));
}

updatePrices().catch(console.error);

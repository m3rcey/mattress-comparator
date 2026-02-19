#!/usr/bin/env node

/**
 * Daily Price Update Script - V3
 * Relaxed validation to find more prices
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

const competitors = [
  { id: 'carol-house', name: 'Carol House Furniture', domains: ['carolhouse.com'] },
  { id: 'mattress-warehouse', name: 'Mattress Warehouse', domains: ['mattresswarehouse.com', 'sleepoutfitters.com'] },
  { id: 'sleep-number', name: 'Sleep Number', domains: ['sleepnumber.com'] },
  { id: 'wayfair', name: 'Wayfair', domains: ['wayfair.com'] },
  { id: 'amazon', name: 'Amazon', domains: ['amazon.com'] }
];

// Expanded price ranges
const priceRanges = {
  'Tempur-Pedic': { min: 500, max: 10000 },
  'Purple': { min: 300, max: 5000 },
  'Nectar': { min: 200, max: 2500 },
  'Beautyrest': { min: 200, max: 4000 },
  'Beautyrest Black': { min: 500, max: 6000 },
  'Stearns & Foster': { min: 500, max: 8000 },
  'Serta': { min: 200, max: 3500 },
  "Sleepy's": { min: 100, max: 2000 },
  'Sealy': { min: 150, max: 3500 }
};

const products = [
  { brand: 'Tempur-Pedic', model: 'ProAdapt', size: 'Queen', keywords: ['Tempur-Pedic ProAdapt Queen'] },
  { brand: 'Purple', model: 'Purple Plus', size: 'Queen', keywords: ['Purple Plus Queen'] },
  { brand: 'Nectar', model: 'Premier', size: 'Queen', keywords: ['Nectar Premier Queen'] },
  { brand: 'Beautyrest', model: 'PressureSmart', size: 'Queen', keywords: ['Beautyrest PressureSmart Queen'] },
  { brand: 'Serta', model: 'Sleep Excellence', size: 'Queen', keywords: ['Serta Sleep Excellence Queen'] },
  { brand: 'Stearns & Foster', model: 'Estate', size: 'Queen', keywords: ['Stearns & Foster Estate Queen'] },
  { brand: "Sleepy's", model: 'Rest', size: 'Queen', keywords: ["Sleepy's Rest Queen"] },
  { brand: 'Sealy', model: 'Hybrid High Point', size: 'Queen', keywords: ['Sealy Hybrid High Point Queen'] }
];

async function searchBrave(query) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=15`,
      { headers: { 'Accept': 'application/json', 'X-Subscription-Token': BRAVE_API_KEY } }
    );
    const data = await response.json();
    return data.web?.results || [];
  } catch (error) {
    console.error(`  Search error: ${error.message}`);
    return [];
  }
}

function extractPrice(text) {
  if (!text) return null;
  const matches = text.match(/\$([\d,]+\.?\d*)/g);
  if (!matches) return null;
  for (const match of matches) {
    const price = parseFloat(match.replace(/[$,]/g, ''));
    if (price >= 50 && price <= 15000) return price;
  }
  return null;
}

function findPriceForCompetitor(results, competitor, brand) {
  const range = priceRanges[brand] || { min: 100, max: 10000 };
  
  // First: look for product page URLs with prices
  for (const result of results) {
    const url = result.url?.toLowerCase() || '';
    const isCompetitor = competitor.domains.some(d => url.includes(d));
    
    if (isCompetitor) {
      // Check title and description for prices
      const price = extractPrice(result.title + ' ' + result.description);
      if (price && price >= range.min && price <= range.max) {
        return { price, url: result.url };
      }
    }
  }
  
  // Second: any price in range from competitor
  for (const result of results) {
    const url = result.url?.toLowerCase() || '';
    const isCompetitor = competitor.domains.some(d => url.includes(d));
    
    if (isCompetitor) {
      const price = extractPrice(result.title + ' ' + result.description);
      if (price && price >= range.min && price <= range.max) {
        return { price, url: result.url };
      }
    }
  }
  
  return null;
}

async function updatePrices() {
  console.log('🛏️ Price update V3...\n');
  
  const results = { timestamp: new Date().toISOString(), products: [] };

  for (const product of products) {
    console.log(`📦 ${product.brand} ${product.model}`);
    
    const productResult = { brand: product.brand, model: product.model, size: product.size, competitors: {} };
    
    for (const competitor of competitors) {
      const query = product.keywords[0] + ' ' + competitor.name;
      console.log(`  → ${competitor.name}...`);
      
      const searchResults = await searchBrave(query);
      const priceData = findPriceForCompetitor(searchResults, competitor, product.brand);
      
      if (priceData) {
        productResult.competitors[competitor.id] = { price: priceData.price, url: priceData.url, found: true };
        console.log(`    ✓ $${priceData.price}`);
      } else {
        // Check brand availability
        const brandSearch = await searchBrave(`${product.brand} ${competitor.name}`);
        const carriesBrand = brandSearch.some(r => 
          competitor.domains.some(d => r.url?.toLowerCase().includes(d))
        );
        
        productResult.competitors[competitor.id] = {
          notAvailable: !carriesBrand,
          reason: carriesBrand ? "model not found" : "doesn't carry this brand",
          found: false
        };
        console.log(`    ✗ ${carriesBrand ? 'Model not found' : "Doesn't carry brand"}`);
      }
      
      await new Promise(r => setTimeout(r, 600));
    }
    
    results.products.push(productResult);
  }
  
  fs.writeFileSync(competitorDataPath, JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Done! Saved to competitor-data.json`);
  console.log('='.repeat(50));
}

updatePrices().catch(console.error);

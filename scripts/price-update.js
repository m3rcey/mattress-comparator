#!/usr/bin/env node

/**
 * Daily Price Update Script - Improved Version
 * Uses Brave Search API with better price validation
 * 
 * Usage: node scripts/price-update.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const competitorDataPath = path.join(__dirname, '../src/data/competitor-data.json');

// Load environment variables from ~/.env
const envFile = fs.readFileSync(path.join(process.env.HOME, '.env'), 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2];
  }
});

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

if (!BRAVE_API_KEY) {
  console.error('❌ BRAVE_API_KEY not found');
  process.exit(1);
}

console.log('✅ Brave API key loaded\n');

// Competitors to search
const competitors = [
  { id: 'carol-house', name: 'Carol House Furniture', domains: ['carolhouse.com'] },
  { id: 'mattress-warehouse', name: 'Mattress Warehouse', domains: ['mattresswarehouse.com'] },
  { id: 'sleep-number', name: 'Sleep Number', domains: ['sleepnumber.com'] },
  { id: 'wayfair', name: 'Wayfair', domains: ['wayfair.com'] },
  { id: 'amazon', name: 'Amazon', domains: ['amazon.com'] }
];

// Expected price ranges by brand tier (for validation)
const priceRanges = {
  'Tempur-Pedic': { min: 1500, max: 8000 },
  'Purple': { min: 800, max: 3500 },
  'Nectar': { min: 500, max: 1500 },
  'Beautyrest': { min: 500, max: 3000 },
  'Beautyrest Black': { min: 1500, max: 5000 },
  'Stearns & Foster': { min: 1500, max: 6000 },
  'Serta': { min: 400, max: 2500 },
  "Sleepy's": { min: 200, max: 1500 },
  'Sealy': { min: 300, max: 2500 }
};

// Products to search
const products = [
  { brand: 'Tempur-Pedic', model: 'ProAdapt', size: 'Queen', keywords: ['Tempur-Pedic ProAdapt Queen mattress'] },
  { brand: 'Purple', model: 'Purple Plus', size: 'Queen', keywords: ['Purple Plus Queen mattress'] },
  { brand: 'Nectar', model: 'Premier', size: 'Queen', keywords: ['Nectar Premier Queen mattress'] },
  { brand: 'Beautyrest', model: 'PressureSmart', size: 'Queen', keywords: ['Beautyrest PressureSmart Queen mattress'] },
  { brand: 'Serta', model: 'Sleep Excellence', size: 'Queen', keywords: ['Serta Sleep Excellence Queen mattress'] },
  { brand: 'Stearns & Foster', model: 'Estate', size: 'Queen', keywords: ['Stearns & Foster Estate Queen mattress'] },
  { brand: "Sleepy's", model: 'Rest', size: 'Queen', keywords: ["Sleepy's Rest Queen mattress"] },
  { brand: 'Sealy', model: 'Hybrid High Point', size: 'Queen', keywords: ['Sealy Hybrid High Point Queen mattress'] }
];

/**
 * Search Brave API
 */
async function searchBrave(query) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.web?.results || [];
  } catch (error) {
    console.error(`  Search error: ${error.message}`);
    return [];
  }
}

/**
 * Extract valid mattress prices from text
 */
function extractPrice(text) {
  if (!text) return null;
  
  // Match prices between $100 and $10,000 (reasonable mattress range)
  const matches = text.match(/\$([\d,]+\.?\d*)/g);
  if (!matches) return null;
  
  for (const match of matches) {
    const price = parseFloat(match.replace(/[$,]/g, ''));
    if (price >= 100 && price <= 10000) {
      return price;
    }
  }
  return null;
}

/**
 * Check if URL is a product page (not search, category, or homepage)
 */
function isProductPage(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  
  // Exclude these patterns
  const exclude = ['/search', '/keyword', '/category', '/collection', '/brand', 
                   '/results', '?keyword', '?search', '?q=', '/shop'];
  
  if (exclude.some(p => u.includes(p))) return false;
  
  // Include these patterns (product pages)
  const include = ['/product/', '/p/', '/mattress/', '-mattress', '/bed/'];
  if (include.some(p => u.includes(p))) return true;
  
  // If it has many slashes, likely a product page
  return (u.match(/\//g) || []).length >= 3;
}

/**
 * Find best price from results for a specific competitor
 */
function findPriceForCompetitor(results, competitor, brand) {
  const range = priceRanges[brand] || { min: 200, max: 10000 };
  
  for (const result of results) {
    const url = result.url?.toLowerCase() || '';
    const title = result.title || '';
    const desc = result.description || '';
    
    // Check if result is from this competitor
    const isCompetitor = competitor.domains.some(d => url.includes(d));
    
    if (isCompetitor) {
      // Try to extract price from description first (usually more accurate)
      let price = extractPrice(desc) || extractPrice(title);
      
      // Validate price is in reasonable range
      if (price && price >= range.min && price <= range.max) {
        return { price, url, source: 'description' };
      }
    }
  }
  
  // Second pass: look for any price in range from competitor domain
  for (const result of results) {
    const url = result.url?.toLowerCase() || '';
    const isCompetitor = competitor.domains.some(d => url.includes(d));
    
    if (isCompetitor) {
      const price = extractPrice(result.description) || extractPrice(result.title);
      if (price && price >= range.min && price <= range.max) {
        return { price, url, source: 'second-pass' };
      }
    }
  }
  
  return null;
}

/**
 * Main update function
 */
async function updatePrices() {
  console.log('🛏️ Starting daily price update...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    products: []
  };

  for (const product of products) {
    console.log(`\n📦 ${product.brand} ${product.model} (${product.size})`);
    
    const productResult = {
      brand: product.brand,
      model: product.model,
      size: product.size,
      competitors: {}
    };
    
    for (const competitor of competitors) {
      const query = product.keywords[0] + ' ' + competitor.name;
      console.log(`  → ${competitor.name}...`);
      
      const searchResults = await searchBrave(query);
      
      // Find price from this competitor
      const priceData = findPriceForCompetitor(searchResults, competitor, product.brand);
      
      if (priceData) {
        productResult.competitors[competitor.id] = {
          price: priceData.price,
          url: priceData.url,
          found: true
        };
        console.log(`    ✓ $${priceData.price}`);
      } else {
        // Check if competitor carries this brand at all
        const brandSearch = await searchBrave(`${product.brand} ${competitor.name} mattress`);
        const carriesBrand = brandSearch.some(r => 
          competitor.domains.some(d => r.url?.toLowerCase().includes(d))
        );
        
        productResult.competitors[competitor.id] = {
          notAvailable: !carriesBrand,
          reason: carriesBrand ? "model not found" : "doesn't carry this brand",
          found: false
        };
        console.log(`    ✗ ${carriesBrand ? 'Model not found' : "Doesn't carry this brand"}`);
      }
      
      await new Promise(r => setTimeout(r, 800));
    }
    
    results.products.push(productResult);
  }
  
  // Save results
  fs.writeFileSync(competitorDataPath, JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Price update complete!`);
  console.log(`   Saved to: ${competitorDataPath}`);
  console.log('='.repeat(50));
  
  return results;
}

updatePrices().catch(console.error);

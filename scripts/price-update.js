#!/usr/bin/env node

/**
 * Daily Price Update Script - V4
 * Site: search + web_fetch fallback
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

// Updated competitors with site: operators
const competitors = [
  { id: 'ashley', name: 'Ashley Furniture', domain: 'ashleyfurniture.com' },
  { id: 'macys', name: "Macy's", domain: 'macys.com' },
  { id: 'costco', name: 'Costco', domain: 'costco.com' },
  { id: 'muellers', name: "Mueller's Furniture", domain: 'muellersfurniture.com' },
  { id: 'carol-house', name: 'Carol House Furniture', domain: 'carolhouse.com' },
  { id: 'wayfair', name: 'Wayfair', domain: 'wayfair.com' },
  { id: 'bbb', name: 'Bed Bath & Beyond', domain: 'bedbathandbeyond.com' },
  { id: 'jcpenney', name: 'JCPenney', domain: 'jcpenney.com' }
];

// Products to search (removed Sleepy's)
const products = [
  { brand: 'Tempur-Pedic', model: 'ProAdapt', size: 'Queen', keywords: ['Tempur-Pedic ProAdapt'] },
  { brand: 'Purple', model: 'Purple Plus', size: 'Queen', keywords: ['Purple Plus'] },
  { brand: 'Nectar', model: 'Premier', size: 'Queen', keywords: ['Nectar Premier'] },
  { brand: 'Beautyrest', model: 'PressureSmart', size: 'Queen', keywords: ['Beautyrest PressureSmart'] },
  { brand: 'Serta', model: 'Sleep Excellence', size: 'Queen', keywords: ['Serta Sleep Excellence'] },
  { brand: 'Stearns & Foster', model: 'Estate', size: 'Queen', keywords: ['Stearns & Foster Estate'] },
  { brand: 'Sealy', model: 'Hybrid High Point', size: 'Queen', keywords: ['Sealy Hybrid High Point'] }
];

const priceRanges = {
  'Tempur-Pedic': { min: 500, max: 10000 },
  'Purple': { min: 300, max: 5000 },
  'Nectar': { min: 200, max: 2500 },
  'Beautyrest': { min: 200, max: 4000 },
  'Beautyrest Black': { min: 500, max: 6000 },
  'Stearns & Foster': { min: 500, max: 8000 },
  'Serta': { min: 200, max: 3500 },
  'Sealy': { min: 150, max: 3500 }
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

async function fetchPriceFromPage(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await response.text();
    
    // Look for price patterns
    const priceMatch = html.match(/\$([\d,]+\.?\d*)/);
    if (priceMatch) {
      return parseFloat(priceMatch[1].replace(/,/g, ''));
    }
  } catch (error) {
    // Ignore fetch errors
  }
  return null;
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

function isProductPage(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  const exclude = ['/search', '/keyword', '/category', '/collection', '/brand/', '/results', '?keyword', '?search', '?q=', '/shop', '/all-products'];
  if (exclude.some(p => u.includes(p))) return false;
  return true;
}

async function findPrice(brand, model, size, competitor) {
  const range = priceRanges[brand] || { min: 100, max: 10000 };
  
  // Build site: search query
  const query = `${brand} "${model}" ${size} mattress buy price site:${competitor.domain}`;
  console.log(`    Query: ${query.substring(0, 60)}...`);
  
  const results = await searchBrave(query);
  
  if (results.length === 0) {
    return { notAvailable: true, reason: "doesn't carry this model", found: false };
  }
  
  // First: look for product pages
  for (const result of results) {
    const url = result.url?.toLowerCase() || '';
    if (!url.includes(competitor.domain)) continue;
    
    // Check if it's a product page
    if (isProductPage(url)) {
      const price = extractPrice(result.title + ' ' + result.description);
      if (price && price >= range.min && price <= range.max) {
        return { price, url: result.url, found: true };
      }
    }
  }
  
  // Second: try to fetch top result and scrape price
  const topResult = results[0];
  if (topResult?.url?.includes(competitor.domain)) {
    const scrapedPrice = await fetchPriceFromPage(topResult.url);
    if (scrapedPrice && scrapedPrice >= range.min && scrapedPrice <= range.max) {
      return { price: scrapedPrice, url: topResult.url, found: true };
    }
  }
  
  // Third: any price in range from competitor
  for (const result of results) {
    const url = result.url?.toLowerCase() || '';
    if (!url.includes(competitor.domain)) continue;
    
    const price = extractPrice(result.title + ' ' + result.description);
    if (price && price >= range.min && price <= range.max) {
      return { price, url: result.url, found: true };
    }
  }
  
  return { notAvailable: true, reason: "doesn't carry this model", found: false };
}

async function updatePrices() {
  console.log('🛏️ Price update V4 (site: search)...\n');
  
  const results = { timestamp: new Date().toISOString(), products: [] };

  for (const product of products) {
    console.log(`\n📦 ${product.brand} ${product.model}`);
    
    const productResult = { brand: product.brand, model: product.model, size: product.size, competitors: {} };
    
    for (const competitor of competitors) {
      console.log(`  → ${competitor.name}...`);
      
      const priceData = await findPrice(product.brand, product.model, product.size, competitor);
      
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

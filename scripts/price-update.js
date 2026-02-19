#!/usr/bin/env node

/**
 * Daily Price Update Script
 * Uses OpenClaw's built-in web_search (Brave API)
 * 
 * Run: node scripts/price-update.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const competitorDataPath = path.join(__dirname, '../src/data/competitor-data.json');

// Competitors to search
const competitors = [
  { id: 'carol-house', name: 'Carol House Furniture' },
  { id: 'mattress-warehouse', name: 'Mattress Warehouse' },
  { id: 'sleep-number', name: 'Sleep Number' },
  { id: 'wayfair', name: 'Wayfair' },
  { id: 'amazon', name: 'Amazon' }
];

// Products to search (simplified list - top sellers)
const products = [
  { brand: 'Tempur-Pedic', model: 'ProAdapt 12" Med', size: 'Queen' },
  { brand: 'Purple', model: 'Purple Plus', size: 'Queen' },
  { brand: 'Nectar', model: 'Premier 13" Med', size: 'Queen' },
  { brand: 'Beautyrest', model: 'PressureSmart 2.0 Plush', size: 'Queen' },
  { brand: 'Serta', model: 'PS Sleep Excellence Medium PT', size: 'Queen' },
  { brand: 'Stearns & Foster', model: 'Estate 14.5" Plush', size: 'Queen' },
  { brand: 'Sleepy\'s', model: 'Rest 9.5" Medium', size: 'Queen' },
  { brand: 'Sealy PP Hybrid', model: 'Elite Hybrid High Point II Medium', size: 'Queen' }
];

/**
 * Extract price from text using regex
 */
function extractPrice(text) {
  if (!text) return null;
  const priceMatch = text.match(/\$[\d,]+(\.\d{2})?/);
  if (priceMatch) {
    return parseFloat(priceMatch[0].replace(/[$,]/g, ''));
  }
  return null;
}

/**
 * Parse Brave search results from OpenClaw web_search output
 * This script is designed to be run by the agent which has web_search available
 */

// This version is meant to be run by the agent with web_search tool
export async function runPriceUpdate() {
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
      // Note: This would be executed by the agent with web_search
      const query = `${product.brand} ${product.model} ${product.size} ${competitor.name} price`;
      console.log(`  Searching: ${competitor.name}...`);
      
      // Placeholder - actual search happens via web_search tool
      productResult.competitors[competitor.id] = {
        pending: true,
        query
      };
    }
    
    results.products.push(productResult);
  }
  
  // Save placeholder data
  fs.writeFileSync(competitorDataPath, JSON.stringify(results, null, 2));
  console.log('\n✅ Price update script prepared!');
  console.log(`   Saved to: ${competitorDataPath}`);
  console.log('\n📝 Note: Run web_search manually for each product to get actual prices');
}

// Export for use by agent
export default { runPriceUpdate };

// Run if called directly
if (import.meta.url === process.argv[1]) {
  runPriceUpdate().catch(console.error);
}

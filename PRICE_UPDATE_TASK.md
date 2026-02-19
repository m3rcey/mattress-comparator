# Mattress Price Update - Agent Task

## Task: Daily Competitor Price Research

**Time:** 6:00 AM CT daily

**Goal:** Update competitor prices in `src/data/competitor-data.json`

## Products to Research (Priority List)

Search each product + competitor combination for current price:

### 1. Tempur-Pedic ProAdapt 12" Med Queen
- Search: "Tempur-Pedic ProAdapt 12 inch Medium Queen price"
- Competitors: Carol House Furniture, Mattress Warehouse, Sleep Number, Wayfair, Amazon

### 2. Purple Plus Queen
- Search: "Purple Plus mattress Queen price"
- [Competitors]

### 3. Nectar Premier 13" Med Queen
- Search: "Nectar Premier 13 inch Medium Queen price"
- [Competitors]

### 4. Beautyrest PressureSmart 2.0 Plush Queen
- Search: "Beautyrest PressureSmart 2.0 Plush Queen price"
- [Competitors]

### 5. Serta PS Sleep Excellence Medium PT Queen
- Search: "Serta Sleep Excellence Medium Pillow Top Queen price"
- [Competitors]

## Process

1. For each product, search each competitor
2. Extract the price from search results
3. Update `competitor-data.json` with new prices
4. Include "not found" if competitor doesn't carry it
5. Note the timestamp of update

## Example Search Queries

```
Tempur-Pedic ProAdapt Queen price Carol House Furniture
Purple Plus Queen price Mattress Warehouse
Nectar Premier Queen price Wayfair
```

## Output Format

Update `competitor-data.json` with:
```json
{
  "timestamp": "2026-02-19T06:00:00Z",
  "products": [
    {
      "brand": "Tempur-Pedic",
      "model": "ProAdapt 12\" Med",
      "size": "Queen",
      "competitors": {
        "carol-house": { "price": 2499, "found": true },
        "mattress-warehouse": { "price": 2299, "found": true },
        "sleep-number": { "notAvailable": true },
        "wayfair": { "price": 2199, "found": true },
        "amazon": { "price": 2399, "found": true }
      }
    }
  ]
}
```

## Notes

- Use web_search with count=5 to get multiple results
- Prioritize official retailer websites
- If no price found, mark as "notAvailable": true
- Commit changes after completing all updates

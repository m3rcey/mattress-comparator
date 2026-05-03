import json

# Load current data
with open('src/data/products.json', 'r') as f:
    products = json.load(f)
with open('src/data/competitor-data.json', 'r') as f:
    comp = json.load(f)

no_comp = {
    "ashley": {"notAvailable": True, "reason": "Doesn't carry this size", "found": False},
    "macys": {"notAvailable": True, "reason": "Doesn't carry this size", "found": False},
    "costco": {"notAvailable": True, "reason": "Doesn't carry this size", "found": False},
    "muellers": {"notAvailable": True, "reason": "Doesn't carry this size", "found": False},
    "carol-house": {"notAvailable": True, "reason": "Doesn't carry this size", "found": False},
    "wayfair": {"notAvailable": True, "reason": "Doesn't carry this size", "found": False},
    "jcpenney": {"notAvailable": True, "reason": "Doesn't carry this size", "found": False},
}

new_models = [
    {
        "brand_sheet": "Purple", "brand_id": "purple",
        "model_name": "Rejuvenate Royale Monarch", "model_id": "rejuvenate-royale-monarch",
        "sizes": {
            "Twin XL": {"mfPrice": 7499, "mfSalePrice": 6999},
            "Queen": {"mfPrice": 7999, "mfSalePrice": 7499},
            "King": {"mfPrice": 9499, "mfSalePrice": 7999},
            "Cal King": {"mfPrice": 9499, "mfSalePrice": 7999},
        }
    },
    {
        "brand_sheet": "Purple", "brand_id": "purple",
        "model_name": "Rejuvenate Royale Crown", "model_id": "rejuvenate-royale-crown",
        "sizes": {
            "Twin XL": {"mfPrice": 8499, "mfSalePrice": 7999},
            "Queen": {"mfPrice": 8999, "mfSalePrice": 8499},
            "King": {"mfPrice": 10499, "mfSalePrice": 8999},
            "Cal King": {"mfPrice": 10499, "mfSalePrice": 8999},
        }
    },
    {
        "brand_sheet": "Tempur-Pedic", "brand_id": "tempur-pedic",
        "model_name": "LuxeAdapt 2.0 13\" Med Hybrid", "model_id": "luxeadapt-2-0-13-med-hybrid",
        "sizes": {
            "Twin": {"mfPrice": 4199}, "Twin XL": {"mfPrice": 4199},
            "Queen": {"mfPrice": 4699},
            "King": {"mfPrice": 5399}, "Cal King": {"mfPrice": 5399},
            "Split King": {"mfPrice": 8398},
        }
    },
    {
        "brand_sheet": "Stearns & Foster", "brand_id": "stearns-and-foster",
        "model_name": "Reserve 17\" Firm Euro PT", "model_id": "reserve-17-firm-euro-pt",
        "sizes": {
            "Twin XL": {"mfPrice": 5399}, "Queen": {"mfPrice": 5499},
            "King": {"mfPrice": 6099}, "Cal King": {"mfPrice": 6099},
        }
    },
    {
        "brand_sheet": "Stearns & Foster", "brand_id": "stearns-and-foster",
        "model_name": "Reserve 17\" Plush Euro PT", "model_id": "reserve-17-plush-euro-pt",
        "sizes": {
            "Twin XL": {"mfPrice": 5399}, "Queen": {"mfPrice": 5499},
            "King": {"mfPrice": 6099}, "Cal King": {"mfPrice": 6099},
        }
    },
    {
        "brand_sheet": "Stearns & Foster", "brand_id": "stearns-and-foster",
        "model_name": "Lux Estate 16\" Med Euro PT", "model_id": "lux-estate-16-med-euro-pt",
        "sizes": {
            "Twin XL": {"mfPrice": 3699}, "Queen": {"mfPrice": 3799},
            "King": {"mfPrice": 4399}, "Cal King": {"mfPrice": 4399},
        }
    },
    {
        "brand_sheet": "Stearns & Foster", "brand_id": "stearns-and-foster",
        "model_name": "Estate 15\" Firm Euro PT", "model_id": "estate-15-firm-euro-pt",
        "sizes": {
            "Twin XL": {"mfPrice": 2499}, "Full": {"mfPrice": 2549},
            "Queen": {"mfPrice": 2599},
            "King": {"mfPrice": 3199}, "Cal King": {"mfPrice": 3199},
        }
    },
    {
        "brand_sheet": "BeautyRest Black", "brand_id": "beautyrest-black",
        "model_name": "Series Three 16.75\" Plush PT", "model_id": "series-three-16-75-plush-pt",
        "sizes": {
            "Twin XL": {"mfPrice": 3649}, "Full": {"mfPrice": 3929},
            "Queen": {"mfPrice": 4199},
            "King": {"mfPrice": 4899}, "Cal King": {"mfPrice": 4899},
        }
    },
]

for nm in new_models:
    for brand in products["brands"]:
        if brand["id"] == nm["brand_id"]:
            brand["models"].append({
                "id": nm["model_id"],
                "name": nm["model_name"],
                "sizes": list(nm["sizes"].keys())
            })
            break
    for size_name, price_data in nm["sizes"].items():
        entry = {
            "brand": nm["brand_sheet"],
            "model": nm["model_name"],
            "size": size_name,
            "mfPrice": price_data["mfPrice"],
            "competitors": dict(no_comp)
        }
        if "mfSalePrice" in price_data:
            entry["mfSalePrice"] = price_data["mfSalePrice"]
        comp["products"].append(entry)

comp["timestamp"] = "2026-05-03T12:00:00.000Z"

with open('src/data/products.json', 'w') as f:
    json.dump(products, f, indent=2)
with open('src/data/competitor-data.json', 'w') as f:
    json.dump(comp, f, indent=2)

total_models = sum(len(b["models"]) for b in products["brands"])
print(f"products.json: {total_models} models")
print(f"competitor-data.json: {len(comp['products'])} entries")
print(f"New models added: {len(new_models)}")

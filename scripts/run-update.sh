#!/bin/bash

# Mattress Comparator - Daily Price Update
# Run this script manually or set up a cron job

cd /home/merce/.openclaw/workspace/mattress-comparator

# Check if Brave API key is set
if [ -z "$BRAVE_API_KEY" ]; then
    echo "❌ BRAVE_API_KEY not set"
    echo "Run: export BRAVE_API_KEY=your_key_here"
    exit 1
fi

echo "🛏️ Starting price update at $(date)"
node scripts/price-update.js

# If successful, commit and push
if [ $? -eq 0 ]; then
    echo "📤 Committing updated prices..."
    git add src/data/competitor-data.json
    git commit -m "Price update $(date +%Y-%m-%d)" || echo "No changes to commit"
    git push origin master
else
    echo "❌ Price update failed"
    exit 1
fi

#!/bin/bash

# Default commit message if none provided
MESSAGE=${1:-"chore: Update code and sync with GitHub"}

echo "🔄 Syncing with GitHub..."

# Add all changes
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "✨ No changes to commit."
else
    # Commit changes
    git commit -m "$MESSAGE"
    echo "✅ Changes committed."
fi

# Push to remote
echo "🚀 Pushing to remote..."
git push

echo "🎉 Done! GitHub is up to date."

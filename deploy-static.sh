#!/bin/bash

# This script removes Next.js configuration and deploys as static site

echo "Removing Next.js files if they exist..."
rm -f package.json
rm -f package-lock.json
rm -f next.config.js
rm -f next.config.mjs
rm -rf .next/
rm -rf node_modules/

echo "Files removed. The site will now deploy as a static site on Vercel."
echo "No build process required - Vercel will serve the HTML files directly."
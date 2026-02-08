#!/bin/bash

# Lobster Force - Database Migration Runner
# This script helps you run the database setup

echo "🦞 LOBSTER FORCE - Database Setup"
echo ""
echo "The easiest way to run the migration is through Supabase Dashboard:"
echo ""
echo "1. Open this link:"
echo "   https://supabase.com/dashboard/project/xvsdpufvuxsqozhqihmv/sql/new"
echo ""
echo "2. Copy the entire SQL file:"
cat supabase-setup.sql
echo ""
echo ""
echo "3. Paste it into the SQL editor and click 'Run'"
echo ""
echo "That's it! The database will be fully set up."
echo ""
echo "Or run this command to copy SQL to clipboard:"
echo "  cat supabase-setup.sql | pbcopy    # macOS"
echo "  cat supabase-setup.sql | xclip     # Linux"

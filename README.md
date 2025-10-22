# DataCleanerPro

A production-ready web application and Google Sheets add-on for intelligent spreadsheet data cleaning.

## Overview

DataCleanerPro helps you clean and normalize messy spreadsheet data with a combination of deterministic rules and AI-assisted transformations. Upload a CSV, connect a Google Sheet, choose your cleaning recipes, preview changes, and apply with one-click undo.

## Features

- **Smart Cleaning Recipes**
  - Remove duplicates by keys
  - Normalize dates to ISO format
  - Standardize phone numbers to E.164
  - Title-case names with exception handling
  - Email validation and cleanup
  - Job title to seniority mapping (AI-assisted)
  - Company name normalization

- **Privacy-First Architecture**
  - Auto-delete files after 7 days
  - PII redaction before AI processing
  - No training on customer data
  - Transparent audit logs

- **Developer-Friendly**
  - Next.js + TypeScript + Tailwind
  - Supabase for auth and storage
  - Edge-optimized for performance
  - Comprehensive test coverage

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes / FastAPI microservice
- **Database**: Supabase (Postgres with RLS)
- **Storage**: Supabase Storage / Cloudflare R2
- **AI**: OpenAI / Anthropic with intelligent caching
- **Deployment**: Vercel (frontend) + Fly.io/Render (backend)

## Getting Started

See [BUILD_PLAN.md](./BUILD_PLAN.md) for the complete development roadmap.

## Status

Currently in initial development phase (Week 1: Foundations).

## License

TBD

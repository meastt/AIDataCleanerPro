# Changelog

All notable changes to DataCleanerPro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Configuration & Tooling
- Prettier configuration with Tailwind CSS plugin for consistent code formatting
- EditorConfig for consistent coding styles across different editors
- Supabase CLI configuration for local development
- GitHub Actions CI workflow for linting, type checking, and builds

#### Architecture & Infrastructure
- Proper Supabase client setup for Next.js 14 App Router
  - Separate clients for browser, server, and middleware
  - Row-level security (RLS) support
  - Cookie-based session management
- Middleware for automatic session refresh
- Environment variable validation with Zod
- Comprehensive error handling system for API routes
- API response utilities for consistent responses

#### Constants & Configuration
- Recipe definitions with metadata (engine type, category, icons)
- File upload limits per plan (free/pro)
- Pricing tiers with feature lists
- Rate limiting configuration
- Confidence thresholds for data quality
- LLM configuration (retries, timeout, batch size)
- Job seniority levels for classification
- Company suffixes for normalization
- Preview configuration settings

#### Utilities
- File handling utilities:
  - File validation (type, size)
  - Storage key generation
  - File size formatting
  - SHA-256 hashing
  - Filename sanitization
- Validation utilities:
  - Email normalization
  - Column name validation
  - Date/phone/email detection
  - PII redaction for LLM processing
- Formatting utilities:
  - Currency formatting
  - Number formatting
  - Relative time formatting
  - Duration formatting
  - Confidence percentage formatting

#### UI Components
- Button component with variants (primary, secondary, outline, ghost, danger)
- Card component with header, title, content, and footer
- Badge component with status variants
- Input component with label, error, and helper text
- Spinner/loading component
- Loading and error boundaries
- 404 Not Found page

#### Route Organization
- Auth route group with login page
- Dashboard route group with navigation layout
- Proper loading states for all routes
- Health check API endpoint

#### Database
- TypeScript database types matching Supabase schema
- Type-safe database queries

#### Documentation
- Updated GETTING_STARTED.md with all new features
- CHANGELOG.md for tracking changes

### Changed
- Updated package.json with essential scripts:
  - `lint:fix` - Auto-fix linting issues
  - `format` - Format code with Prettier
  - `format:check` - Check code formatting
  - `db:types` - Generate TypeScript types from Supabase
  - `db:push` - Push migrations to Supabase
  - `db:reset` - Reset local database
- Replaced basic Supabase client with Next.js 14 App Router compatible clients
- Updated dependencies:
  - Added `@supabase/ssr` for server-side rendering support
  - Added `prettier` and `prettier-plugin-tailwindcss` for code formatting
  - Added `supabase` CLI for local development
  - Removed `@supabase/auth-helpers-nextjs` (replaced by @supabase/ssr)

### Fixed
- Supabase client setup now properly handles cookies in Next.js 14 App Router
- Environment variables are now validated at runtime
- API errors are now properly typed and handled

## [0.1.0] - 2025-01-XX

### Added
- Initial project setup with Next.js 14, TypeScript, and Tailwind CSS
- Supabase database schema with RLS policies
- Core data types and models
- Build plan documentation
- Project README and getting started guide

[Unreleased]: https://github.com/meastt/meastt/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/meastt/meastt/releases/tag/v0.1.0

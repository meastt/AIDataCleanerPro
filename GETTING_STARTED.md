# Getting Started with DataCleanerPro

This guide will help you set up the development environment for DataCleanerPro.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier is fine)
- OpenAI or Anthropic API key
- Git

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your project URL and anon key
4. Navigate to the SQL Editor and run the migration:
   - Copy contents from `supabase/migrations/20250101000000_initial_schema.sql`
   - Execute it in the SQL Editor

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key  # or ANTHROPIC_API_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
datacleanerpro/
├── app/
│   ├── api/              # API routes
│   ├── components/       # React components
│   ├── lib/             # Utility functions and clients
│   ├── types/           # TypeScript type definitions
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── supabase/
│   └── migrations/      # Database migrations
├── public/              # Static assets
├── BUILD_PLAN.md        # Complete development roadmap
└── README.md            # Project overview
```

## Development Workflow

### Week 1 Goals (Foundations)

- [x] Repository setup
- [x] Next.js + TypeScript configuration
- [x] Supabase schema and RLS
- [ ] Authentication implementation
- [ ] File upload to Supabase Storage
- [ ] CSV parsing (Papaparse)

### Running Type Checks

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Supabase**: Backend, auth, database, and storage
- **Papaparse**: CSV parsing
- **Zod**: Runtime type validation
- **React Window**: Virtualized lists for large datasets

## Testing Strategy

As per the build plan, we will implement:

1. **Golden fixtures**: 20 test CSVs per recipe
2. **Idempotency tests**: Applying recipes twice should yield same result
3. **LLM regression tests**: Weekly snapshot testing

Test framework will be added in Week 2.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically detect Next.js and configure optimal settings.

### Environment Variables in Production

Make sure to set all required variables from `.env.example` in your Vercel project settings.

## Common Issues

### Supabase Connection Errors

- Verify your URL and keys in `.env.local`
- Check that RLS policies are correctly applied
- Ensure you're using the service role key for admin operations

### TypeScript Errors

- Run `npm run type-check` to see all errors
- Make sure all dependencies are installed
- Check that `tsconfig.json` paths are correct

## Next Steps

1. Review [BUILD_PLAN.md](./BUILD_PLAN.md) for the full 6-week roadmap
2. Start with Week 1 tasks
3. Set up error tracking (Sentry) and analytics (PostHog) - optional but recommended
4. Join our community (TBD)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

For questions or issues, please open a GitHub issue or contact the maintainers.

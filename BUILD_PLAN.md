# DataCleanerPro - Lead Developer Build Plan

## MVP Goal (What Ships)

A simple web app + Google Sheets add-on that:

1. Lets a user upload a CSV / connect a Sheet
2. Choose a cleaning recipe (e.g., dedupe, normalize dates/phones, title-case names, map job titles → seniority)
3. Shows a preview diff; apply changes; one-click undo
4. Exports cleaned file or writes back to Google Sheet
5. Clear privacy posture: files auto-delete, PII redacted before AI calls, transparent logs

## Architecture (Cheap, Boring, Safe)

### Front-end

- **Next.js** (App Router) + React + TypeScript + Tailwind on Vercel (free/cheap)
- Component lib: Headless UI/radix; no design system sprawl
- File upload (CSV/XLSX), Google OAuth connect (Sheets scope)
- Minimal dashboard: "New Job", "History", "Billing"

### Backend

- Edge-leaning but not dogmatic: Next.js API routes or one Python FastAPI microservice on Fly.io/Render (free tier) for data ops (Pandas) if you prefer Python for CSV handling
- Queue/Jobs: Vercel background functions, or Cloudflare Queues/Workers if you want ultra-cheap async (Avoid Kafka/Rabbit)
- DB/Auth: Supabase (Postgres + Auth). Row-level security (RLS) on user data
- Object storage: Supabase Storage or Cloudflare R2 for uploaded files + result artifacts
- LLM: OpenAI or Anthropic (whichever is cheaper/most accurate in testing). Add fallbacks to deterministic Pandas transforms for standard recipes (saves tokens)
- Observability: PostHog (product analytics), Sentry (errors), simple structured logs in DB

### Why This Stays Cheap

- Vercel + Supabase free tiers go far
- Token spend controlled by: (1) deterministic transforms first, (2) chunking, (3) cache by content-hash + recipe

## Core Data Model (Supabase/Postgres)

```sql
-- users
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  plan text CHECK (plan IN ('free','pro')) DEFAULT 'free',
  created_at timestamp DEFAULT now()
);

-- files
CREATE TABLE files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  original_name text NOT NULL,
  storage_key text NOT NULL, -- R2/Supa path
  mime text NOT NULL,
  rows_estimated int,
  sha256 text NOT NULL, -- for cache
  created_at timestamp DEFAULT now()
);

-- jobs
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  file_id uuid REFERENCES files(id) ON DELETE CASCADE,
  recipe text NOT NULL,  -- e.g., 'dedupe_by_columns', 'normalize_dates', 'normalize_phones', 'map_job_titles'
  params jsonb, -- columns, formats, mapping table, etc.
  status text CHECK (status IN ('queued','processing','needs_review','complete','failed')) DEFAULT 'queued',
  started_at timestamp,
  finished_at timestamp,
  llm_tokens_in int DEFAULT 0,
  llm_tokens_out int DEFAULT 0,
  cost_usd numeric(8,4) DEFAULT 0,
  preview_key text,  -- storage path to preview diff
  result_key text,   -- storage path to final CSV/XLSX
  undo_key text,     -- backup of original (for rollback)
  confidence real    -- 0-1 aggregated across steps
);

-- recipe_runs (per step in a job)
CREATE TABLE recipe_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  step_order int NOT NULL,
  engine text CHECK (engine IN ('pandas', 'llm')) NOT NULL,
  input_sample text,
  output_sample text,
  confidence real,
  notes text
);
```

## Cleaning Recipes (MVP)

Prioritize deterministic first, AI as a helper only when rules are fuzzy.

1. **Remove duplicates by keys** (deterministic Pandas)
2. **Normalize dates to ISO YYYY-MM-DD** (deterministic for common formats; send ambiguous lines to LLM for disambiguation with confidence flags)
3. **Normalize phone numbers to E.164** (use phonenumbers lib; LLM only for unparseable edge cases)
4. **Title-case names** (deterministic; exceptions list like "McDonald", "O'Reilly")
5. **Email cleanup** (trim, lowercase, validate)
6. **Map job titles → seniority** (LLM-assisted classification with a controlled label set and few-shot examples; cache by string)
7. **Company name normalization** (LLM with rules + known suffix stripping; cache + confidence flags)

Each recipe returns: **preview diff**, **confidence score**, and **reversible patch** (we'll store the original + patch for one-click undo).

## Trust, Privacy & Compliance (What Users Care About)

- **Data lifecycle**: Auto-delete originals and outputs after 7 days (configurable). Display countdown in UI
- **Redaction before LLM**: For recipes that need AI, run a regex pass to mask emails, phone numbers, addresses unless essential to the task (e.g., phone format). Keep raw data server-side; send only masked or column-subset
- **No training on customer data**: Explicit in policy
- **Security**: RLS in Supabase; signed, time-boxed URLs for file access; server-side validation only (never trust client)
- **Transparency**: "What we send to AI" modal per job; downloadable job audit (steps, tokens, cost)

## LLM Prompting Pattern (Reliable + Cheap)

### Classification (job title → seniority)

**System**: "You are a strict classifier. Allowed labels: [Intern, Junior, Mid, Senior, Lead, Director, VP, C-Level, Unknown]. If unsure → 'Unknown'. Output JSON only."

**User**: `{ "title": "Sr. Business Analyst", "examples": [ ...few shots... ] }`

Response schema validated (zod). If invalid → retry once, else mark `needs_review`.

### Disambiguation (ambiguous dates)

- Provide the source row and locale hint (if available)
- Ask for normalized date or "Unknown"
- Cap tokens via short context windows; batch similar ambiguities

### Company normalization

**Instruction**: "Strip legal suffixes (Inc., LLC, Ltd.), fix casing, no hallucination; return original if unsure."

### Caching

```
cache_key = sha256(recipe + normalized_input + params + model_version)
```

If hit → skip call, reuse result.

## UX Flow (Fast & Confident)

1. **New Job** → upload CSV or Connect Google Sheet (picker)
2. **Pick recipe(s)** → choose columns, options (e.g., dedupe keys)
3. **Click Preview**: we run deterministic steps + AI steps, produce a row-by-row diff view (added/removed/changed, with confidence badges)
4. **Apply** → write result to file or back to Sheet (keep a backup tab)
5. **Undo** anytime from History (apply stored patch/backups)
6. **Download audit** (CSV of changes + JSON metadata) to build trust

## Pricing & Limits (Launch)

- **Free**: up to 2 jobs/day, max 5k rows/job, community support
- **Pro $12/mo**: 100k rows/day, priority queue, job title/ company mapping, Google Sheets write-back, audit exports
- **Usage add-ons**: cheap credit packs for spikes

**Goal**: keep infra + token spend <$100/mo early. Most transforms are deterministic.

## Milestones (6 Weeks)

### Week 1 — Foundations

- Repo, CI/CD (Vercel), error tracking (Sentry), analytics (PostHog)
- Supabase setup (tables + RLS)
- Auth (email + Google)
- File upload to Storage; CSV parser (Papaparse on client for sampling; server uses Pandas)

### Week 2 — Recipes v1 (deterministic)

- Dedupe by keys
- Date normalization (common formats)
- Phone normalization (phonenumbers)
- Title-case names
- Preview diff component (virtualized table: react-window)
- Apply/Undo pipeline with stored patch

### Week 3 — AI-assisted steps

- LLM client + cost metering
- Job title → seniority classifier (few-shot + cache)
- Ambiguous date resolver (batched)
- Company normalization (suffix rules + LLM fallback)
- Confidence scoring + per-cell flags

### Week 4 — Google Sheets Add-on + Polish

- Minimal Add-on: sidebar (select sheet range → send to backend → receive preview → apply back as new tab)
- OAuth scopes limited; publish privately first
- Audit artifact download (JSON + CSV of changes)
- Privacy policy & ToS pages

### Week 5 — Reliability & Trust

- Large-file chunking test (up to 200k rows)
- Rate limiting + backpressure (per-user concurrency)
- Redaction pass for AI paths; "What we send" modal
- QA scripts (golden CSV fixtures; property tests for idempotency)
- Basic load test (k6) on apply pipeline

### Week 6 — Beta & Launch

- Stripe (payment links / customer portal)
- Onboarding checklist, empty-state tutorials
- SEO pages for task long-tails ("standardize dates", "dedupe emails", "normalize phones", "map titles")
- Public beta with a small waitlist; capture NPS + "what recipe should we add?" survey
- Ship!

## Test Strategy (Confidence > Features)

- **Golden fixtures**: 20 CSVs (dirty → clean) for every recipe; CI runs diff equals
- **Idempotency**: applying a recipe twice should not change output again
- **Sampling previews**: for 100k-row files, preview shows top/bottom/10 random rows with changes
- **LLM drift**: snapshot prompts + versions; run weekly regression (10 random titles → labels)
- **Manual review mode** for any job with confidence < 0.85

## Launch Checklist (Trust & Conversion)

- Clear pricing with free tier
- "We never train on your data" badge + auto-delete policy
- "What we send to AI" explainer
- "See a sample diff" interactive demo (no signup)
- Changelog + Status page (UptimeRobot is fine)
- Support: Intercom/Chatwoot + "email us a sample CSV" CTA

## Post-Launch Metrics That Matter

- **Activation**: % who upload → preview → apply
- **Time-to-value**: seconds from upload → first applied job
- **Confidence coverage**: % cells resolved deterministically vs AI
- **LLM cost/GM**: target >80% jobs fully deterministic or < $0.05/job
- **Recipe success**: errors per 1k rows; top failed reasons → next week fixes

## Security & Abuse

- File size caps; MIME allowlist; AV scan (ClamAV in worker) optional
- PII redaction logs; encryption at rest (Supa) + in transit (HTTPS)
- API keys in Vercel secrets; per-user rate limits
- Hard "no" on uploading regulated data (PHI/PCI). Checkbox acknowledgment

## LLM Prompts (Short & Strict)

### Classifier (Job Title → Seniority)

```
System: "Return JSON only: {label: <one of [Intern, Junior, Mid, Senior, Lead, Director, VP, C-Level, Unknown]>}. If unsure → Unknown. No explanations."

User: {
  "title": "Senior Business Analyst",
  "hints": ["consulting context"],
  "examples": [
    {"title":"VP of Sales","label":"VP"},
    ...
  ]
}
```

### Ambiguous Date Resolver

```
System: "Normalize to YYYY-MM-DD. If ambiguous or incomplete → Unknown. JSON only: {date: "...", confidence: 0..1}."

User: {
  "value": "05/07/23",
  "localeHint": "GB",
  "rowSample": {"OrderID": 123, ...}
}
```

### Company Normalizer

```
System: "Strip legal suffixes (Inc, LLC, Ltd), fix casing. If unsure, return input. JSON only: {normalized:"..."}."

User: {
  "company": "acme, inc."
}
```

---

## Adapting This Blueprint

This same architecture can be adapted for:

- **Bulk Subtitle Translator**: Replace "cleaning recipes" with translation pipelines; use streaming LLM for speed; cache by subtitle hash
- **Log Analyzer**: Replace recipes with pattern detectors (regex + LLM for anomalies); add real-time streaming + alerting

The core principles remain: deterministic first, AI as fallback, transparent costs, privacy-first, rapid iteration.

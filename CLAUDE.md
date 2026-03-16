# Propyte Web — Marketplace App Rules

> Migration project: This codebase (Next.js on Vercel) is being migrated to propyte.com,
> combining this UX/UI with the custom Propyte Real Estate WordPress plugin.

## Project Context

- **Fork origin:** Propyte-Team/HERO-SITE-ZILLOW-
- **Target domain:** propyte.com (currently WordPress on Hostinger)
- **Goal:** Merge this Zillow-style design with Propyte's custom real estate plugin
- **Owner:** Luis Flores (Coordinador de Marketing, Propyte)
- **Brand:** Propyte™ — "Real estate en modo inteligente"

## Security Rules

- NEVER commit `.env`, `.env.local`, or any file containing API keys/secrets
- NEVER expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- NEVER hardcode credentials — always use environment variables
- Review all changes before pushing to remote
- Use `.env.example` as the template for environment variables

## Quick Reference

| What | Where |
|------|-------|
| Properties data (static fallback) | `src/data/properties.ts` |
| Property TypeScript types | `src/types/property.ts` |
| Supabase queries | `src/lib/supabase/queries.ts` |
| Supabase clients | `src/lib/supabase/client.ts` (browser) / `server.ts` (SSR + service role) |
| DB schema | `supabase/migrations/001_initial_schema.sql` |
| Schema JSON-LD | `src/components/shared/SchemaMarkup.tsx` |
| i18n messages ES | `src/i18n/messages/es.json` |
| i18n messages EN | `src/i18n/messages/en.json` |
| Sitemap | `src/app/sitemap.ts` |
| Financial calculators | `src/lib/calculator.ts` |
| Formatters | `src/lib/formatters.ts` |
| Filters hook | `src/hooks/useFilters.ts` |

## Database

- **Supabase PostgreSQL** with RLS enabled on all tables.
- DB types defined in `src/lib/supabase/types.ts`.
- Property stages: `preventa`, `construccion`, `entrega_inmediata` (enum).
- Property types: `departamento`, `penthouse`, `terreno`, `macrolote`, `casa` (enum).
- Full-text search: Spanish tsvector index on `name`, `description_es`, `zone`, `city`.
- Prices stored as `bigint` in MXN. No cents. Format only at display time with `formatPrice()`.
- Slugs are unique, immutable after creation. Generated from property name + zone with `slugify()`.

## Data Flow

```
lanzamientos.csv → import script → Supabase (properties + developers tables)
                                         ↓
                        propyte-web queries via queries.ts
                                         ↓
                     ISR pages (revalidate every 1 hour)
                                         ↓
                          CDN cached at edge (Vercel)
```

The static data in `src/data/properties.ts` is a FALLBACK only for when Supabase is not connected. New features should use Supabase queries.

## Creating New Page Types (SEO checklist)

When creating any new public page:

1. **`generateMetadata()`** — unique title + description + OG + Twitter + alternates (hreflang)
2. **`generateStaticParams()`** — for ISR generation of all known slugs
3. **`<SchemaMarkup>`** — appropriate JSON-LD type
4. **Breadcrumbs** — both UI component and JSON-LD BreadcrumbList
5. **Internal links** — to parent page, sibling pages, and related content
6. **Sitemap entry** — update `src/app/sitemap.ts` to include the new page type
7. **Both locales** — test `/es/` and `/en/` versions
8. **Mobile responsive** — test at 375px width minimum

## i18n Pattern

```tsx
// Server Component
import { getTranslations } from 'next-intl/server';
const t = await getTranslations({ locale, namespace: 'property' });

// Client Component
import { useTranslations } from 'next-intl';
const t = useTranslations('property');
```

Add new keys to BOTH `es.json` and `en.json` simultaneously. Never leave a key untranslated.

## Supabase Client Usage

```tsx
// In Server Components / API routes:
import { createClient } from '@/lib/supabase/server';
const supabase = await createClient();

// In API routes that bypass RLS (e.g., lead creation):
import { createServiceClient } from '@/lib/supabase/server';
const supabase = createServiceClient();

// In Client Components (rare, prefer server):
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
```

## Import Script Pattern (for lanzamientos data)

When importing from `lanzamientos.csv`:
1. Parse CSV and validate each row
2. Create developer if not exists (upsert by name)
3. Generate slug from `nombre_proyecto` + `ciudad`
4. Map CSV columns to properties table schema
5. Use `bulkInsertProperties()` via service role client
6. Skip rows with missing required fields (name, city, state)
7. Parse price ranges ("Desde $2,900,000 MXN" → 2900000)
8. Map etapa: "Preventa" → 'preventa', "En construccion" → 'construccion'
9. Log import results (inserted, skipped, errors)

## Security Reminders

- Admin routes (`/[locale]/admin/**`) are NOT publicly accessible — they require Supabase auth.
- The `/api/leads` POST route is the ONLY public write endpoint. It uses service role to bypass RLS.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It must only be used in server-side code.
- All user input in forms is validated with Zod before submission.
- Images from external sources must be whitelisted in `next.config.ts` `remotePatterns`.

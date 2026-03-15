/**
 * Import lanzamientos from CSV into Supabase
 *
 * Usage:
 *   npx tsx scripts/import-lanzamientos.ts
 *   npx tsx scripts/import-lanzamientos.ts --dry-run       # preview without inserting
 *   npx tsx scripts/import-lanzamientos.ts --region qroo   # only QRoo + Yucatan
 *   npx tsx scripts/import-lanzamientos.ts --region all     # all regions
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Config ──────────────────────────────────────────
const CSV_PATH = resolve(__dirname, '../../lanzamientos.csv');
const BATCH_SIZE = 50;
const QROO_YUCATAN_STATES = ['quintana roo', 'yucatan', 'yucatán'];

// ── Parse args ──────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const regionArg = args.find((_, i) => args[i - 1] === '--region') || 'qroo';

// ── Supabase client (service role preferred, anon key fallback) ──
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  if (!url || !key) {
    console.error('Missing Supabase credentials. Add to .env.local:');
    console.error('  NEXT_PUBLIC_SUPABASE_URL=your-url');
    console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  (recommended)');
    console.error('  OR NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key   (fallback)');
    process.exit(1);
  }

  if (!serviceKey) {
    console.warn('WARNING: Using anon key instead of service role key.');
    console.warn('This may fail if RLS policies block inserts.');
    console.warn('Add SUPABASE_SERVICE_ROLE_KEY to .env.local for reliable imports.\n');
  }

  return createClient(url, key);
}

// ── CSV Parser (no external deps) ───────────────────
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || '').trim();
    });
    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// ── Helpers ─────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[áàä]/g, 'a')
    .replace(/[éèë]/g, 'e')
    .replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o')
    .replace(/[úùü]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parsePrice(priceStr: string): number | null {
  if (!priceStr || priceStr === 'Premium' || priceStr === 'TBD') return null;

  // "Desde $2,900,000 MXN" → 2900000
  // "$139,000-$245,000 MXN/m2" → 139000 (take the lower bound)
  const match = priceStr.replace(/[,\s]/g, '').match(/\$?([\d]+)/);
  if (!match) return null;

  const num = parseInt(match[1], 10);
  return num > 0 ? num : null;
}

function mapStage(etapa: string): 'preventa' | 'construccion' | 'entrega_inmediata' {
  const lower = etapa.toLowerCase().trim();
  if (lower.includes('construcci') || lower.includes('construccion')) return 'construccion';
  if (lower.includes('entrega') || lower.includes('inmediata')) return 'entrega_inmediata';
  return 'preventa';
}

function mapPropertyType(tipo: string): 'departamento' | 'penthouse' | 'terreno' | 'macrolote' | 'casa' {
  const lower = tipo.toLowerCase().trim();
  if (lower.includes('lote') || lower.includes('macrolote')) return 'terreno';
  if (lower.includes('casa') || lower.includes('townhome') || lower.includes('villa')) return 'casa';
  if (lower.includes('penthouse')) return 'penthouse';
  if (lower.includes('local') || lower.includes('comercial')) return 'departamento'; // fallback
  if (lower.includes('condo')) return 'departamento';
  return 'departamento';
}

function isQRooYucatan(state: string): boolean {
  return QROO_YUCATAN_STATES.includes(state.toLowerCase().trim());
}

// ── Developer cache ─────────────────────────────────
const developerCache = new Map<string, string>(); // name → id

async function getOrCreateDeveloper(
  supabase: ReturnType<typeof createClient>,
  name: string,
  city: string,
  state: string,
): Promise<string | null> {
  if (!name) return null;

  const cacheKey = name.toLowerCase().trim();
  if (developerCache.has(cacheKey)) {
    return developerCache.get(cacheKey)!;
  }

  // Check if exists
  const { data: existing } = await supabase
    .from('developers')
    .select('id')
    .eq('slug', slugify(name))
    .single();

  if (existing) {
    developerCache.set(cacheKey, existing.id);
    return existing.id;
  }

  // Create new
  const { data: created, error } = await supabase
    .from('developers')
    .insert({
      name: name.trim(),
      slug: slugify(name),
      city,
      state,
    })
    .select('id')
    .single();

  if (error) {
    console.warn(`  Warning: Could not create developer "${name}": ${error.message}`);
    return null;
  }

  developerCache.set(cacheKey, created.id);
  return created.id;
}

// ── Main ────────────────────────────────────────────
async function main() {
  console.log('=== Propyte Lanzamientos Import ===\n');

  if (dryRun) console.log('DRY RUN MODE — no data will be inserted.\n');

  // Read CSV
  const csv = readFileSync(CSV_PATH, 'utf-8');
  let rows = parseCSV(csv);
  console.log(`Total rows in CSV: ${rows.length}`);

  // Filter by region
  if (regionArg === 'qroo') {
    rows = rows.filter(r => isQRooYucatan(r.estado_republica));
    console.log(`Filtered to QRoo/Yucatan: ${rows.length} rows`);
  }

  // Filter out junk rows (names that look like search result titles, etc.)
  rows = rows.filter(r => {
    const name = r.nombre_proyecto || '';
    if (name.length > 100) return false; // too long, likely a scraping artifact
    if (name.includes(' - Inmueble')) return false; // search result title
    if (name.includes('Departamentos preventa en')) return false; // aggregate page title
    if (!r.ciudad) return false; // no city
    return true;
  });
  console.log(`After cleaning: ${rows.length} valid rows\n`);

  // Deduplicate by name + city
  const seen = new Set<string>();
  const uniqueRows: typeof rows = [];
  for (const row of rows) {
    const key = slugify(`${row.nombre_proyecto}-${row.ciudad}`);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRows.push(row);
    }
  }
  console.log(`After dedup: ${uniqueRows.length} unique developments\n`);

  if (dryRun) {
    console.log('Sample of first 10 developments to import:');
    for (const row of uniqueRows.slice(0, 10)) {
      const price = parsePrice(row.rango_precios);
      console.log(`  - ${row.nombre_proyecto} | ${row.ciudad} | ${row.zona || 'N/A'} | ${price ? `$${price.toLocaleString()} MXN` : 'N/A'} | ${row.etapa || 'Preventa'}`);
    }
    console.log(`\n... and ${uniqueRows.length - 10} more.\n`);

    // Stats
    const byCityCount: Record<string, number> = {};
    for (const row of uniqueRows) {
      const city = row.ciudad || 'Unknown';
      byCityCount[city] = (byCityCount[city] || 0) + 1;
    }
    console.log('By city:');
    Object.entries(byCityCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([city, count]) => console.log(`  ${city}: ${count}`));

    console.log('\nRun without --dry-run to import.');
    return;
  }

  // Connect to Supabase
  const supabase = getSupabase();

  // Check connection
  const { error: connError } = await supabase.from('properties').select('id').limit(1);
  if (connError) {
    console.error(`Supabase connection failed: ${connError.message}`);
    console.error('Make sure your migration has been applied and RLS allows service role access.');
    process.exit(1);
  }
  console.log('Supabase connected.\n');

  // Import in batches
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < uniqueRows.length; i += BATCH_SIZE) {
    const batch = uniqueRows.slice(i, i + BATCH_SIZE);
    const properties = [];

    for (const row of batch) {
      const name = row.nombre_proyecto?.trim();
      const city = row.ciudad?.trim();
      const state = row.estado_republica?.trim();

      if (!name || !city || !state) {
        skipped++;
        continue;
      }

      const slug = slugify(`${name}-${city}`);
      const price = parsePrice(row.rango_precios);
      const stage = mapStage(row.etapa || 'Preventa');
      const propertyType = mapPropertyType(row.tipo_unidades || 'Departamentos');

      // Get or create developer
      const developerId = row.desarrolladora
        ? await getOrCreateDeveloper(supabase, row.desarrolladora, city, state)
        : null;

      properties.push({
        slug,
        name,
        developer_id: developerId,
        city,
        zone: row.zona || city,
        state,
        address: row.zona ? `${row.zona}, ${city}` : city,
        price_mxn: price || 0,
        currency: 'MXN',
        area_m2: 0, // not in CSV
        property_type: propertyType,
        stage,
        badge: stage === 'preventa' ? 'preventa' : stage === 'entrega_inmediata' ? 'entrega_inmediata' : 'nuevo',
        usage: row.tipo_desarrollo?.toLowerCase().includes('turist') ? ['vacacional', 'renta'] : ['residencial'],
        featured: false,
        published: true,
        description_es: [
          row.notas,
          row.num_unidades ? `${row.num_unidades} unidades` : null,
          row.fecha_entrega_estimada ? `Entrega estimada: ${row.fecha_entrega_estimada}` : null,
          `Fuente: ${row.portal_fuente || 'Web'}`,
        ].filter(Boolean).join('. ') || `${name} en ${row.zona || city}, ${city}.`,
        description_en: `${name} in ${row.zona || city}, ${city}. ${stage === 'preventa' ? 'Pre-sale' : 'Under construction'}.`,
        images: [],
        amenities: [],
      });
    }

    if (properties.length === 0) continue;

    // Upsert (skip conflicts on slug)
    const { data, error } = await supabase
      .from('properties')
      .upsert(properties, { onConflict: 'slug', ignoreDuplicates: true })
      .select('id');

    if (error) {
      console.error(`  Batch ${Math.floor(i / BATCH_SIZE) + 1} error: ${error.message}`);
      errors += properties.length;
    } else {
      inserted += data?.length || 0;
      const progress = Math.min(i + BATCH_SIZE, uniqueRows.length);
      process.stdout.write(`\r  Imported ${inserted} / ${uniqueRows.length} (${Math.round(progress / uniqueRows.length * 100)}%)`);
    }
  }

  console.log('\n');
  console.log('=== Import Complete ===');
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Skipped (missing data): ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Developers created: ${developerCache.size}`);
}

// Load .env.local — try multiple paths
function loadEnv() {
  const candidates = [
    resolve(process.cwd(), '.env.local'),
    resolve(process.cwd(), '../.env.local'),
    resolve(process.cwd(), 'propyte-web/.env.local'),
  ];

  for (const envPath of candidates) {
    try {
      const envContent = readFileSync(envPath, 'utf-8');
      let loaded = 0;
      for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
          loaded++;
        }
      }
      if (loaded > 0) {
        console.log(`Loaded ${loaded} env vars from ${envPath}\n`);
        return;
      }
    } catch {
      // Try next candidate
    }
  }
  console.warn('No .env.local found — using existing environment variables.\n');
}

loadEnv();
main().catch(console.error);

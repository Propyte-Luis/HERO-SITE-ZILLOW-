import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getZoneScores } from '@/lib/supabase/queries';
import { ZonasExplorer } from './ZonasExplorer';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? 'Zone Intelligence — Vacation Rental Market Scores | Propyte'
    : 'Inteligencia de Zonas — Scores del Mercado de Renta Vacacional | Propyte';
  const description = isEn
    ? 'Compare investment zones across Cancun, Playa del Carmen, Tulum and Merida. AI-powered scores with occupancy rates, ADR trends, RevPAR, and seasonal patterns.'
    : 'Compara zonas de inversión en Cancún, Playa del Carmen, Tulum y Mérida. Scores con IA: ocupación, ADR, RevPAR y estacionalidad.';

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale: isEn ? 'en_US' : 'es_MX' },
    alternates: {
      languages: { es: '/es/zonas', en: '/en/zonas', 'x-default': '/es/zonas' },
    },
  };
}

export default async function ZonasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';

  // Fetch ALL zone scores (no city filter)
  const supabase = await createServerSupabaseClient();
  const allScores = supabase ? await getZoneScores(supabase) : [];

  // Get unique cities
  const cities = [...new Set(allScores.map((s) => s.city))].sort();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isEn ? 'Investment Zone Rankings' : 'Rankings de Zonas de Inversión',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-gray-500 mb-6">
          <a href={`/${locale}`} className="hover:text-gray-700">
            {isEn ? 'Home' : 'Inicio'}
          </a>
          {' / '}
          <span className="text-gray-900 font-medium">{isEn ? 'Zones' : 'Zonas'}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEn ? 'Zone Intelligence' : 'Inteligencia de Zonas'}
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            {isEn
              ? 'AI-powered investment scores for vacation rental zones'
              : 'Scores de inversión potenciados por IA para zonas de renta vacacional'}
          </p>
        </div>

        <ZonasExplorer
          scores={allScores}
          cities={cities}
          locale={locale}
        />

        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {isEn ? 'Methodology' : 'Metodología'}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {isEn
              ? 'Zone Intelligence Scores (0-100) combine five weighted components: rental yield (30%), occupancy rate (25%), ADR growth (20%), supply pressure (15%), and market liquidity (10%). Data sources include AirDNA vacation rental metrics and 140K+ rental comparables from 8+ portals. Scores are updated weekly.'
              : 'Los Zone Intelligence Scores (0-100) combinan cinco componentes ponderados: yield de renta (30%), tasa de ocupación (25%), crecimiento de ADR (20%), presión de oferta (15%) y liquidez de mercado (10%). Las fuentes incluyen métricas de AirDNA y 140K+ comparables de renta de 8+ portales. Los scores se actualizan semanalmente.'}
          </p>
        </div>
      </main>
    </>
  );
}

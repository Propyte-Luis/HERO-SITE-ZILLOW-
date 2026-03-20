export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPropertyBySlug, getSimilarProperties, getAllProperties } from '@/data/properties';
import { formatPrice } from '@/lib/formatters';
import PropertyPageContent from './PropertyPageContent';
import SchemaMarkup from '@/components/shared/SchemaMarkup';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getRentalEstimate, getAirdnaMarketSummary } from '@/lib/supabase/queries';
import { CITY_TO_AIRDNA } from '@/lib/calculator';

export async function generateStaticParams() {
  return getAllProperties().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return {};

  const t = await getTranslations({ locale, namespace: 'stages' });
  const description = property.description[locale as 'es' | 'en'] || property.description.es;

  return {
    title: `${property.name} — ${formatPrice(property.price.mxn)}`,
    description: description.slice(0, 155),
    openGraph: {
      title: property.name,
      description,
      images: [{ url: property.images[0], width: 800, height: 450 }],
      type: 'website',
      locale: locale === 'es' ? 'es_MX' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.name,
      description,
      images: [property.images[0]],
    },
    alternates: {
      languages: {
        es: `/es/propiedades/${slug}`,
        en: `/en/properties/${slug}`,
        'x-default': `/es/propiedades/${slug}`,
      },
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const similar = getSimilarProperties(property, 4);

  // Fetch dynamic rent estimate + AirDNA market data
  let smartRentEstimate: number | null = null;
  let smartRentEstimateVac: number | null = null;
  let totalComparables = 10000;
  let dataFreshness: string | null = null;
  let airdnaOccupancy: number | undefined;
  let airdnaAdr: number | undefined;
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const airdnaMarket = CITY_TO_AIRDNA[property.location.city] || '';
      const [result, vacResult, countResult, airdnaResult] = await Promise.all([
        getRentalEstimate(supabase, property.location.city, property.specs.type || 'departamento', property.specs.bedrooms, property.location.zone, 'residencial'),
        getRentalEstimate(supabase, property.location.city, property.specs.type || 'departamento', property.specs.bedrooms, property.location.zone, 'vacacional'),
        supabase.from('rental_comparables').select('id', { count: 'exact', head: true }).eq('active', true),
        airdnaMarket ? getAirdnaMarketSummary(supabase, airdnaMarket) : Promise.resolve(null),
      ]);
      if (result.data) {
        if (result.data.avg_rent_per_m2 && result.data.avg_rent_per_m2 > 0 && property.specs.area > 0) {
          smartRentEstimate = Math.round(result.data.avg_rent_per_m2 * property.specs.area);
        } else {
          smartRentEstimate = result.data.median_rent_mxn;
        }
        dataFreshness = result.data.last_updated;
      }
      if (vacResult.data) {
        smartRentEstimateVac = vacResult.data.median_rent_mxn;
      }
      if (countResult.count) totalComparables = countResult.count;
      if (airdnaResult) {
        airdnaOccupancy = airdnaResult.current_occupancy ?? undefined;
        // Get ADR for matching bedroom count
        const bedKey = `${property.specs.bedrooms}_bedroom`;
        airdnaAdr = airdnaResult.adr_by_beds[bedKey] ?? airdnaResult.current_adr ?? undefined;
      }
    }
  } catch {
    // Continue with static data
  }

  return (
    <>
      <SchemaMarkup
        type="realEstateListing"
        data={{
          name: property.name,
          description: property.description[locale as 'es' | 'en'],
          url: `https://propyte.com/${locale}/propiedades/${slug}`,
          image: property.images[0],
          offers: {
            '@type': 'Offer',
            price: property.price.mxn,
            priceCurrency: 'MXN',
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: property.location.city,
            addressRegion: property.location.state,
            addressCountry: 'MX',
          },
        }}
      />
      <PropertyPageContent property={property} similar={similar} locale={locale} smartRentEstimate={smartRentEstimate} smartRentEstimateVac={smartRentEstimateVac} totalComparables={totalComparables} dataFreshness={dataFreshness} airdnaOccupancy={airdnaOccupancy} airdnaAdr={airdnaAdr} />
    </>
  );
}

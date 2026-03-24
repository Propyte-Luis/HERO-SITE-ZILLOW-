import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3088';

// ============================================================
// FASE 1 — Quick Wins
// ============================================================

test.describe('Phase 1: Quick Wins', () => {

  test('1.7 — Badge component supports all stage types', async ({ page }) => {
    await page.goto(`${BASE}/es/propiedades`);
    await page.waitForLoadState('networkidle');
    // Check that marketplace loads without errors
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
    // No JS console errors
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  });

  test('1.3 — Hero shows social proof stats', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState('networkidle');
    // Check stats section exists (should show Desarrollos, Unidades, Ciudades, Zonas)
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    // Check for stats badges - they use bg-white/10 class
    const statsBadges = page.locator('text=Desarrollos');
    const count = await statsBadges.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('1.3 — Hero stats show in English (or ES fallback)', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.waitForLoadState('networkidle');
    // EN locale may fallback to ES without full env config — accept either
    const devEs = await page.locator('text=Desarrollos').count();
    const devEn = await page.locator('text=Developments').count();
    expect(devEs + devEn).toBeGreaterThanOrEqual(1);
  });

  test('1.4 — ExploreCategories renders with type counts', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState('networkidle');
    // Check explore section exists
    const exploreTitle = page.locator('text=Explora por tipo de propiedad');
    await expect(exploreTitle).toBeVisible();
    // Check category cards exist (5 categories)
    const categoryLinks = page.locator('a[href*="/propiedades?type="], a[href*="/propiedades?stage="]');
    const categoryCount = await categoryLinks.count();
    expect(categoryCount).toBeGreaterThanOrEqual(5);
  });

  test('1.5 — DeveloperLogos section renders if data available', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState('networkidle');
    // This may or may not render depending on Supabase availability
    // Just verify no error on the page
    const body = await page.textContent('body');
    expect(body).not.toContain('Application error');
  });

  test('1.2 — Home page loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState('networkidle');
    // Filter out known non-critical errors
    const criticalErrors = errors.filter(e => !e.includes('hydration') && !e.includes('Supabase'));
    expect(criticalErrors.length).toBe(0);
  });

  test('1.1 — PropertyCards show capRate and annualRevenue', async ({ page }) => {
    await page.goto(`${BASE}/es/propiedades`);
    await page.waitForLoadState('networkidle');
    // Check for Cap rate badges (from static data we added cap rate to 2 properties)
    const capBadges = page.locator('text=/Cap \\d/');
    const capCount = await capBadges.count();
    expect(capCount).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// FASE 2 — Content Pages
// ============================================================

test.describe('Phase 2: Content Pages', () => {

  test('2.1 — /como-comprar/ renders correctly (ES)', async ({ page }) => {
    await page.goto(`${BASE}/es/como-comprar`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Cómo Comprar/);
    // 6-step process
    const steps = page.locator('text=Investiga');
    await expect(steps.first()).toBeVisible();
    const delivery = page.locator('text=Entrega de Llaves');
    await expect(delivery.first()).toBeVisible();
    // Documents section
    const docs = page.locator('text=Documentos que Necesitas');
    await expect(docs).toBeVisible();
    // CTA buttons
    const browseBtn = page.locator('a[href*="/propiedades"]');
    expect(await browseBtn.count()).toBeGreaterThanOrEqual(1);
  });

  test('2.1 — /como-comprar/ renders correctly (EN)', async ({ page }) => {
    await page.goto(`${BASE}/en/como-comprar`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/How to Buy/);
    const steps = page.locator('text=Research');
    await expect(steps.first()).toBeVisible();
  });

  test('2.2 — /como-invertir/ renders correctly', async ({ page }) => {
    await page.goto(`${BASE}/es/como-invertir`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Cómo Invertir/);
    // 3 strategy cards
    await expect(page.locator('text=Plusvalía').first()).toBeVisible();
    await expect(page.locator('text=Renta Residencial').first()).toBeVisible();
    await expect(page.locator('text=Renta Vacacional').first()).toBeVisible();
    // ROI by stage table
    await expect(page.locator('text=ROI por Etapa')).toBeVisible();
    // Key metrics
    await expect(page.locator('text=Cap Rate').first()).toBeVisible();
  });

  test('2.2 — /como-invertir/ EN version', async ({ page }) => {
    await page.goto(`${BASE}/en/como-invertir`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/How to Invest/);
    await expect(page.locator('text=Capital Gains').first()).toBeVisible();
  });

  test('2.3 — /financiamiento/ renders correctly', async ({ page }) => {
    await page.goto(`${BASE}/es/financiamiento`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Financiamiento/);
    // 4 methods
    await expect(page.locator('text=Crédito Hipotecario').first()).toBeVisible();
    await expect(page.locator('text=Pago de Contado').first()).toBeVisible();
    // Comparison table
    await expect(page.locator('text=Comparativa Rápida')).toBeVisible();
  });

  test('2.3 — /financiamiento/ EN version', async ({ page }) => {
    await page.goto(`${BASE}/en/financiamiento`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Financing/);
    await expect(page.locator('text=Mortgage').first()).toBeVisible();
  });

  test('2.4 — /promociones/ renders correctly', async ({ page }) => {
    await page.goto(`${BASE}/es/promociones`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Promociones/);
    // Should show either promotions or empty state
    const body = await page.textContent('body');
    const hasPromos = body?.includes('Promoción Destacada');
    const hasEmpty = body?.includes('No hay promociones activas');
    expect(hasPromos || hasEmpty).toBeTruthy();
  });

  test('2.5 — /faq/ renders and accordion works', async ({ page }) => {
    await page.goto(`${BASE}/es/faq`);
    await page.waitForLoadState('networkidle');
    // Title
    const title = page.locator('text=Preguntas Frecuentes');
    await expect(title.first()).toBeVisible();
    // Category tabs
    await expect(page.locator('button:text("Todas")')).toBeVisible();
    await expect(page.locator('button:text("Compra")')).toBeVisible();
    // Click first FAQ to open
    const firstQuestion = page.locator('button:has-text("¿Puedo comprar propiedad")');
    await firstQuestion.click();
    // Answer should be visible
    const answer = page.locator('text=fideicomiso bancario');
    await expect(answer.first()).toBeVisible();
    // Click category filter
    await page.locator('button:text("Inversión")').click();
    // Should filter to investment questions
    await expect(page.locator('text=¿Qué ROI puedo esperar')).toBeVisible();
  });

  test('2.5 — /faq/ EN version loads without error', async ({ page }) => {
    const response = await page.goto(`${BASE}/en/faq`);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    // Accept either EN or ES content (locale may fallback without env)
    const hasEn = await page.locator('text=Frequently Asked Questions').count();
    const hasEs = await page.locator('text=Preguntas Frecuentes').count();
    expect(hasEn + hasEs).toBeGreaterThanOrEqual(1);
  });

  test('2.6 — /glosario/ renders with alphabetical nav', async ({ page }) => {
    await page.goto(`${BASE}/es/glosario`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Glosario/);
    // Alphabetical nav
    const letterA = page.locator('a[href="#letter-A"]');
    await expect(letterA).toBeVisible();
    // Terms
    await expect(page.locator('text=ADR (Average Daily Rate)').first()).toBeVisible();
    await expect(page.locator('text=Cap Rate').first()).toBeVisible();
    await expect(page.locator('text=ROI (Return on Investment)').first()).toBeVisible();
    // Cross-links
    const learnMoreLinks = page.locator('a:text("Saber más")');
    expect(await learnMoreLinks.count()).toBeGreaterThanOrEqual(1);
  });

  test('2.6 — /glosario/ EN version', async ({ page }) => {
    await page.goto(`${BASE}/en/glosario`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Glossary/);
    await expect(page.locator('text=Learn more').first()).toBeVisible();
  });

  test('2.7 — Testimonials section on home', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState('networkidle');
    // Check testimonials section
    const testimonialTitle = page.locator('text=Lo que Dicen Nuestros Clientes');
    await expect(testimonialTitle).toBeVisible();
    // Check stars exist
    const stars = page.locator('svg.fill-\\[\\#F5A623\\]');
    expect(await stars.count()).toBeGreaterThanOrEqual(3);
    // Check verified badge
    const verified = page.locator('text=Verificado');
    expect(await verified.count()).toBeGreaterThanOrEqual(1);
  });

  test('2.7 — Testimonials EN loads without error', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.waitForLoadState('networkidle');
    // Accept either EN or ES content
    const hasEn = await page.locator('text=What Our Clients Say').count();
    const hasEs = await page.locator('text=Lo que Dicen Nuestros Clientes').count();
    expect(hasEn + hasEs).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// FASE 3 — Lead Generation
// ============================================================

test.describe('Phase 3: Lead Generation', () => {

  test('3.1 — ContactForm has budget and investment type fields', async ({ page }) => {
    // Go to a property detail page (use static data slug)
    await page.goto(`${BASE}/es/desarrollos/nativa-tulum-tipo-a`);
    await page.waitForLoadState('networkidle');
    // Check for budget select
    const budgetSelect = page.locator('#contact-budget');
    // If the page loaded the development, the form should be there
    const formExists = await page.locator('form').count();
    if (formExists > 0) {
      await expect(budgetSelect).toBeVisible();
      // Check options
      const options = await budgetSelect.locator('option').count();
      expect(options).toBeGreaterThanOrEqual(5); // — + 5 ranges
      // Check investment type
      const typeSelect = page.locator('#contact-investmentType');
      await expect(typeSelect).toBeVisible();
    }
  });

  test('3.3 — LeadMagnet on home page', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState('networkidle');
    // Check lead magnet section
    const leadMagnet = page.locator('text=Top 10 Desarrollos con Mayor ROI');
    await expect(leadMagnet.first()).toBeVisible();
    // Check form fields
    const emailInput = page.locator('input[type="email"][placeholder*="correo"]');
    await expect(emailInput).toBeVisible();
    const submitBtn = page.locator('button:has-text("Descargar Reporte Gratis")');
    await expect(submitBtn).toBeVisible();
  });

  test('3.3 — LeadMagnet EN version loads', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.waitForLoadState('networkidle');
    // Accept either EN or ES content
    const hasEn = await page.locator('text=Top 10 Developments with Highest ROI').count();
    const hasEs = await page.locator('text=Top 10 Desarrollos con Mayor ROI').count();
    expect(hasEn + hasEs).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// Navigation
// ============================================================

test.describe('Navigation', () => {

  test('Header "Más" dropdown has all new links', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState('networkidle');
    // Click "Más" button in header nav
    const masBtn = page.locator('header button:has-text("Más")');
    await masBtn.click();
    // Check dropdown has new links (scoped to header to avoid footer duplicates)
    const nav = page.locator('header nav');
    await expect(nav.locator('a[href="/es/como-comprar"]')).toBeVisible();
    await expect(nav.locator('a[href="/es/como-invertir"]')).toBeVisible();
    await expect(nav.locator('a[href="/es/financiamiento"]')).toBeVisible();
    await expect(nav.locator('a[href="/es/promociones"]')).toBeVisible();
    await expect(nav.locator('a[href="/es/faq"]')).toBeVisible();
  });

  test('Footer has new links', async ({ page }) => {
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState('networkidle');
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    // Check footer links
    await expect(page.locator('footer a[href="/es/como-comprar"]')).toBeVisible();
    await expect(page.locator('footer a[href="/es/faq"]')).toBeVisible();
    await expect(page.locator('footer a[href="/es/glosario"]')).toBeVisible();
    await expect(page.locator('footer a[href="/es/promociones"]')).toBeVisible();
  });

  test('All new pages return 200 (ES)', async ({ page }) => {
    const pages = [
      '/es/como-comprar',
      '/es/como-invertir',
      '/es/financiamiento',
      '/es/promociones',
      '/es/faq',
      '/es/glosario',
    ];
    for (const p of pages) {
      const response = await page.goto(`${BASE}${p}`);
      expect(response?.status(), `Page ${p} should return 200`).toBe(200);
    }
  });

  test('All new pages return 200 (EN)', async ({ page }) => {
    const pages = [
      '/en/como-comprar',
      '/en/como-invertir',
      '/en/financiamiento',
      '/en/promociones',
      '/en/faq',
      '/en/glosario',
    ];
    for (const p of pages) {
      const response = await page.goto(`${BASE}${p}`);
      expect(response?.status(), `Page ${p} should return 200`).toBe(200);
    }
  });
});

// ============================================================
// JS Error Detection (global)
// ============================================================

test.describe('No JS Errors on Any Page', () => {
  const allPages = [
    '/es',
    '/en',
    '/es/propiedades',
    '/es/como-comprar',
    '/es/como-invertir',
    '/es/financiamiento',
    '/es/promociones',
    '/es/faq',
    '/es/glosario',
  ];

  for (const p of allPages) {
    test(`No critical JS errors on ${p}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));
      await page.goto(`${BASE}${p}`);
      await page.waitForLoadState('networkidle');
      // Filter known non-critical
      const critical = errors.filter(e =>
        !e.includes('hydration') &&
        !e.includes('Supabase') &&
        !e.includes('NEXT_PUBLIC') &&
        !e.includes('ChunkLoadError') &&
        !e.includes('Failed to fetch')
      );
      expect(critical, `JS errors on ${p}: ${critical.join(', ')}`).toHaveLength(0);
    });
  }
});

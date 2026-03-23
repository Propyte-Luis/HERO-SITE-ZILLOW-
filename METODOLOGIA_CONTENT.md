# Metodología Propyte — Contenido para la Web

## Sección 1: Hero / Intro

### ES
**¿Cómo calculamos todo esto?**
Propyte combina inteligencia artificial, datos de +140,000 propiedades de renta y métricas de ocupación real de plataformas como Airbnb para darte la foto más completa del mercado inmobiliario en México. No opinamos — medimos.

### EN
**How do we calculate all of this?**
Propyte combines artificial intelligence, data from 140,000+ rental properties, and real occupancy metrics from platforms like Airbnb to give you the most complete picture of Mexico's real estate market. We don't guess — we measure.

---

## Sección 2: De dónde vienen los datos

### ES
**Nuestras Fuentes**

| Fuente | Qué extraemos | Frecuencia |
|--------|--------------|------------|
| Airbnb, Booking y plataformas de renta vacacional | Ocupación real, tarifa por noche (ADR), estacionalidad | Quincenal |
| Inmuebles24, Lamudi, MercadoLibre y 5 portales más | Precios de renta residencial y vacacional, m², zona | Semanal |
| Listas de precios de desarrolladores | Precios de venta, tipologías, disponibilidad | Continuo |

**+10,000 comparables activos** después de limpieza de datos.
**59 ciudades** y **782 zonas** analizadas en la Riviera Maya y Yucatán.

### EN
**Our Data Sources**

| Source | What we extract | Frequency |
|--------|----------------|-----------|
| Airbnb, Booking and vacation rental platforms | Real occupancy, nightly rate (ADR), seasonality | Biweekly |
| Inmuebles24, Lamudi, MercadoLibre and 5+ portals | Residential and vacation rental prices, m², zone | Weekly |
| Developer price lists | Sale prices, unit types, availability | Ongoing |

**10,000+ active comparables** after data cleaning.
**59 cities** and **782 zones** analyzed across the Riviera Maya and Yucatán.

---

## Sección 3: Cómo estimamos la renta

### ES
**Estimación de Renta con IA**

1. **Recopilamos** miles de rentas activas de 8+ portales inmobiliarios
2. **Limpiamos** los datos con un pipeline de 6 etapas que elimina:
   - Precios de venta que aparecen como renta
   - Áreas incorrectas (1m² o terrenos de 10,000m²)
   - Listings duplicados entre portales
   - Valores estadísticamente atípicos por zona
3. **Entrenamos** un modelo de Machine Learning (Gradient Boosting) que aprende la relación entre renta y las características de la propiedad: ubicación, zona, m², recámaras, tipo y amueblado
4. **Usamos la mediana**, no el promedio. Un penthouse de $200,000/mes no infla la estimación de tu departamento de 2 recámaras

**¿Qué tan preciso es?**
Nuestro modelo tiene un error promedio de ~$9,600 MXN. Para una renta de $25,000, eso significa ±38%. Estamos continuamente mejorando la precisión con más datos y mejor limpieza.

> *Nota: Las estimaciones son orientativas. El precio real depende de acabados, amueblado, temporada y negociación.*

### EN
**AI-Powered Rental Estimation**

1. **We collect** thousands of active rental listings from 8+ real estate portals
2. **We clean** the data with a 6-stage pipeline that removes:
   - Sale prices misclassified as rentals
   - Incorrect areas (1m² defaults or 10,000m² lot sizes)
   - Duplicate listings across portals
   - Statistical outliers per zone
3. **We train** a Machine Learning model (Gradient Boosting) that learns the relationship between rent and property characteristics: location, zone, m², bedrooms, type, and furnishing
4. **We use the median**, not the average. A $200,000/month penthouse doesn't inflate the estimate for your 2-bedroom apartment

**How accurate is it?**
Our model has an average error of ~$9,600 MXN. For a $25,000 rent, that means ±38%. We're continuously improving accuracy with more data and better cleaning.

> *Note: Estimates are for guidance only. Actual rent depends on finishes, furnishing, season, and negotiation.*

---

## Sección 4: Cómo calculamos el retorno de inversión

### ES
**Métricas Financieras**

Calculamos el retorno de dos formas independientes:

**Renta Residencial (largo plazo)**
- Ocupación: 95% (11.4 meses/año)
- Gastos: 20% (mantenimiento, predial, seguros)
- Sin comisiones de plataforma

**Renta Vacacional (Airbnb)**
- Ocupación: **dato real de AirDNA** por ciudad (no un número inventado)
- Gastos: 35% (limpieza, amenidades, consumibles)
- Comisión Airbnb: 3%
- Administrador de propiedad: 15%

| Métrica | Qué significa | Cómo se calcula |
|---------|---------------|-----------------|
| **Yield Bruto** | Ingreso anual / precio de compra | (renta mensual × ocupación × 12) / precio |
| **Yield Neto** | Lo mismo pero descontando gastos | Yield bruto × (1 - gastos - comisiones) |
| **Cap Rate** | Retorno neto sobre el valor total | Igual al yield neto (sin financiamiento) |
| **Cash-on-Cash** | Retorno sobre TU dinero (enganche) | Flujo neto anual / enganche |
| **ROI Anual** | Retorno total incluyendo plusvalía | (flujo neto + apreciación) / enganche |
| **IRR (TIR)** | Tasa interna de retorno a 5 o 10 años | Considera flujos, apreciación y venta |
| **Breakeven** | Meses para recuperar tu enganche | Enganche / flujo mensual neto |
| **RevPAR** | Ingreso por noche disponible | ADR × ocupación |

### EN
**Financial Metrics**

We calculate returns in two independent ways:

**Residential Rental (long-term)**
- Occupancy: 95% (11.4 months/year)
- Expenses: 20% (maintenance, property tax, insurance)
- No platform fees

**Vacation Rental (Airbnb)**
- Occupancy: **real AirDNA data** per city (not a made-up number)
- Expenses: 35% (cleaning, amenities, consumables)
- Airbnb commission: 3%
- Property manager: 15%

| Metric | What it means | How it's calculated |
|--------|---------------|---------------------|
| **Gross Yield** | Annual income / purchase price | (monthly rent × occupancy × 12) / price |
| **Net Yield** | Same but minus expenses | Gross yield × (1 - expenses - fees) |
| **Cap Rate** | Net return on total value | Same as net yield (no financing) |
| **Cash-on-Cash** | Return on YOUR money (down payment) | Annual net flow / down payment |
| **Annual ROI** | Total return including appreciation | (net flow + appreciation) / down payment |
| **IRR** | Internal rate of return at 5 or 10 years | Considers cash flows, appreciation and sale |
| **Breakeven** | Months to recover your down payment | Down payment / monthly net flow |
| **RevPAR** | Revenue per available night | ADR × occupancy |

---

## Sección 5: Zone Intelligence Score

### ES
**Zone Intelligence Score (0-100)**

Un número que resume qué tan atractiva es una zona para invertir. Combina 5 factores:

| Factor | Peso | Qué mide |
|--------|------|----------|
| 🏦 Rentabilidad | 30% | Yield neto de los desarrollos en la zona |
| 🏨 Ocupación | 25% | % de noches ocupadas (dato real de plataformas) |
| 📈 Crecimiento de tarifa | 20% | Cambio mes a mes en el ADR |
| 🏗️ Nivel de competencia | 15% | Menos listings = menos competencia = mejor score |
| 💧 Liquidez | 10% | Cantidad de comparables (más datos = más confianza) |

**¿Cómo se normaliza?**
Cada factor se escala de 0 a 100 comparando contra todas las zonas de la misma ciudad. Un score de 75 significa que esa zona está en el top 25% de su ciudad en el factor compuesto.

**¿Cada cuánto se actualiza?**
Semanalmente, de forma automática.

### EN
**Zone Intelligence Score (0-100)**

A single number that summarizes how attractive a zone is for investment. It combines 5 factors:

| Factor | Weight | What it measures |
|--------|--------|------------------|
| 🏦 Yield | 30% | Net rental yield of developments in the zone |
| 🏨 Occupancy | 25% | % of nights booked (real platform data) |
| 📈 Rate Growth | 20% | Month-over-month ADR change |
| 🏗️ Competition | 15% | Fewer listings = less competition = higher score |
| 💧 Liquidity | 10% | Number of comparables (more data = more confidence) |

**How is it normalized?**
Each factor is scaled 0-100 by comparing against all zones in the same city. A score of 75 means that zone is in the top 25% of its city on the composite factor.

**How often is it updated?**
Weekly, automatically.

---

## Sección 6: Estacionalidad y Pronósticos

### ES
**Estacionalidad**
Descomponemos 36 meses de datos históricos para extraer el patrón estacional de cada zona. El resultado es un factor multiplicativo por mes:
- **>1.0** = temporada alta (más ocupación/tarifa que el promedio)
- **<1.0** = temporada baja

Ejemplo Zona Hotelera Cancún: Febrero = 1.16× (temporada alta), Septiembre = 0.82× (temporada baja).

**Pronósticos**
Usamos modelos AutoARIMA para proyectar ocupación y tarifa 6 meses adelante, con intervalos de confianza del 90%. No es una bola de cristal — es la mejor estimación estadística con los datos disponibles.

### EN
**Seasonality**
We decompose 36 months of historical data to extract the seasonal pattern for each zone. The result is a multiplicative factor per month:
- **>1.0** = high season (more occupancy/rate than average)
- **<1.0** = low season

Example Cancun Hotel Zone: February = 1.16× (high season), September = 0.82× (low season).

**Forecasts**
We use AutoARIMA models to project occupancy and rates 6 months ahead, with 90% confidence intervals. It's not a crystal ball — it's the best statistical estimate with available data.

---

## Sección 7: Limpieza de Datos (transparencia)

### ES
**¿Cómo garantizamos la calidad?**

Antes de que cualquier dato entre a nuestros modelos, pasa por 6 filtros automáticos:

1. **Rango de precio**: Eliminamos rentas menores a $2,000 (probablemente semanales) y mayores a $500,000 (probablemente precios de venta)
2. **Área válida**: Descartamos áreas menores a 15m² (dato faltante) y mayores a 800m² (terreno total, no construido)
3. **Renta por m² coherente**: Si el precio/m² es menor a $20 o mayor a $2,000, algo está mal
4. **Recámaras razonables**: Máximo 10 recámaras por unidad
5. **Outliers por zona**: Dentro de cada zona, eliminamos valores que se desvían más de 2.5× del rango intercuartil
6. **Deduplicación**: El mismo departamento aparece en Lamudi, Inmuebles24 y MercadoLibre — lo contamos una sola vez

**Resultado**: De ~14,000 listings scrapeados, ~10,000 pasan todos los filtros. Preferimos tener menos datos pero confiables.

### EN
**How do we ensure data quality?**

Before any data enters our models, it passes through 6 automatic filters:

1. **Price range**: We remove rents below $2,000 (likely weekly rates) and above $500,000 (likely sale prices)
2. **Valid area**: We discard areas below 15m² (missing data) and above 800m² (total lot size, not built)
3. **Coherent rent/m²**: If price/m² is below $20 or above $2,000, something is wrong
4. **Reasonable bedrooms**: Maximum 10 bedrooms per unit
5. **Zone-level outliers**: Within each zone, we remove values that deviate more than 2.5× from the interquartile range
6. **Deduplication**: The same apartment appears on Lamudi, Inmuebles24 and MercadoLibre — we count it only once

**Result**: From ~14,000 scraped listings, ~10,000 pass all filters. We prefer less data that's reliable.

---

## Sección 8: Disclaimer legal

### ES
> Las estimaciones, scores y proyecciones presentadas en Propyte son orientativas y no constituyen asesoría financiera, fiscal ni legal. Los rendimientos pasados no garantizan resultados futuros. Las cifras se basan en datos de mercado disponibles al momento del cálculo y pueden variar. Consulta a un profesional antes de tomar decisiones de inversión.

### EN
> The estimates, scores and projections presented on Propyte are for guidance only and do not constitute financial, tax or legal advice. Past returns do not guarantee future results. Figures are based on market data available at the time of calculation and may vary. Consult a professional before making investment decisions.

---

## Notas de implementación

### Dónde usar cada sección:
- **Tooltips**: Versión corta (Sección 1) — hover sobre cada métrica
- **Página /metodologia**: Secciones 2-8 completas
- **Footer de componentes**: "¿Cómo calculamos esto?" link a /metodologia
- **Property detail**: Sección 4 resumida debajo del InvestmentSummary
- **Zone pages**: Sección 5 en el panel de score
- **Rental estimate**: Sección 3 como expandible "Ver metodología"

### Tono:
- Directo, sin marketing fluff
- Honesto sobre limitaciones ("±38% error", "no es una bola de cristal")
- Números concretos, no adjetivos
- La transparencia genera más confianza que la perfección

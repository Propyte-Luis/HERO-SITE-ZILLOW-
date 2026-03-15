'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Briefcase, Monitor, Brain, Percent, Palette, GraduationCap,
  Building2, Users, DollarSign, Award, ChevronDown, ChevronUp,
  CheckCircle, ArrowRight, MessageCircle, Star, Zap,
  ClipboardCheck, Rocket, Handshake, BarChart3, Shield
} from 'lucide-react';
import { submitForm } from '@/lib/submitForm';

// ─────────────────────────────────────────────────────
// 1. HERO
// ─────────────────────────────────────────────────────
function BrokerHero() {
  const t = useTranslations('brokers');
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0D1B2A] via-[#1E3A5F] to-[#0D1B2A]">
      {/* Decorative orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#00B4C8]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00B4C8]/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1E3A5F]/40 rounded-full blur-3xl" />

      <div className="relative max-w-[1280px] mx-auto px-4 md:px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00B4C8]/15 rounded-full mb-6">
            <Handshake size={16} className="text-[#00B4C8]" />
            <span className="text-[#00B4C8] text-sm font-semibold tracking-wide uppercase">Partner Program</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
            {t('heroSubtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#registro"
              className="h-14 px-8 bg-[#00B4C8] hover:bg-[#009AB0] text-white font-bold text-base rounded-xl transition-all hover:shadow-lg hover:shadow-[#00B4C8]/20 flex items-center justify-center gap-2"
            >
              {t('heroCta')} <ArrowRight size={18} />
            </a>
            <a
              href="https://wa.me/521234567890?text=Hola%2C%20me%20interesa%20el%20programa%20de%20corredores"
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 px-8 bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-base rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} /> {t('heroWhatsapp')}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-8 md:gap-12">
            {[
              { value: t('stat1Value'), label: t('stat1Label') },
              { value: t('stat2Value'), label: t('stat2Label') },
              { value: t('stat3Value'), label: t('stat3Label') },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-[#00B4C8]">{stat.value}</div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 2. TRUST BAR
// ─────────────────────────────────────────────────────
function TrustBar() {
  const t = useTranslations('brokers');
  const stats = [
    { icon: Building2, value: t('trustStat1Value'), label: t('trustStat1Label') },
    { icon: Users, value: t('trustStat2Value'), label: t('trustStat2Label') },
    { icon: DollarSign, value: t('trustStat3Value'), label: t('trustStat3Label') },
    { icon: Award, value: t('trustStat4Value'), label: t('trustStat4Label') },
  ];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#00B4C8]/10 rounded-xl flex items-center justify-center">
                <Icon size={24} className="text-[#00B4C8]" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-[#1E3A5F]">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 3. VALUE PROPOSITION
// ─────────────────────────────────────────────────────
function ValueProposition() {
  const t = useTranslations('brokers');
  const cards = [
    { icon: Briefcase, title: t('value1Title'), desc: t('value1Desc') },
    { icon: Monitor, title: t('value2Title'), desc: t('value2Desc') },
    { icon: Brain, title: t('value3Title'), desc: t('value3Desc') },
    { icon: Percent, title: t('value4Title'), desc: t('value4Desc') },
    { icon: Palette, title: t('value5Title'), desc: t('value5Desc') },
    { icon: GraduationCap, title: t('value6Title'), desc: t('value6Desc') },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-[#00B4C8] text-sm font-bold tracking-widest uppercase">{t('valueTitle')}</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[#1E3A5F]">{t('valueSubtitle')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-[#00B4C8]/20 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-[#00B4C8]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#00B4C8]/20 transition-colors">
                <Icon size={24} className="text-[#00B4C8]" />
              </div>
              <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 4. HOW IT WORKS
// ─────────────────────────────────────────────────────
function HowItWorks() {
  const t = useTranslations('brokers');
  const steps = [
    { num: '01', icon: ClipboardCheck, title: t('step1Title'), desc: t('step1Desc') },
    { num: '02', icon: Handshake, title: t('step2Title'), desc: t('step2Desc') },
    { num: '03', icon: Rocket, title: t('step3Title'), desc: t('step3Desc') },
    { num: '04', icon: Zap, title: t('step4Title'), desc: t('step4Desc') },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F4F6F8]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F]">{t('processTitle')}</h2>
          <p className="mt-3 text-gray-500 text-lg">{t('processSubtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} className="relative bg-white p-6 rounded-2xl text-center">
              <div className="w-10 h-10 mx-auto mb-4 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{num}</span>
              </div>
              <Icon size={32} className="mx-auto mb-3 text-[#00B4C8]" />
              <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 5. EARNINGS POTENTIAL
// ─────────────────────────────────────────────────────
function EarningsPotential() {
  const t = useTranslations('brokers');
  const tiers = [
    { title: t('tier1Title'), range: t('tier1Range'), desc: t('tier1Desc'), icon: Users, highlight: false },
    { title: t('tier2Title'), range: t('tier2Range'), desc: t('tier2Desc'), icon: Building2, highlight: true },
    { title: t('tier3Title'), range: t('tier3Range'), desc: t('tier3Desc'), icon: BarChart3, highlight: false },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#0D1B2A]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t('earningsTitle')}</h2>
          <p className="mt-3 text-white/50 text-lg">{t('earningsSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map(({ title, range, desc, icon: Icon, highlight }) => (
            <div
              key={title}
              className={`p-8 rounded-2xl border transition-all ${
                highlight
                  ? 'bg-[#00B4C8]/10 border-[#00B4C8]/30 scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <Icon size={32} className={highlight ? 'text-[#00B4C8] mb-4' : 'text-white/40 mb-4'} />
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <div className="text-3xl font-bold text-[#F5A623] mb-4">{range}</div>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              {highlight && (
                <div className="mt-4 inline-flex items-center gap-1 text-[#00B4C8] text-sm font-semibold">
                  <Star size={14} className="fill-current" /> Most popular
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 6. TESTIMONIALS
// ─────────────────────────────────────────────────────
function Testimonials() {
  const t = useTranslations('brokers');
  const testimonials = [
    { name: t('testimonial1Name'), role: t('testimonial1Role'), quote: t('testimonial1Quote'), initial: 'C' },
    { name: t('testimonial2Name'), role: t('testimonial2Role'), quote: t('testimonial2Quote'), initial: 'A' },
    { name: t('testimonial3Name'), role: t('testimonial3Role'), quote: t('testimonial3Quote'), initial: 'D' },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] text-center mb-12">
          {t('trustTitle')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, quote, initial }) => (
            <div key={name} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-[#F5A623] fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E3A5F] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{initial}</span>
                </div>
                <div>
                  <div className="font-bold text-[#1E3A5F] text-sm">{name}</div>
                  <div className="text-gray-400 text-xs">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 7. PLATFORM PREVIEW
// ─────────────────────────────────────────────────────
function PlatformPreview() {
  const t = useTranslations('brokers');
  const features = [
    t('platformFeature1'), t('platformFeature2'),
    t('platformFeature3'), t('platformFeature4'),
  ];

  return (
    <section className="py-16 md:py-20 bg-[#F4F6F8]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F]">{t('platformTitle')}</h2>
          <p className="mt-3 text-gray-500 text-lg">{t('platformSubtitle')}</p>
        </div>

        {/* Browser chrome mockup */}
        <div className="max-w-4xl mx-auto bg-[#1E3A5F] rounded-2xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#162D47]">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
            <div className="ml-4 flex-1 h-7 bg-white/10 rounded-md flex items-center px-3">
              <span className="text-white/40 text-xs">app.propyte.com/dashboard</span>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {features.map((feat, i) => (
                <div key={feat} className="bg-white/10 rounded-xl p-4">
                  <div className="text-[#00B4C8] text-2xl font-bold mb-1">
                    {i === 0 ? '700+' : i === 1 ? '24' : i === 2 ? '$180K' : '156'}
                  </div>
                  <div className="text-white/60 text-xs">{feat}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                  <div className="w-10 h-10 bg-[#00B4C8]/20 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-white/20 rounded w-3/4 mb-2" />
                    <div className="h-2 bg-white/10 rounded w-1/2" />
                  </div>
                  <div className="px-3 py-1 bg-[#00B4C8]/20 rounded-full">
                    <span className="text-[#00B4C8] text-xs font-bold">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 8. FAQ
// ─────────────────────────────────────────────────────
function FAQ() {
  const t = useTranslations('brokers');
  const [open, setOpen] = useState<number | null>(null);

  const faqs = Array.from({ length: 8 }, (_, i) => ({
    q: t(`faq${i + 1}Q`),
    a: t(`faq${i + 1}A`),
  }));

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] text-center mb-12">
          {t('faqTitle')}
        </h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#1E3A5F] pr-4">{q}</span>
                {open === i
                  ? <ChevronUp size={20} className="text-[#00B4C8] flex-shrink-0" />
                  : <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                }
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-4">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 9. BROKER FORM
// ─────────────────────────────────────────────────────
function BrokerForm() {
  const t = useTranslations('brokers');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '',
    brokerType: '', experience: '', focusArea: '', message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    setStatus('sending');
    try {
      const result = await submitForm(formData, 'broker_registration');
      setStatus(result.success ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const inputClass = "w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm focus:border-[#00B4C8] focus:ring-2 focus:ring-[#00B4C8]/20 outline-none transition-colors";
  const selectClass = `${inputClass} appearance-none`;
  const labelClass = "block text-sm font-semibold text-[#1E3A5F] mb-1.5";

  return (
    <section id="registro" className="py-16 md:py-20 bg-gradient-to-br from-[#0D1B2A] via-[#1E3A5F] to-[#0D1B2A]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('formTitle')}</h2>
            <p className="text-white/60 text-lg mb-8">{t('formSubtitle')}</p>

            <div className="space-y-4">
              {[
                { icon: Shield, text: 'Sin costo de inscripcion ni mensualidad' },
                { icon: Zap, text: 'Acceso inmediato al inventario completo' },
                { icon: Users, text: 'Account Manager dedicado' },
                { icon: CheckCircle, text: 'Comisiones en 48 horas' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#00B4C8]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#00B4C8]" />
                  </div>
                  <span className="text-white/70 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-2">{t('formSuccess')}</h3>
                <p className="text-gray-500">{t('formSuccessDesc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t('formName')} *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t('formEmail')} *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t('formPhone')} *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{t('formCompany')}</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t('formBrokerType')}</label>
                    <select name="brokerType" value={formData.brokerType} onChange={handleChange} className={selectClass}>
                      <option value="">--</option>
                      <option value="independent">{t('formBrokerTypeOptions.independent')}</option>
                      <option value="smallAgency">{t('formBrokerTypeOptions.smallAgency')}</option>
                      <option value="largeAgency">{t('formBrokerTypeOptions.largeAgency')}</option>
                      <option value="international">{t('formBrokerTypeOptions.international')}</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{t('formExperience')}</label>
                    <select name="experience" value={formData.experience} onChange={handleChange} className={selectClass}>
                      <option value="">--</option>
                      <option value="0-1">{t('formExperienceOptions.0-1')}</option>
                      <option value="1-3">{t('formExperienceOptions.1-3')}</option>
                      <option value="3-5">{t('formExperienceOptions.3-5')}</option>
                      <option value="5+">{t('formExperienceOptions.5+')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>{t('formFocusArea')}</label>
                  <select name="focusArea" value={formData.focusArea} onChange={handleChange} className={selectClass}>
                    <option value="">--</option>
                    <option value="rivieraMaya">{t('formFocusAreaOptions.rivieraMaya')}</option>
                    <option value="yucatan">{t('formFocusAreaOptions.yucatan')}</option>
                    <option value="both">{t('formFocusAreaOptions.both')}</option>
                    <option value="other">{t('formFocusAreaOptions.other')}</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>{t('formMessage')}</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={3} className={`${inputClass} h-auto py-3`} />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full h-14 bg-[#00B4C8] hover:bg-[#009AB0] text-white font-bold text-base rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? t('formSending') : t('formSubmit')}
                  {status === 'idle' && <ArrowRight size={18} />}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center">{t('formError')}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// 10. FINAL CTA
// ─────────────────────────────────────────────────────
function FinalCTA() {
  const t = useTranslations('brokers');
  return (
    <section className="bg-[#00B4C8]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-12 md:py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('finalCtaTitle')}</h2>
        <p className="text-white/80 text-lg mb-8">{t('finalCtaSubtitle')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#registro"
            className="h-14 px-8 bg-white text-[#00B4C8] font-bold text-base rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            {t('finalCtaButton')} <ArrowRight size={18} />
          </a>
          <a
            href="https://wa.me/521234567890?text=Hola%2C%20me%20interesa%20el%20programa%20de%20corredores"
            target="_blank"
            rel="noopener noreferrer"
            className="h-14 px-8 bg-[#25D366] text-white font-bold text-base rounded-xl hover:bg-[#1EBE57] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// PAGE COMPOSITION
// ─────────────────────────────────────────────────────
export default function BrokersPageContent() {
  return (
    <div>
      <BrokerHero />
      <TrustBar />
      <ValueProposition />
      <HowItWorks />
      <EarningsPotential />
      <Testimonials />
      <PlatformPreview />
      <FAQ />
      <BrokerForm />
      <FinalCTA />
    </div>
  );
}

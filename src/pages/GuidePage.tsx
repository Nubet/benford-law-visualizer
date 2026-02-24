import React, { useState, lazy, Suspense } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpenText,
  Info,
  ChartBar,
  TrendUp,
  WarningCircle,
  ChartPie,
  Target,
  ArrowRight,
  Calculator
} from '@phosphor-icons/react';
const GuideChart = lazy(() => import('../components/charts/GuideChart'));

const benfordIdeal = [
  { digit: 1, freq: 30.1 },
  { digit: 2, freq: 17.6 },
  { digit: 3, freq: 12.5 },
  { digit: 4, freq: 9.7 },
  { digit: 5, freq: 7.9 },
  { digit: 6, freq: 6.7 },
  { digit: 7, freq: 5.8 },
  { digit: 8, freq: 5.1 },
  { digit: 9, freq: 4.6 },
];

export const GuidePage: React.FC = () => {
  const navigate = useNavigate();
  const [checkValue, setCheckValue] = useState('');

  const firstDigitChar = checkValue.replace(/^0+/, '').replace(/[^1-9]/g, '')[0];
  const digit = firstDigitChar ? parseInt(firstDigitChar) : null;
  const probability = digit ? Math.log10(1 + 1 / digit) * 100 : 0;

  return (
    <LazyMotion features={domAnimation}>
      <div className="max-w-7xl mx-auto py-16 pb-32 space-y-32">
        <HeroSection
          checkValue={checkValue}
          onChangeCheckValue={setCheckValue}
          digit={digit}
          probability={probability}
        />
        <StorySection />
        <PracticalSection />
        <ConstraintsSection />
        <FinalCta onStart={() => navigate('/upload')} />
      </div>
    </LazyMotion>
  );
};

const HeroSection: React.FC<{
  checkValue: string;
  onChangeCheckValue: (value: string) => void;
  digit: number | null;
  probability: number;
}> = ({ checkValue, onChangeCheckValue, digit, probability }) => (
  <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
    <m.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="lg:col-span-7 space-y-8"
    >
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-(--brand-primary)/10 rounded-2xl text-(--brand-primary) border border-(--brand-primary)/20 shadow-sm">
        <BookOpenText size={24} weight="duotone" />
        <span className="text-tiny font-bold uppercase tracking-[0.2em]">Validated Methodology</span>
      </div>
      <h1 className="text-display md:text-[5rem] mb-6 text-(--text-primary)">
        Unmasking <br />
        <span className="text-(--text-tertiary) italic">Fabrication.</span>
      </h1>
      <p className="text-title text-(--text-secondary) max-w-xl font-medium leading-relaxed">
        Discover the mathematical architecture used by forensic auditors to detect systemic data manipulation.
      </p>
    </m.div>

    <m.div
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="lg:col-span-5 hidden lg:block"
    >
      <div className="glass-panel p-10 relative overflow-hidden group h-full flex flex-col">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-(--brand-primary)/5 rounded-full blur-3xl" />

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h3 className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-widest mb-1">Interactive Check</h3>
            <div className="text-large font-bold text-(--text-primary) tracking-tight">Probability Engine</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-(--brand-primary)/10 flex items-center justify-center text-(--brand-primary) shrink-0">
            <Calculator size={24} weight="duotone" />
          </div>
        </div>

        <div className="space-y-6 flex-1 relative z-10">
          <div className="space-y-2">
            <label className="text-tiny font-bold text-(--text-secondary) uppercase tracking-wide">Enter Any Number</label>
            <div className="relative group">
              <input
                type="text"
                value={checkValue}
                onChange={(e) => onChangeCheckValue(e.target.value)}
                placeholder="e.g. 1,250.00"
                className="w-full bg-(--bg-base) border border-(--border-low) rounded-xl px-4 py-3 text-body font-mono text-(--text-primary) placeholder-(--text-tertiary) focus:outline-none focus:border-(--brand-primary) transition-all font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-tertiary) opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-tiny font-bold">↵</span>
              </div>
            </div>
          </div>

          <div className="bg-(--bg-base) rounded-2xl p-5 border border-(--border-low)">
            <div className="flex justify-between items-end mb-3">
              <span className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-wide">Natural Frequency</span>
              <span className="text-header font-mono font-bold text-(--brand-primary) tracking-tight">
                {digit ? `${probability.toFixed(1)}%` : '—'}
              </span>
            </div>

            <div className="h-2 w-full bg-(--bg-surface) rounded-full overflow-hidden mb-4">
              <m.div
                className="h-full bg-(--brand-primary)"
                initial={{ width: 0 }}
                animate={{ width: digit ? `${probability}%` : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>

            <div className="flex items-start gap-3">
              <Info size={16} weight="duotone" className="text-(--text-tertiary) shrink-0 mt-0.5" />
              <p className="text-caption text-(--text-secondary) leading-relaxed font-medium">
                {digit
                  ? <span>Numbers starting with <strong className="text-(--text-primary)">{digit}</strong> naturally occur in <strong className="text-(--text-primary)">~{Math.round(probability)}%</strong> of unmanipulated records.</span>
                  : 'Type a value to calculate its natural probability based on the leading digit.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  </section>
);

const StorySection = () => (
  <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
    <div className="lg:col-span-5 order-2 lg:order-1 glass-panel p-12 relative overflow-hidden shadow-premium">
      <div className="absolute inset-0 bg-linear-to-br from-(--brand-primary)/5 to-transparent" />
      <h3 className="text-header font-bold text-(--text-primary) mb-8 flex items-center gap-3 tracking-tight">
        <ChartPie size={24} weight="duotone" className="text-(--brand-primary)" />
        Logarithmic Distribution
      </h3>
      <Suspense fallback={<div className="h-75 w-full" />}>
        <GuideChart data={benfordIdeal} />
      </Suspense>
      <p className="mt-8 text-tiny text-center text-(--text-tertiary) font-bold uppercase tracking-[0.3em]">
        Probability Density of First Digits
      </p>
    </div>

    <div className="lg:col-span-7 order-1 lg:order-2 space-y-10">
      <div className="flex items-center gap-3 text-(--brand-primary) font-bold uppercase tracking-[0.3em] text-tiny">
        <Info size={16} weight="bold" />
        <span>The Origin Story</span>
      </div>
      <h2 className="text-title font-bold text-(--text-primary) tracking-tighter leading-none italic">The Case of the Dusty Logarithms</h2>
      <div className="space-y-6 text-(--text-secondary) text-body font-medium leading-relaxed">
        <p>
          In 1881, astronomer Simon Newcomb noticed a peculiar anomaly: the first pages of logarithm books (containing numbers starting with 1) were significantly more worn and soiled than the later pages.
        </p>
        <p>
          Frank Benford later validated this observation across 20 distinct datasets. He discovered that in natural number sets, the digit 1 appears as the leader in approximately 30% of cases, while the digit 9 appears in less than 5%.
        </p>
      </div>
      <div className="pt-8">
        <div className="relative bg-(--bg-surface) border border-(--border-low) rounded-2xl p-8 overflow-hidden group hover:border-(--brand-primary)/30 transition-colors">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-(--brand-primary)/5 rounded-full blur-3xl group-hover:bg-(--brand-primary)/10 transition-colors duration-500" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="flex items-center gap-4 text-(--text-primary) font-serif text-3xl md:text-4xl tracking-wide select-none">
              <span>
                <span className="italic">P</span>
                <span className="text-(--text-secondary)">(</span>
                <span className="italic">d</span>
                <span className="text-(--text-secondary)">)</span>
              </span>

              <span className="text-(--text-tertiary) font-light">=</span>

              <span className="flex items-baseline">
                log
                <span className="text-sm text-(--text-tertiary) ml-0.5 translate-y-1">10</span>
              </span>

              <div className="flex items-center gap-1">
                <span className="text-(--text-secondary) text-4xl font-light">(</span>
                <span>1</span>
                <span className="text-(--text-tertiary) font-light">+</span>
                <div className="flex flex-col items-center justify-center mx-1">
                  <span className="text-xl leading-none border-b border-(--text-primary) w-full text-center pb-0.5 mb-0.5">1</span>
                  <span className="text-xl leading-none italic pt-0.5">d</span>
                </div>
                <span className="text-(--text-secondary) text-4xl font-light">)</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <div className="h-px w-8 bg-(--border-low)" />
              <p className="text-tiny font-bold text-(--text-tertiary) uppercase tracking-widest">The Fundamental Law</p>
              <div className="h-px w-8 bg-(--border-low)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PracticalSection = () => (
  <section className="space-y-16">
    <div className="flex flex-col items-center text-center">
      <h2 className="text-large font-bold text-(--text-primary) tracking-tighter mb-4">Real-World Applications</h2>
      <p className="text-secondary text-(--text-secondary) font-medium max-w-2xl">Benford’s Law appears surprisingly often in data that spans multiple orders of magnitude. Here is where it works best.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard
        icon={TrendUp}
        title="Fraud Detection"
        description="Humans are bad at inventing random numbers. When someone manually falsifies invoices or tax records, they rarely match the expected distribution."
      />
      <FeatureCard
        icon={Target}
        title="Financial Markets"
        description="Trading volumes and stock prices usually align with the curve. Major deviations can sometimes highlight reporting errors or manipulation."
      />
      <FeatureCard
        icon={ChartBar}
        title="Natural Sciences"
        description="From river lengths to atomic masses and urban populations - the mathematical substrate of reality remains consistent."
      />
    </div>
  </section>
);

const ConstraintsSection = () => (
  <section className="glass-panel p-12 md:p-20 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-150 h-150 bg-(--brand-primary)/3 rounded-full blur-[120px] pointer-events-none" />

    <div className="max-w-4xl mx-auto space-y-12 relative z-10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-3 text-anomaly-medium font-bold uppercase tracking-[0.3em] text-tiny bg-anomaly-medium/5 px-4 py-2 rounded-2xl border border-anomaly-medium/10 shadow-inner">
          <WarningCircle size={20} weight="bold" />
          <span>Critical Boundaries</span>
        </div>

        <h2 className="text-display font-bold text-(--text-primary) tracking-tighter leading-none">
          Not a Verdict, <br />
          <span className="text-(--text-tertiary) italic">But a Compass.</span>
        </h2>

        <div className="space-y-6 text-(--text-secondary) text-body font-medium leading-relaxed max-w-2xl">
          <p>
            Benford's Law is a probabilistic indicator, not a judicial sentence. A "failed" analysis signals an anomaly worthy of investigation, not necessarily proof of manipulation.
          </p>
          <p>
            Reality is messy. Legitimate operational factors-like psychological pricing ($9.99), policy thresholds, or pre-negotiated contract values-can naturally skew distribution. The algorithm identifies <em className="text-(--text-primary) not-italic">where</em> to look, but human expertise is required to understand <em className="text-(--text-primary) not-italic">why</em> the numbers deviate.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-(--border-low)/50">
        {[
          { title: 'Sample Size', text: 'Requires 100+ records for statistical relevance.', icon: ChartBar },
          { title: 'Artificial Bounds', text: 'Inaccurate for constrained sets (e.g. human height, PINs).', icon: WarningCircle },
          { title: 'ID Sequences', text: 'Invoice numbers or serial codes are not natural data.', icon: Target }
        ].map((item) => (
          <div key={item.title} className="group p-6 rounded-2xl bg-(--bg-base)/50 border border-(--border-low) hover:border-(--brand-primary)/30 transition-colors">
            <div className="mb-4 text-(--text-tertiary) group-hover:text-(--brand-primary) transition-colors">
              <item.icon size={24} weight="duotone" />
            </div>
            <h4 className="text-secondary font-bold text-(--text-primary) mb-2">{item.title}</h4>
            <p className="text-caption text-(--text-secondary) leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FinalCta: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <section className="flex flex-col items-center text-center space-y-10 py-20">
    <h2 className="text-title font-bold text-(--text-primary) tracking-tighter">Ready to Verify Reality?</h2>
    <m.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onStart}
      className="group flex items-center gap-6 px-14 py-6 bg-(--brand-primary) hover:bg-(--brand-hover) text-(--brand-text) rounded-full font-bold transition-all shadow-sm"
    >
      <span className="text-body font-bold">Initialize Algorithm</span>
      <ArrowRight size={28} weight="bold" className="group-hover:translate-x-2 transition-transform" />
    </m.button>
  </section>
);

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <m.div
    whileHover={{ y: -10 }}
    className="glass-panel p-10 relative overflow-hidden group h-full flex flex-col"
  >
    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-(--text-tertiary)/5 rounded-full blur-2xl group-hover:bg-(--brand-primary)/5 transition-colors" />
    <div className="w-16 h-16 bg-(--bg-surface) rounded-3xl flex items-center justify-center mb-10 border border-(--border-low) text-(--text-tertiary) group-hover:text-(--brand-primary) group-hover:scale-110 transition-all duration-500 shadow-lg">
      <Icon size={32} weight="duotone" />
    </div>
    <h3 className="text-header font-bold text-(--text-primary) mb-4 tracking-tight leading-none">{title}</h3>
    <p className="text-(--text-secondary) text-body font-medium leading-relaxed flex-1">{description}</p>
  </m.div>
);

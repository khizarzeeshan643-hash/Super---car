import { useState } from 'react';
import { ArrowLeft, Bookmark, Check, Maximize2, Scale } from 'lucide-react';
import { CarMonograph, UnitSystem } from '../types/car';
import {
  formatAcceleration,
  formatAccelerationLabel,
  formatCurrencyUsd,
  formatPower,
  formatPowerToWeight,
  formatTopSpeed,
  formatTorque,
  formatWeight,
} from '../utils/units';
import { LightboxItem } from './LightboxModal';
import { PowerCurveChart } from './PowerCurveChart';
import { ResilientImage } from './ResilientImage';

interface MonographDetailViewProps {
  car: CarMonograph;
  unitSystem: UnitSystem;
  onChangeUnitSystem: (u: UnitSystem) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isInCompare: boolean;
  onToggleCompare: (id: string) => void;
  onBack: () => void;
  onOpenLightbox: (items: LightboxItem[], startIndex: number) => void;
  onSelectCar: (car: CarMonograph) => void;
  relatedCars: CarMonograph[];
}

type SpecTab = 'powertrain' | 'performance' | 'chassis' | 'production';

export function MonographDetailView({
  car,
  unitSystem,
  onChangeUnitSystem,
  isSaved,
  onToggleSave,
  isInCompare,
  onToggleCompare,
  onBack,
  onOpenLightbox,
  onSelectCar,
  relatedCars,
}: MonographDetailViewProps) {
  const [activeSpecTab, setActiveSpecTab] = useState<SpecTab>('powertrain');

  const galleryItems: LightboxItem[] = car.gallery.map((photo) => ({
    ...photo,
    vehicleTitle: `${car.make} ${car.model}`,
  }));

  const specRowsByTab: Record<SpecTab, Array<{ label: string; value: string }>> = {
    powertrain: [
      { label: 'Engine Configuration', value: car.specs.engineLayout },
      { label: 'Aspiration / Induction', value: car.specs.induction },
      { label: 'Displacement', value: `${car.specs.displacementCc.toLocaleString()} cc` },
      { label: 'Bore × Stroke', value: car.specs.boreStrokeMm },
      { label: 'Compression Ratio', value: car.specs.compressionRatio },
      {
        label: 'Peak Power Output',
        value: `${formatPower(car.specs.powerPs, unitSystem)} @ ${car.specs.powerRpm.toLocaleString()} rpm`,
      },
      {
        label: 'Peak Torque',
        value: `${formatTorque(car.specs.torqueNm, unitSystem)} @ ${car.specs.torqueRpm.toLocaleString()} rpm`,
      },
      { label: 'Maximum Engine Speed', value: `${car.specs.redlineRpm.toLocaleString()} rpm` },
      { label: 'Transmission', value: car.specs.transmission },
      { label: 'Driven Wheels', value: car.specs.drivetrain },
    ],
    performance: [
      { label: formatAccelerationLabel(unitSystem), value: formatAcceleration(car.specs, unitSystem) },
      { label: '0–200 km/h (0–124 mph)', value: `${car.specs.zeroToTwoHundredSec.toFixed(1)} s` },
      { label: 'Maximum Speed', value: formatTopSpeed(car.specs.topSpeedKmh, unitSystem) },
      {
        label: 'Power-to-Weight Ratio',
        value: formatPowerToWeight(car.specs.powerPs, car.specs.dryWeightKg, unitSystem),
      },
      { label: 'Drag Coefficient', value: car.specs.dragCoefficient },
      { label: 'Peak Downforce', value: car.specs.peakDownforceKg },
    ],
    chassis: [
      { label: 'Monocoque Architecture', value: car.specs.chassisArchitecture },
      { label: 'Suspension Geometry', value: car.specs.suspensionFrontRear },
      { label: 'Braking System', value: car.specs.brakingSystem },
      { label: 'Wheel & Tire Package', value: car.specs.tyresFrontRear },
      { label: 'Dry Kerb Weight', value: formatWeight(car.specs.dryWeightKg, unitSystem) },
    ],
    production: [
      { label: 'Wheelbase', value: `${car.specs.wheelbaseMm.toLocaleString()} mm` },
      { label: 'Overall Length', value: `${car.specs.lengthMm.toLocaleString()} mm` },
      { label: 'Country of Origin', value: `${car.city}, ${car.country}` },
      { label: 'Production Allocation', value: car.specs.productionUnits },
      { label: 'Factory Launch MSRP', value: formatCurrencyUsd(car.specs.launchPriceUsd) },
      { label: 'Market Valuation Note', value: car.specs.valuationNote },
    ],
  };

  return (
    <article className="pb-20">
      {/* Sub-navigation Action Bar */}
      <div className="border-b border-[#E5E2DC] bg-[#F5F3EE]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#141416] hover:text-[#C81E1E] transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dispatches
          </button>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric / Imperial Toggle */}
            <div
              className="inline-flex items-center p-1 bg-[#E7E4DC] rounded-md"
              role="group"
              aria-label="Measurement unit system"
            >
              <button
                type="button"
                onClick={() => onChangeUnitSystem('metric')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                  unitSystem === 'metric'
                    ? 'bg-white text-[#141416] shadow-xs'
                    : 'text-[#5C5954] hover:text-[#141416]'
                }`}
              >
                Metric
              </button>
              <button
                type="button"
                onClick={() => onChangeUnitSystem('imperial')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                  unitSystem === 'imperial'
                    ? 'bg-white text-[#141416] shadow-xs'
                    : 'text-[#5C5954] hover:text-[#141416]'
                }`}
              >
                Imperial
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleCompare(car.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                isInCompare
                  ? 'bg-[#141416] text-white border-[#141416]'
                  : 'bg-white text-[#141416] border-[#D5D0C7] hover:border-[#141416]'
              }`}
            >
              {isInCompare ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
              {isInCompare ? 'In Comparison' : 'Compare Specs'}
            </button>

            <button
              type="button"
              onClick={() => onToggleSave(car.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                isSaved
                  ? 'bg-[#C81E1E] text-white border-[#C81E1E]'
                  : 'bg-white text-[#141416] border-[#D5D0C7] hover:border-[#C81E1E]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved in Garage' : 'Save Monograph'}
            </button>
          </div>
        </div>
      </div>

      {/* Monograph Header */}
      <header className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#666460]">
          <span className="font-medium text-[#C81E1E]">{car.issueNumber}</span>
          <span aria-hidden="true">·</span>
          <span>
            {car.city}, {car.country}
          </span>
          <span aria-hidden="true">·</span>
          <span>{car.publishedDate}</span>
          <span aria-hidden="true">·</span>
          <span>{car.readTimeMinutes} min read</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-[#141416] leading-[1.1] mt-4 max-w-4xl text-balance">
          {car.make} {car.model}: {car.headline}
        </h1>

        <p className="text-base sm:text-lg text-[#4A4843] leading-relaxed mt-5 max-w-3xl">
          {car.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-7 pt-6 border-t border-[#E5E2DC] text-sm text-[#55534E]">
          <div>
            <span className="font-semibold text-[#141416]">{car.author}</span>
            <span className="mx-2 text-[#B8B3AA]">·</span>
            <span>{car.authorRole}</span>
          </div>
          <div className="font-mono text-xs tabular-nums text-[#55534E]">
            Launch Price {formatCurrencyUsd(car.specs.launchPriceUsd)} · {car.specs.productionUnits}
          </div>
        </div>
      </header>

      {/* Primary Hero Photograph */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="relative group rounded-lg overflow-hidden bg-[#141416] border border-[#E5E2DC]">
          <button
            type="button"
            onClick={() => onOpenLightbox(galleryItems, 0)}
            className="block w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E]"
            aria-label={`Open full-screen photo viewer for ${car.make} ${car.model}`}
          >
            <div className="aspect-video w-full overflow-hidden">
              <ResilientImage
                src={car.heroPhoto.src}
                alt={car.heroPhoto.alt}
                fallbackTitle={`${car.make} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              />
            </div>
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/75 text-white text-xs font-medium backdrop-blur-xs">
              <Maximize2 className="w-3.5 h-3.5" />
              Inspect Plate ({car.gallery.length} Photos)
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 text-xs text-[#666460]">
          <p className="font-serif italic text-sm text-[#4A4843]">{car.heroPhoto.caption}</p>
          <p className="font-mono tabular-nums shrink-0">
            {car.heroPhoto.exif.camera} · {car.heroPhoto.exif.focalLength} ·{' '}
            {car.heroPhoto.exif.aperture}
          </p>
        </div>
      </section>

      {/* 4-Column Key Performance Strip */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-[#E5E2DC] rounded-lg divide-y lg:divide-y-0 lg:divide-x divide-[#E5E2DC]">
          <div className="p-5">
            <p className="text-xs text-[#666460]">Peak Output</p>
            <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141416] tabular-nums mt-1">
              {formatPower(car.specs.powerPs, unitSystem)}
            </p>
            <p className="text-xs text-[#666460] mt-1 font-mono tabular-nums">
              @ {car.specs.powerRpm.toLocaleString()} rpm
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs text-[#666460]">{formatAccelerationLabel(unitSystem)}</p>
            <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141416] tabular-nums mt-1">
              {formatAcceleration(car.specs, unitSystem)}
            </p>
            <p className="text-xs text-[#666460] mt-1 font-mono tabular-nums">
              0–200 km/h in {car.specs.zeroToTwoHundredSec.toFixed(1)} s
            </p>
          </div>
          <div className="p-5">
            <p className="text-xs text-[#666460]">Top Velocity</p>
            <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141416] tabular-nums mt-1">
              {formatTopSpeed(car.specs.topSpeedKmh, unitSystem)}
            </p>
            <p className="text-xs text-[#666460] mt-1">{car.specs.dragCoefficient}</p>
          </div>
          <div className="p-5">
            <p className="text-xs text-[#666460]">Dry Kerb Mass</p>
            <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141416] tabular-nums mt-1">
              {formatWeight(car.specs.dryWeightKg, unitSystem)}
            </p>
            <p className="text-xs text-[#666460] mt-1 font-mono tabular-nums">
              {formatPowerToWeight(car.specs.powerPs, car.specs.dryWeightKg, unitSystem)}
            </p>
          </div>
        </div>
      </section>

      {/* Pattern D: 70 / 30 Asymmetric Reading Canvas */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Main Essay Column (70%) */}
          <div className="lg:col-span-8">
            <p className="text-base sm:text-[17px] text-[#232220] leading-[1.8] max-w-prose first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9] first-letter:text-[#141416]">
              {car.leadParagraph}
            </p>

            {/* Editorial Pull Quote (Hairline top & bottom dividers, zero border-l-4) */}
            <blockquote className="my-10 py-7 border-y border-[#DEDAD2] max-w-prose">
              <p className="font-serif italic text-2xl sm:text-[1.65rem] leading-snug text-[#141416]">
                “{car.pullQuote.quote}”
              </p>
              <footer className="mt-3 text-xs font-medium text-[#666460]">
                — {car.pullQuote.attribution}
              </footer>
            </blockquote>

            <div className="space-y-10 max-w-prose">
              {car.sections.map((section, idx) => (
                <div key={section.heading}>
                  <h2 className="font-serif text-2xl font-semibold text-[#141416] tracking-tight mb-4">
                    0{idx + 1}. {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-base sm:text-[17px] text-[#2B2A27] leading-[1.8]"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-5 border-t border-[#E5E2DC] max-w-prose">
              <p className="text-xs text-[#666460] leading-relaxed">
                Archival Note: {car.footnote}
              </p>
            </div>
          </div>

          {/* Right Margin Notes & Engineering Provenance (30%) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border border-[#E5E2DC] rounded-lg p-6">
              <h3 className="font-serif text-lg font-semibold text-[#141416] pb-3 border-b border-[#EFECE6]">
                Engineering Dossier
              </h3>
              <dl className="divide-y divide-[#EFECE6] text-sm mt-2">
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#666460]">Atelier</dt>
                  <dd className="font-medium text-[#141416] text-right">
                    {car.city}, {car.country}
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#666460]">Engine</dt>
                  <dd className="font-medium text-[#141416] text-right max-w-[60%]">
                    {car.specs.engineLayout}
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#666460]">Redline</dt>
                  <dd className="font-mono font-medium text-[#141416] tabular-nums">
                    {car.specs.redlineRpm.toLocaleString()} rpm
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#666460]">Torque</dt>
                  <dd className="font-mono font-medium text-[#141416] tabular-nums">
                    {formatTorque(car.specs.torqueNm, unitSystem)}
                  </dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#666460]">Production</dt>
                  <dd className="font-medium text-[#141416] text-right">
                    {car.specs.productionUnits}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-[#666460] text-xs mb-1">Collector Valuation</dt>
                  <dd className="text-xs text-[#2B2A27] leading-relaxed">
                    {car.specs.valuationNote}
                  </dd>
                </div>
              </dl>
            </div>

            {car.sections
              .filter((s) => s.marginNote)
              .map((s) => (
                <div
                  key={s.marginNote!.title}
                  className="bg-[#F4F1EA] border border-[#E5E2DC] rounded-lg p-5"
                >
                  <h4 className="font-serif text-base font-semibold text-[#141416]">
                    {s.marginNote!.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A4843] leading-relaxed mt-2">
                    {s.marginNote!.body}
                  </p>
                </div>
              ))}
          </aside>
        </div>
      </section>

      {/* Curated Photo Gallery Strip for this Monograph */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-16 pt-12 border-t border-[#E5E2DC]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141416]">
              Curated Photography Plates
            </h2>
            <p className="text-sm text-[#666460] mt-1">
              Select any frame to inspect full-resolution detail and camera EXIF telemetry.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenLightbox(galleryItems, 0)}
            className="text-sm font-medium text-[#C81E1E] hover:underline cursor-pointer self-start sm:self-auto"
          >
            Open Fullscreen Slideshow
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {car.gallery.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => onOpenLightbox(galleryItems, index)}
              className="group text-left bg-white border border-[#E5E2DC] rounded-lg overflow-hidden hover:border-[#B8B3AA] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#141416]">
                <ResilientImage
                  src={photo.src}
                  alt={photo.alt}
                  fallbackTitle={photo.figureNumber}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2 text-xs text-[#666460]">
                  <span className="font-mono font-medium text-[#141416]">{photo.figureNumber}</span>
                  <span className="font-mono tabular-nums truncate">{photo.exif.camera}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#383633] leading-relaxed mt-2 line-clamp-2">
                  {photo.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Complete Technical Specification Sheet & Dyno Curve */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-16 pt-12 border-t border-[#E5E2DC]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141416]">
              Complete Technical Specifications
            </h2>
            <p className="text-sm text-[#666460] mt-1">
              Factory engineering homologation figures and torque progression for the {car.make}{' '}
              {car.model}.
            </p>
          </div>

          <div
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EFECE6] rounded-lg"
            role="tablist"
            aria-label="Specification categories"
          >
            {(
              [
                { id: 'powertrain', label: 'Powertrain' },
                { id: 'performance', label: 'Performance' },
                { id: 'chassis', label: 'Chassis & Brakes' },
                { id: 'production', label: 'Dimensions & Value' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeSpecTab === tab.id}
                onClick={() => setActiveSpecTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeSpecTab === tab.id
                    ? 'bg-white text-[#141416] shadow-xs'
                    : 'text-[#55534E] hover:text-[#141416]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Specification Table */}
          <div className="lg:col-span-6 bg-white border border-[#E5E2DC] rounded-lg overflow-hidden">
            <dl className="divide-y divide-[#EFECE6]">
              {specRowsByTab[activeSpecTab].map((row) => (
                <div
                  key={row.label}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-6"
                >
                  <dt className="text-xs sm:text-sm text-[#666460] shrink-0">{row.label}</dt>
                  <dd className="font-mono text-xs sm:text-sm font-medium text-[#141416] sm:text-right tabular-nums">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Interactive Dyno Curve */}
          <div className="lg:col-span-6">
            <PowerCurveChart
              points={car.powerCurve}
              redlineRpm={car.specs.redlineRpm}
              unitSystem={unitSystem}
              vehicleLabel={`${car.make} ${car.model}`}
            />
          </div>
        </div>
      </section>

      {/* Continue Reading */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-8 mt-16 pt-12 border-t border-[#E5E2DC]">
        <h2 className="font-serif text-2xl font-semibold text-[#141416] mb-6">
          Further Global Dispatches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedCars.slice(0, 3).map((rel) => (
            <button
              key={rel.id}
              type="button"
              onClick={() => onSelectCar(rel)}
              className="group text-left bg-white border border-[#E5E2DC] rounded-lg overflow-hidden hover:border-[#B8B3AA] transition-colors cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#141416]">
                <ResilientImage
                  src={rel.heroPhoto.src}
                  alt={rel.heroPhoto.alt}
                  fallbackTitle={`${rel.make} ${rel.model}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-[#666460]">
                  {rel.country} · {formatPower(rel.specs.powerPs, unitSystem)} ·{' '}
                  {rel.readTimeMinutes} min read
                </p>
                <h3 className="font-serif text-lg font-semibold text-[#141416] mt-1.5 group-hover:text-[#C81E1E] transition-colors">
                  {rel.make} {rel.model}
                </h3>
                <p className="text-xs text-[#55534E] mt-1.5 line-clamp-2">{rel.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

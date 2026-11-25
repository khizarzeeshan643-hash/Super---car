import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Maximize2, Search, X } from 'lucide-react';
import { GalleryShowcase } from './components/GalleryShowcase';
import { LightboxItem, LightboxModal } from './components/LightboxModal';
import { MonographDetailView } from './components/MonographDetailView';
import { ResilientImage } from './components/ResilientImage';
import { SavedGarageDrawer } from './components/SavedGarageDrawer';
import { SpecificationMatrix } from './components/SpecificationMatrix';
import { TopBar } from './components/TopBar';
import { CAR_MONOGRAPHS } from './data/cars';
import { CarMonograph, CarRegion, UnitSystem } from './types/car';
import {
  formatAcceleration,
  formatAccelerationLabel,
  formatCurrencyUsd,
  formatPower,
  formatPowerToWeight,
  formatTopSpeed,
  formatWeight,
} from './utils/units';

const REGIONS: CarRegion[] = [
  'All',
  'Italy',
  'France',
  'Sweden',
  'United Kingdom',
  'Germany',
  'Japan',
];

const STORAGE_SAVED_KEY = 'atelier_octane_saved_v1';
const STORAGE_UNITS_KEY = 'atelier_octane_units_v1';

export default function App() {
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<CarRegion>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('dispatches');
  const [garageOpen, setGarageOpen] = useState(false);

  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_UNITS_KEY);
      return saved === 'imperial' ? 'imperial' : 'metric';
    } catch {
      return 'metric';
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return ['pagani-utopia', 'gma-t50'];
  });

  const [compareIds, setCompareIds] = useState<string[]>([
    'pagani-utopia',
    'bugatti-tourbillon',
    'gma-t50',
  ]);

  const [lightboxState, setLightboxState] = useState<{
    items: LightboxItem[];
    startIndex: number;
  } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedIds));
    } catch {
      // Ignore storage error
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_UNITS_KEY, unitSystem);
    } catch {
      // Ignore storage error
    }
  }, [unitSystem]);

  const leadCar = CAR_MONOGRAPHS[0];

  const selectedCar = useMemo(
    () => CAR_MONOGRAPHS.find((c) => c.id === selectedCarId) ?? null,
    [selectedCarId]
  );

  const filteredDispatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CAR_MONOGRAPHS.filter((car) => {
      const matchesRegion = activeRegion === 'All' || car.region === activeRegion;
      if (!matchesRegion) return false;
      if (!q) return true;
      return (
        car.make.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.country.toLowerCase().includes(q) ||
        car.city.toLowerCase().includes(q) ||
        car.specs.engineLayout.toLowerCase().includes(q) ||
        car.headline.toLowerCase().includes(q)
      );
    });
  }, [activeRegion, searchQuery]);

  const savedCars = useMemo(
    () => CAR_MONOGRAPHS.filter((c) => savedIds.includes(c.id)),
    [savedIds]
  );

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSelectCar = (car: CarMonograph) => {
    setSelectedCarId(car.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (selectedCarId !== null) {
      setSelectedCarId(null);
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoHome = () => {
    setSelectedCarId(null);
    setActiveSection('dispatches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLightbox = (items: LightboxItem[], startIndex: number) => {
    setLightboxState({ items, startIndex });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#141416]">
      <TopBar
        activeSection={activeSection}
        savedCount={savedIds.length}
        onNavigateSection={handleNavigateSection}
        onOpenGarage={() => setGarageOpen(true)}
        onGoHome={handleGoHome}
      />

      <main className="flex-1">
        {selectedCar ? (
          <MonographDetailView
            car={selectedCar}
            unitSystem={unitSystem}
            onChangeUnitSystem={setUnitSystem}
            isSaved={savedIds.includes(selectedCar.id)}
            onToggleSave={toggleSave}
            isInCompare={compareIds.includes(selectedCar.id)}
            onToggleCompare={toggleCompare}
            onBack={() => setSelectedCarId(null)}
            onOpenLightbox={openLightbox}
            onSelectCar={handleSelectCar}
            relatedCars={CAR_MONOGRAPHS.filter((c) => c.id !== selectedCar.id)}
          />
        ) : (
          <>
            {/* Editorial Split Hero Section */}
            <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14 pb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                {/* Left Column: Typographic Hierarchy */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#666460]">
                      <span className="text-[#C81E1E]">{leadCar.issueNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {leadCar.city}, {leadCar.country}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{leadCar.publishedDate}</span>
                    </div>

                    <h1 className="font-serif text-[clamp(2.2rem,3.5vw,3.35rem)] font-semibold tracking-tight text-[#141416] leading-[1.08] mt-4 text-balance">
                      {leadCar.make} {leadCar.model}: {leadCar.headline}
                    </h1>

                    <p className="text-base sm:text-[17px] text-[#4A4843] leading-relaxed mt-5">
                      {leadCar.subtitle}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E5E2DC] flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleSelectCar(leadCar)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#141416] hover:bg-[#C81E1E] transition-colors duration-150 rounded-md whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E] focus-visible:ring-offset-2"
                    >
                      Read Monograph
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openLightbox(
                          leadCar.gallery.map((g) => ({
                            ...g,
                            vehicleTitle: `${leadCar.make} ${leadCar.model}`,
                          })),
                          0
                        )
                      }
                      className="px-4 py-2.5 text-sm font-medium text-[#141416] hover:text-[#C81E1E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      View Photo Plates ({leadCar.gallery.length})
                    </button>
                  </div>
                </div>

                {/* Right Column: Dominant Focal Photograph */}
                <div className="lg:col-span-7 flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleSelectCar(leadCar)}
                    className="group relative flex-1 min-h-[280px] sm:min-h-[380px] rounded-lg overflow-hidden bg-[#141416] border border-[#E5E2DC] cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E]"
                    aria-label={`Open ${leadCar.make} ${leadCar.model} monograph`}
                  >
                    <ResilientImage
                      src={leadCar.heroPhoto.src}
                      alt={leadCar.heroPhoto.alt}
                      fallbackTitle={`${leadCar.make} ${leadCar.model}`}
                      className="w-full h-full lg:h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(
                          leadCar.gallery.map((g) => ({
                            ...g,
                            vehicleTitle: `${leadCar.make} ${leadCar.model}`,
                          })),
                          0
                        );
                      }}
                      className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/75 text-white text-xs font-medium hover:bg-[#C81E1E] transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      Fullscreen Plate
                    </span>
                  </button>
                  <div className="flex items-center justify-between gap-4 mt-2.5 text-xs text-[#666460]">
                    <span className="font-serif italic truncate">
                      {leadCar.heroPhoto.caption}
                    </span>
                    <span className="font-mono tabular-nums shrink-0 hidden sm:inline">
                      {leadCar.heroPhoto.exif.camera} · {leadCar.heroPhoto.exif.focalLength}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4-Column Performance Telemetry Strip Below Hero Split */}
              <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-[#E5E2DC] rounded-lg divide-y lg:divide-y-0 lg:divide-x divide-[#E5E2DC] mt-10">
                <div className="p-5">
                  <p className="text-xs text-[#666460]">Peak Output</p>
                  <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141416] tabular-nums mt-1">
                    {formatPower(leadCar.specs.powerPs, unitSystem)}
                  </p>
                  <p className="text-xs text-[#666460] mt-1 font-mono tabular-nums">
                    Twin-Turbo 6.0L V12 @ {leadCar.specs.powerRpm.toLocaleString()} rpm
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#666460]">{formatAccelerationLabel(unitSystem)}</p>
                  <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141416] tabular-nums mt-1">
                    {formatAcceleration(leadCar.specs, unitSystem)}
                  </p>
                  <p className="text-xs text-[#666460] mt-1 font-mono tabular-nums">
                    7-Speed Xtrac Gated Manual
                  </p>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#666460]">Maximum Velocity</p>
                  <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141416] tabular-nums mt-1">
                    {formatTopSpeed(leadCar.specs.topSpeedKmh, unitSystem)}
                  </p>
                  <p className="text-xs text-[#666460] mt-1">Electronically Limited</p>
                </div>
                <div className="p-5">
                  <p className="text-xs text-[#666460]">Dry Kerb Mass</p>
                  <p className="font-mono text-xl sm:text-2xl font-semibold text-[#141416] tabular-nums mt-1">
                    {formatWeight(leadCar.specs.dryWeightKg, unitSystem)}
                  </p>
                  <p className="text-xs text-[#666460] mt-1 font-mono tabular-nums">
                    {formatPowerToWeight(
                      leadCar.specs.powerPs,
                      leadCar.specs.dryWeightKg,
                      unitSystem
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Dispatches & Global Archive Grid */}
            <section
              id="dispatches"
              className="max-w-[1380px] mx-auto px-4 sm:px-8 py-14 sm:py-16 border-t border-[#E5E2DC]"
            >
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                <div>
                  <p className="text-xs font-medium text-[#C81E1E]">International Archive</p>
                  <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#141416] mt-1.5 text-balance">
                    Global Hypercar Dispatches
                  </h2>
                  <p className="text-sm sm:text-base text-[#55534E] mt-2 max-w-2xl">
                    Field essays, collector valuations, and full engineering sheets from six nations.
                  </p>
                </div>

                {/* Search Box */}
                <div className="relative w-full lg:w-72">
                  <Search className="w-4 h-4 text-[#666460] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter make, country, or engine..."
                    aria-label="Filter automobiles by make, country, or engine"
                    className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-[#D5D0C7] rounded-md text-[#141416] placeholder:text-[#8C8881] focus:outline-none focus:border-[#141416]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search filter"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666460] hover:text-[#141416] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Region Filter Tabs */}
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 border-b border-[#E5E2DC]"
                role="tablist"
                aria-label="Filter dispatches by country"
              >
                {REGIONS.map((region) => {
                  const isActive = activeRegion === region;
                  return (
                    <button
                      key={region}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveRegion(region)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#141416] text-white'
                          : 'text-[#55534E] hover:text-[#141416] hover:bg-[#EFECE6]'
                      }`}
                    >
                      {region === 'All' ? 'All Countries' : region}
                    </button>
                  );
                })}
              </div>

              {filteredDispatches.length === 0 ? (
                <div className="bg-white border border-[#E5E2DC] rounded-lg p-12 text-center">
                  <p className="font-serif text-xl text-[#141416]">
                    No monographs match “{searchQuery}”
                  </p>
                  <p className="text-sm text-[#666460] mt-2">
                    Clear your filter or select All Countries to inspect the complete archive.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveRegion('All');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-4 py-2 text-xs font-medium text-white bg-[#141416] hover:bg-[#C81E1E] rounded-md transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredDispatches.map((car) => {
                    const isSaved = savedIds.includes(car.id);
                    return (
                      <article
                        key={car.id}
                        className="group bg-white border border-[#E5E2DC] rounded-lg overflow-hidden flex flex-col hover:border-[#B8B3AA] transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => handleSelectCar(car)}
                          className="block w-full aspect-[16/10] overflow-hidden bg-[#141416] cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E]"
                          aria-label={`Read monograph on ${car.make} ${car.model}`}
                        >
                          <ResilientImage
                            src={car.heroPhoto.src}
                            alt={car.heroPhoto.alt}
                            fallbackTitle={`${car.make} ${car.model}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </button>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Clean unboxed metadata with typographic separators */}
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#666460]">
                              <span className="font-medium text-[#141416]">{car.country}</span>
                              <span aria-hidden="true">·</span>
                              <span>{car.issueNumber}</span>
                              <span aria-hidden="true">·</span>
                              <span>{car.readTimeMinutes} min read</span>
                            </div>

                            <h3 className="mt-2.5">
                              <button
                                type="button"
                                onClick={() => handleSelectCar(car)}
                                className="font-serif text-xl sm:text-2xl font-semibold text-[#141416] group-hover:text-[#C81E1E] transition-colors text-left leading-snug cursor-pointer"
                              >
                                {car.make} {car.model}
                              </button>
                            </h3>

                            <p className="text-sm text-[#4A4843] leading-relaxed mt-2 line-clamp-2">
                              {car.subtitle}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-[#EFECE6]">
                            <dl className="grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <dt className="text-[#666460]">Output</dt>
                                <dd className="font-mono font-semibold text-[#141416] tabular-nums mt-0.5">
                                  {formatPower(car.specs.powerPs, unitSystem)}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-[#666460]">Top Speed</dt>
                                <dd className="font-mono font-semibold text-[#141416] tabular-nums mt-0.5">
                                  {formatTopSpeed(car.specs.topSpeedKmh, unitSystem)}
                                </dd>
                              </div>
                              <div>
                                <dt className="text-[#666460]">Launch MSRP</dt>
                                <dd className="font-mono font-semibold text-[#141416] tabular-nums mt-0.5">
                                  {formatCurrencyUsd(car.specs.launchPriceUsd)}
                                </dd>
                              </div>
                            </dl>

                            <div className="flex items-center justify-between gap-4 mt-5 pt-3.5 border-t border-[#EFECE6]">
                              <button
                                type="button"
                                onClick={() => handleSelectCar(car)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#141416] hover:text-[#C81E1E] transition-colors cursor-pointer"
                              >
                                Read Monograph
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => toggleSave(car.id)}
                                aria-label={
                                  isSaved
                                    ? `Remove ${car.make} ${car.model} from Saved Garage`
                                    : `Save ${car.make} ${car.model} to Saved Garage`
                                }
                                className={`inline-flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer ${
                                  isSaved
                                    ? 'text-[#C81E1E]'
                                    : 'text-[#666460] hover:text-[#141416]'
                                }`}
                              >
                                <Bookmark
                                  className="w-3.5 h-3.5"
                                  fill={isSaved ? 'currentColor' : 'none'}
                                />
                                {isSaved ? 'Saved' : 'Save'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Curated Photographic Exhibition */}
            <GalleryShowcase cars={CAR_MONOGRAPHS} onOpenLightbox={openLightbox} />

            {/* Global Homologation Ledger & Head-to-Head Comparator */}
            <SpecificationMatrix
              cars={CAR_MONOGRAPHS}
              unitSystem={unitSystem}
              onChangeUnitSystem={setUnitSystem}
              compareIds={compareIds}
              onToggleCompare={toggleCompare}
              onSelectCar={handleSelectCar}
            />
          </>
        )}
      </main>

      {/* Quiet Archival Editorial Footer */}
      <footer className="border-t border-[#E5E2DC] bg-[#FAF9F6] py-10">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#666460]">
          <div>
            <span className="font-serif text-base font-semibold text-[#141416] mr-3">
              Atelier Octane
            </span>
            <span>International Automotive Monographs &amp; Technical Archive</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavigateSection('dispatches')}
              className="hover:text-[#141416] transition-colors cursor-pointer"
            >
              Dispatches
            </button>
            <button
              type="button"
              onClick={() => handleNavigateSection('galleries')}
              className="hover:text-[#141416] transition-colors cursor-pointer"
            >
              Galleries
            </button>
            <button
              type="button"
              onClick={() => handleNavigateSection('specifications')}
              className="hover:text-[#141416] transition-colors cursor-pointer"
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => handleNavigateSection('compare')}
              className="hover:text-[#141416] transition-colors cursor-pointer"
            >
              Compare
            </button>
            <span>© 2026 Atelier Octane</span>
          </div>
        </div>
      </footer>

      {/* Saved Garage Drawer */}
      <SavedGarageDrawer
        open={garageOpen}
        savedCars={savedCars}
        unitSystem={unitSystem}
        onClose={() => setGarageOpen(false)}
        onSelectCar={handleSelectCar}
        onRemoveCar={toggleSave}
      />

      {/* Fullscreen Photo Lightbox */}
      {lightboxState && (
        <LightboxModal
          items={lightboxState.items}
          initialIndex={lightboxState.startIndex}
          onClose={() => setLightboxState(null)}
        />
      )}
    </div>
  );
}

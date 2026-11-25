import { Maximize2 } from 'lucide-react';
import { useState } from 'react';
import { CarMonograph } from '../types/car';
import { LightboxItem } from './LightboxModal';
import { ResilientImage } from './ResilientImage';

interface GalleryShowcaseProps {
  cars: CarMonograph[];
  onOpenLightbox: (items: LightboxItem[], startIndex: number) => void;
}

type GalleryFilter = 'all' | 'exterior' | 'craft';

export function GalleryShowcase({ cars, onOpenLightbox }: GalleryShowcaseProps) {
  const [filter, setFilter] = useState<GalleryFilter>('all');

  const exteriorPlates: LightboxItem[] = cars.map((car) => ({
    ...car.heroPhoto,
    vehicleTitle: `${car.make} ${car.model}`,
  }));

  const craftPlates: LightboxItem[] = [
    {
      ...cars[0].gallery[1],
      vehicleTitle: `${cars[0].make} ${cars[0].model} — Cabin Craft`,
    },
    {
      ...cars[0].gallery[2],
      vehicleTitle: `${cars[3].make} ${cars[3].model} — Powertrain Study`,
    },
    {
      ...cars[0].gallery[3],
      vehicleTitle: `${cars[2].make} ${cars[2].model} — Aerodynamic Diffuser`,
    },
  ];

  const visiblePlates =
    filter === 'exterior'
      ? exteriorPlates
      : filter === 'craft'
      ? craftPlates
      : [...exteriorPlates, ...craftPlates];

  return (
    <section
      id="galleries"
      className="max-w-[1380px] mx-auto px-4 sm:px-8 py-16 sm:py-20 border-t border-[#E5E2DC]"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-medium text-[#C81E1E]">Curated Photographic Exhibition</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#141416] mt-1.5 text-balance">
            Global Field Galleries &amp; Mechanical Studies
          </h2>
          <p className="text-sm sm:text-base text-[#55534E] mt-2 max-w-2xl">
            Shot on medium-format digital and rangefinder glass across Modena, Molsheim, Ängelholm,
            Surrey, Stuttgart, and Hakone. Click any plate for full EXIF telemetry.
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1 p-1 bg-[#EFECE6] rounded-lg self-start md:self-auto"
          role="group"
          aria-label="Filter gallery plates"
        >
          {(
            [
              { id: 'all', label: 'All Plates (9)' },
              { id: 'exterior', label: 'Location Shoots (6)' },
              { id: 'craft', label: 'Mechanical Craft (3)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#55534E] hover:text-[#141416]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media-First Bento / Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePlates.map((plate, idx) => {
          const isLeadPlate = filter === 'all' && idx === 0;
          return (
            <button
              key={`${plate.id}-${idx}`}
              type="button"
              onClick={() => onOpenLightbox(visiblePlates, idx)}
              className={`group relative text-left rounded-lg overflow-hidden bg-[#141416] border border-[#E5E2DC] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C81E1E] ${
                isLeadPlate ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              <div
                className={`w-full overflow-hidden ${
                  isLeadPlate ? 'aspect-[16/10] lg:h-full' : 'aspect-[16/10]'
                }`}
              >
                <ResilientImage
                  src={plate.src}
                  alt={plate.alt}
                  fallbackTitle={plate.vehicleTitle}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              {/* Measured Dark Contrast Scrim */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"
              />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-neutral-300 truncate">
                    {plate.location} · {plate.exif.camera}
                  </p>
                  <h3
                    className={`font-serif font-semibold text-white mt-1 ${
                      isLeadPlate ? 'text-xl sm:text-2xl' : 'text-lg'
                    }`}
                  >
                    {plate.vehicleTitle}
                  </h3>
                </div>
                <span className="shrink-0 w-9 h-9 rounded-md bg-white/15 text-white flex items-center justify-center group-hover:bg-[#C81E1E] transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

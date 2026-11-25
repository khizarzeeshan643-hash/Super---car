import { ArrowRight, Trash2, X } from 'lucide-react';
import { CarMonograph, UnitSystem } from '../types/car';
import { formatPower, formatTopSpeed } from '../utils/units';
import { ResilientImage } from './ResilientImage';

interface SavedGarageDrawerProps {
  open: boolean;
  savedCars: CarMonograph[];
  unitSystem: UnitSystem;
  onClose: () => void;
  onSelectCar: (car: CarMonograph) => void;
  onRemoveCar: (id: string) => void;
}

export function SavedGarageDrawer({
  open,
  savedCars,
  unitSystem,
  onClose,
  onSelectCar,
  onRemoveCar,
}: SavedGarageDrawerProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Saved Garage Collection"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF9F6] h-full border-l border-[#E5E2DC] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#E5E2DC] flex items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#141416]">Saved Garage</h2>
            <p className="text-xs text-[#666460] mt-0.5">
              {savedCars.length}{' '}
              {savedCars.length === 1 ? 'monograph archived' : 'monographs archived'} locally
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Saved Garage"
            className="p-2 rounded-md text-[#55534E] hover:text-[#141416] hover:bg-[#EFECE6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedCars.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-lg text-[#141416]">Your Saved Garage is empty</p>
              <p className="text-sm text-[#666460] mt-2 leading-relaxed">
                Bookmark any dispatch to build your personal reference archive of global engineering
                icons.
              </p>
            </div>
          ) : (
            savedCars.map((car) => (
              <div
                key={car.id}
                className="bg-white border border-[#E5E2DC] rounded-lg overflow-hidden"
              >
                <div className="aspect-[16/9] bg-[#141416]">
                  <ResilientImage
                    src={car.heroPhoto.src}
                    alt={car.heroPhoto.alt}
                    fallbackTitle={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#666460]">
                    {car.city}, {car.country} · {formatPower(car.specs.powerPs, unitSystem)} ·{' '}
                    {formatTopSpeed(car.specs.topSpeedKmh, unitSystem)}
                  </p>
                  <h3 className="font-serif text-lg font-semibold text-[#141416] mt-1">
                    {car.make} {car.model}
                  </h3>
                  <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#EFECE6]">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectCar(car);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C81E1E] hover:underline cursor-pointer"
                    >
                      Read Monograph
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveCar(car.id)}
                      aria-label={`Remove ${car.make} ${car.model} from Saved Garage`}
                      className="inline-flex items-center gap-1 text-xs text-[#666460] hover:text-[#141416] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { ArrowUpDown, Check, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { ResilientImage } from './ResilientImage';

interface SpecificationMatrixProps {
  cars: CarMonograph[];
  unitSystem: UnitSystem;
  onChangeUnitSystem: (u: UnitSystem) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectCar: (car: CarMonograph) => void;
}

type SortKey = 'power' | 'speed' | 'weight' | 'accel' | 'redline' | 'price';

export function SpecificationMatrix({
  cars,
  unitSystem,
  onChangeUnitSystem,
  compareIds,
  onToggleCompare,
  onSelectCar,
}: SpecificationMatrixProps) {
  const [sortKey, setSortKey] = useState<SortKey>('power');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedCars = useMemo(() => {
    const copy = [...cars];
    copy.sort((a, b) => {
      let diff = 0;
      switch (sortKey) {
        case 'power':
          diff = a.specs.powerPs - b.specs.powerPs;
          break;
        case 'speed':
          diff = a.specs.topSpeedKmh - b.specs.topSpeedKmh;
          break;
        case 'weight':
          diff = a.specs.dryWeightKg - b.specs.dryWeightKg;
          break;
        case 'accel':
          diff = a.specs.zeroToHundredSec - b.specs.zeroToHundredSec;
          break;
        case 'redline':
          diff = a.specs.redlineRpm - b.specs.redlineRpm;
          break;
        case 'price':
          diff = a.specs.launchPriceUsd - b.specs.launchPriceUsd;
          break;
      }
      return sortAsc ? diff : -diff;
    });
    return copy;
  }, [cars, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      // Lower is better for weight and acceleration
      setSortAsc(key === 'weight' || key === 'accel');
    }
  };

  const comparedCars = useMemo(
    () => cars.filter((c) => compareIds.includes(c.id)),
    [cars, compareIds]
  );

  // Best-in-selection calculations for comparison matrix
  const bestPower = comparedCars.length
    ? Math.max(...comparedCars.map((c) => c.specs.powerPs))
    : 0;
  const bestTopSpeed = comparedCars.length
    ? Math.max(...comparedCars.map((c) => c.specs.topSpeedKmh))
    : 0;
  const lightestWeight = comparedCars.length
    ? Math.min(...comparedCars.map((c) => c.specs.dryWeightKg))
    : 0;
  const fastestAccel = comparedCars.length
    ? Math.min(...comparedCars.map((c) => c.specs.zeroToHundredSec))
    : 0;
  const highestRedline = comparedCars.length
    ? Math.max(...comparedCars.map((c) => c.specs.redlineRpm))
    : 0;

  return (
    <div className="border-t border-[#E5E2DC] bg-[#F5F3EE]">
      {/* Global Technical Specification Ledger */}
      <section
        id="specifications"
        className="max-w-[1380px] mx-auto px-4 sm:px-8 py-16 sm:py-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-medium text-[#C81E1E]">Homologation Engineering Ledger</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#141416] mt-1.5 text-balance">
              Technical Performance Specifications
            </h2>
            <p className="text-sm sm:text-base text-[#55534E] mt-2 max-w-2xl">
              Verified powertrain, mass, and velocity telemetry across all six global ateliers.
              Sort any column or select up to three chassis for head-to-head comparison.
            </p>
          </div>

          <div
            className="inline-flex items-center p-1 bg-[#E5E2DC] rounded-lg self-start md:self-auto"
            role="group"
            aria-label="Toggle metric or imperial units"
          >
            <button
              type="button"
              onClick={() => onChangeUnitSystem('metric')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                unitSystem === 'metric'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#55534E] hover:text-[#141416]'
              }`}
            >
              Metric (PS · km/h · kg)
            </button>
            <button
              type="button"
              onClick={() => onChangeUnitSystem('imperial')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                unitSystem === 'imperial'
                  ? 'bg-white text-[#141416] shadow-xs'
                  : 'text-[#55534E] hover:text-[#141416]'
              }`}
            >
              Imperial (hp · mph · lbs)
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E2DC] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-[#E5E2DC] bg-[#FAF9F6] text-xs font-medium text-[#55534E]">
                  <th className="py-3.5 px-5">Automobile &amp; Origin</th>
                  <th className="py-3.5 px-4">Engine Architecture</th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('power')}
                      className="inline-flex items-center gap-1 hover:text-[#141416] cursor-pointer whitespace-nowrap"
                    >
                      Output
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('redline')}
                      className="inline-flex items-center gap-1 hover:text-[#141416] cursor-pointer whitespace-nowrap"
                    >
                      Redline
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('accel')}
                      className="inline-flex items-center gap-1 hover:text-[#141416] cursor-pointer whitespace-nowrap"
                    >
                      {formatAccelerationLabel(unitSystem)}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('speed')}
                      className="inline-flex items-center gap-1 hover:text-[#141416] cursor-pointer whitespace-nowrap"
                    >
                      Top Speed
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('weight')}
                      className="inline-flex items-center gap-1 hover:text-[#141416] cursor-pointer whitespace-nowrap"
                    >
                      Dry Mass
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('price')}
                      className="inline-flex items-center gap-1 hover:text-[#141416] cursor-pointer whitespace-nowrap"
                    >
                      Launch MSRP
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="py-3.5 px-5 text-right">Compare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFECE6] text-sm">
                {sortedCars.map((car) => {
                  const isCompared = compareIds.includes(car.id);
                  const compareDisabled = !isCompared && compareIds.length >= 3;

                  return (
                    <tr
                      key={car.id}
                      className="hover:bg-[#FAF9F6] transition-colors"
                    >
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          onClick={() => onSelectCar(car)}
                          className="text-left group cursor-pointer"
                        >
                          <span className="font-serif font-semibold text-[#141416] group-hover:text-[#C81E1E] transition-colors block">
                            {car.make} {car.model}
                          </span>
                          <span className="text-xs text-[#666460]">
                            {car.city}, {car.country}
                          </span>
                        </button>
                      </td>
                      <td className="py-4 px-4 text-xs text-[#4A4843] max-w-[210px]">
                        {car.specs.engineLayout}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs font-semibold text-[#141416] tabular-nums whitespace-nowrap">
                        {formatPower(car.specs.powerPs, unitSystem)}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#4A4843] tabular-nums whitespace-nowrap">
                        {car.specs.redlineRpm.toLocaleString()} rpm
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#141416] tabular-nums whitespace-nowrap">
                        {formatAcceleration(car.specs, unitSystem)}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#141416] tabular-nums whitespace-nowrap">
                        {formatTopSpeed(car.specs.topSpeedKmh, unitSystem)}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#4A4843] tabular-nums whitespace-nowrap">
                        {formatWeight(car.specs.dryWeightKg, unitSystem)}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-[#4A4843] tabular-nums whitespace-nowrap">
                        {formatCurrencyUsd(car.specs.launchPriceUsd)}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          disabled={compareDisabled}
                          onClick={() => onToggleCompare(car.id)}
                          title={
                            compareDisabled
                              ? 'Maximum of 3 automobiles can be compared at once'
                              : isCompared
                              ? 'Remove from comparison'
                              : 'Add to comparison'
                          }
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                            isCompared
                              ? 'bg-[#141416] text-white border-[#141416] cursor-pointer'
                              : compareDisabled
                              ? 'bg-[#F5F3EE] text-[#A39F97] border-[#E5E2DC] cursor-not-allowed'
                              : 'bg-white text-[#141416] border-[#D5D0C7] hover:border-[#C81E1E] cursor-pointer'
                          }`}
                        >
                          {isCompared ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Selected
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" /> Compare
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Head-to-Head Engineering Comparator */}
      <section
        id="compare"
        className="max-w-[1380px] mx-auto px-4 sm:px-8 pb-20 pt-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#141416]">
              Head-to-Head Chassis Comparator
            </h3>
            <p className="text-sm text-[#55534E] mt-1">
              Comparing {comparedCars.length} of 3 maximum vehicles. Toggle selections in the table
              above or choose directly below.
            </p>
          </div>
        </div>

        {/* Quick Vehicle Selector Strip */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {cars.map((car) => {
            const active = compareIds.includes(car.id);
            const disabled = !active && compareIds.length >= 3;
            return (
              <button
                key={car.id}
                type="button"
                disabled={disabled}
                onClick={() => onToggleCompare(car.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#141416] text-white border-[#141416] cursor-pointer'
                    : disabled
                    ? 'bg-white/50 text-[#A39F97] border-[#E5E2DC] cursor-not-allowed'
                    : 'bg-white text-[#141416] border-[#D5D0C7] hover:border-[#141416] cursor-pointer'
                }`}
              >
                {car.make} {car.model}
              </button>
            );
          })}
        </div>

        {comparedCars.length === 0 ? (
          <div className="bg-white border border-[#E5E2DC] rounded-lg p-10 text-center">
            <p className="font-serif text-xl text-[#141416]">No automobiles selected for comparison</p>
            <p className="text-sm text-[#666460] mt-2">
              Select two or three vehicles above to inspect side-by-side powertrain, mass, and
              aerodynamic figures.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E2DC] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#E5E2DC]">
                    <th className="p-5 w-52 text-xs font-medium text-[#666460] align-bottom">
                      Specification Metric
                    </th>
                    {comparedCars.map((car) => (
                      <th key={car.id} className="p-5 align-top border-l border-[#EFECE6]">
                        <div className="aspect-[16/9] w-full max-w-[240px] rounded overflow-hidden bg-[#141416] mb-3">
                          <ResilientImage
                            src={car.heroPhoto.src}
                            alt={car.heroPhoto.alt}
                            fallbackTitle={car.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectCar(car)}
                          className="font-serif text-lg font-semibold text-[#141416] hover:text-[#C81E1E] transition-colors text-left cursor-pointer"
                        >
                          {car.make} {car.model}
                        </button>
                        <p className="text-xs font-normal text-[#666460] mt-0.5">
                          {car.city}, {car.country}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] text-sm">
                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">Power Output</td>
                    {comparedCars.map((car) => {
                      const isBest = comparedCars.length > 1 && car.specs.powerPs === bestPower;
                      return (
                        <td
                          key={car.id}
                          className="px-5 py-3.5 border-l border-[#EFECE6] font-mono tabular-nums"
                        >
                          <span className={isBest ? 'font-semibold text-[#C81E1E]' : 'text-[#141416]'}>
                            {formatPower(car.specs.powerPs, unitSystem)}
                          </span>
                          {isBest && (
                            <span className="block font-sans text-[11px] font-medium text-[#C81E1E] mt-0.5">
                              Highest Output
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">Peak Torque</td>
                    {comparedCars.map((car) => (
                      <td
                        key={car.id}
                        className="px-5 py-3.5 border-l border-[#EFECE6] font-mono tabular-nums text-[#141416]"
                      >
                        {formatTorque(car.specs.torqueNm, unitSystem)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">Redline RPM</td>
                    {comparedCars.map((car) => {
                      const isBest =
                        comparedCars.length > 1 && car.specs.redlineRpm === highestRedline;
                      return (
                        <td
                          key={car.id}
                          className="px-5 py-3.5 border-l border-[#EFECE6] font-mono tabular-nums"
                        >
                          <span className={isBest ? 'font-semibold text-[#C81E1E]' : 'text-[#141416]'}>
                            {car.specs.redlineRpm.toLocaleString()} rpm
                          </span>
                          {isBest && (
                            <span className="block font-sans text-[11px] font-medium text-[#C81E1E] mt-0.5">
                              Highest Rev Ceiling
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">
                      {formatAccelerationLabel(unitSystem)}
                    </td>
                    {comparedCars.map((car) => {
                      const isBest =
                        comparedCars.length > 1 && car.specs.zeroToHundredSec === fastestAccel;
                      return (
                        <td
                          key={car.id}
                          className="px-5 py-3.5 border-l border-[#EFECE6] font-mono tabular-nums"
                        >
                          <span className={isBest ? 'font-semibold text-[#C81E1E]' : 'text-[#141416]'}>
                            {formatAcceleration(car.specs, unitSystem)}
                          </span>
                          {isBest && (
                            <span className="block font-sans text-[11px] font-medium text-[#C81E1E] mt-0.5">
                              Quickest Launch
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">Top Velocity</td>
                    {comparedCars.map((car) => {
                      const isBest =
                        comparedCars.length > 1 && car.specs.topSpeedKmh === bestTopSpeed;
                      return (
                        <td
                          key={car.id}
                          className="px-5 py-3.5 border-l border-[#EFECE6] font-mono tabular-nums"
                        >
                          <span className={isBest ? 'font-semibold text-[#C81E1E]' : 'text-[#141416]'}>
                            {formatTopSpeed(car.specs.topSpeedKmh, unitSystem)}
                          </span>
                          {isBest && (
                            <span className="block font-sans text-[11px] font-medium text-[#C81E1E] mt-0.5">
                              Highest V-Max
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">Dry Kerb Mass</td>
                    {comparedCars.map((car) => {
                      const isBest =
                        comparedCars.length > 1 && car.specs.dryWeightKg === lightestWeight;
                      return (
                        <td
                          key={car.id}
                          className="px-5 py-3.5 border-l border-[#EFECE6] font-mono tabular-nums"
                        >
                          <span className={isBest ? 'font-semibold text-[#C81E1E]' : 'text-[#141416]'}>
                            {formatWeight(car.specs.dryWeightKg, unitSystem)}
                          </span>
                          {isBest && (
                            <span className="block font-sans text-[11px] font-medium text-[#C81E1E] mt-0.5">
                              Lightest Chassis
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">Power-to-Weight</td>
                    {comparedCars.map((car) => (
                      <td
                        key={car.id}
                        className="px-5 py-3.5 border-l border-[#EFECE6] font-mono tabular-nums text-[#141416]"
                      >
                        {formatPowerToWeight(car.specs.powerPs, car.specs.dryWeightKg, unitSystem)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">Transmission</td>
                    {comparedCars.map((car) => (
                      <td
                        key={car.id}
                        className="px-5 py-3.5 border-l border-[#EFECE6] text-xs text-[#2B2A27]"
                      >
                        {car.specs.transmission}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 text-xs text-[#666460]">Production Allocation</td>
                    {comparedCars.map((car) => (
                      <td
                        key={car.id}
                        className="px-5 py-3.5 border-l border-[#EFECE6] text-xs text-[#2B2A27]"
                      >
                        {car.specs.productionUnits}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

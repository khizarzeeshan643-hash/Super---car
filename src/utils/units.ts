import { CarSpecSheet, UnitSystem } from '../types/car';

export function psToHp(ps: number): number {
  return Math.round(ps * 0.98632);
}

export function nmToLbFt(nm: number): number {
  return Math.round(nm * 0.737562);
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462);
}

export function kmhToMph(kmh: number): number {
  return Math.round(kmh * 0.621371);
}

export function formatPower(ps: number, unit: UnitSystem): string {
  if (unit === 'metric') {
    return `${ps.toLocaleString()} PS`;
  }
  return `${psToHp(ps).toLocaleString()} hp`;
}

export function formatTorque(nm: number, unit: UnitSystem): string {
  if (unit === 'metric') {
    return `${nm.toLocaleString()} Nm`;
  }
  return `${nmToLbFt(nm).toLocaleString()} lb-ft`;
}

export function formatWeight(kg: number, unit: UnitSystem): string {
  if (unit === 'metric') {
    return `${kg.toLocaleString()} kg`;
  }
  return `${kgToLbs(kg).toLocaleString()} lbs`;
}

export function formatTopSpeed(kmh: number, unit: UnitSystem): string {
  if (unit === 'metric') {
    return `${kmh} km/h`;
  }
  return `${kmhToMph(kmh)} mph`;
}

export function formatAcceleration(specs: CarSpecSheet, unit: UnitSystem): string {
  if (unit === 'metric') {
    return `${specs.zeroToHundredSec.toFixed(1)} s`;
  }
  return `${specs.zeroToSixtyMphSec.toFixed(1)} s`;
}

export function formatAccelerationLabel(unit: UnitSystem): string {
  return unit === 'metric' ? '0–100 km/h' : '0–60 mph';
}

export function formatPowerToWeight(ps: number, kg: number, unit: UnitSystem): string {
  if (unit === 'metric') {
    const ratio = (ps / (kg / 1000)).toFixed(0);
    return `${ratio} PS/tonne`;
  }
  const hp = psToHp(ps);
  const shortTons = kgToLbs(kg) / 2000;
  return `${(hp / shortTons).toFixed(0)} hp/ton`;
}

export function formatCurrencyUsd(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

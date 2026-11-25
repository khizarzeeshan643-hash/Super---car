export type UnitSystem = 'metric' | 'imperial';

export type CarRegion =
  | 'All'
  | 'Italy'
  | 'France'
  | 'Sweden'
  | 'United Kingdom'
  | 'Germany'
  | 'Japan';

export interface ExifData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutter: string;
  iso: number;
}

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  figureNumber: string;
  exif: ExifData;
}

export interface TorquePoint {
  rpm: number;
  powerPs: number;
  torqueNm: number;
}

export interface CarSpecSheet {
  engineLayout: string;
  induction: string;
  displacementCc: number;
  boreStrokeMm: string;
  compressionRatio: string;
  redlineRpm: number;
  powerPs: number;
  powerRpm: number;
  torqueNm: number;
  torqueRpm: number;
  transmission: string;
  drivetrain: string;
  chassisArchitecture: string;
  suspensionFrontRear: string;
  brakingSystem: string;
  tyresFrontRear: string;
  dryWeightKg: number;
  zeroToHundredSec: number;
  zeroToSixtyMphSec: number;
  zeroToTwoHundredSec: number;
  topSpeedKmh: number;
  dragCoefficient: string;
  peakDownforceKg: string;
  wheelbaseMm: number;
  lengthMm: number;
  productionUnits: string;
  launchPriceUsd: number;
  valuationNote: string;
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  marginNote?: {
    title: string;
    body: string;
  };
}

export interface CarMonograph {
  id: string;
  slug: string;
  issueNumber: string;
  make: string;
  model: string;
  headline: string;
  subtitle: string;
  region: Exclude<CarRegion, 'All'>;
  city: string;
  country: string;
  year: number;
  author: string;
  authorRole: string;
  publishedDate: string;
  readTimeMinutes: number;
  heroPhoto: GalleryPhoto;
  gallery: GalleryPhoto[];
  leadParagraph: string;
  pullQuote: {
    quote: string;
    attribution: string;
  };
  sections: ArticleSection[];
  footnote: string;
  specs: CarSpecSheet;
  powerCurve: TorquePoint[];
}

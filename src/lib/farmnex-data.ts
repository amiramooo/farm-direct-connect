export type Lot = {
  id: string;
  crop: string;
  initial: string;
  tone: "tomato" | "sun" | "leaf" | "sky";
  fpo: string;
  city: string;
  quantityKg: number;
  harvest: string;
  farmerPrice: number;
  logistics: number;
  retailPrice: number;
  demand: "High" | "Steady" | "Cooling";
  routeId: string;
  eta: string;
  stage: number; // 0..3 progress along Origin -> Collect -> Hub -> Buyer
};

export const lots: Lot[] = [
  {
    id: "FN-2043",
    crop: "Tomato",
    initial: "T",
    tone: "tomato",
    fpo: "Vijayvada FPO",
    city: "Hyderabad",
    quantityKg: 2000,
    harvest: "10 Sep",
    farmerPrice: 27,
    logistics: 3,
    retailPrice: 40,
    demand: "High",
    routeId: "R-118",
    eta: "12 Sep",
    stage: 2,
  },
  {
    id: "FN-2044",
    crop: "Onion",
    initial: "O",
    tone: "sun",
    fpo: "Siddipet Growers",
    city: "Nagpur",
    quantityKg: 15000,
    harvest: "08 Sep",
    farmerPrice: 24,
    logistics: 3,
    retailPrice: 38,
    demand: "Steady",
    routeId: "R-092",
    eta: "11 Sep",
    stage: 1,
  },
  {
    id: "FN-2045",
    crop: "Potato",
    initial: "P",
    tone: "leaf",
    fpo: "Sutlej Collective",
    city: "Ludhiana",
    quantityKg: 8000,
    harvest: "05 Sep",
    farmerPrice: 18,
    logistics: 2,
    retailPrice: 28,
    demand: "Cooling",
    routeId: "R-061",
    eta: "09 Sep",
    stage: 3,
  },
  {
    id: "FN-2046",
    crop: "Cauliflower",
    initial: "C",
    tone: "sky",
    fpo: "Ganga Farmers Union",
    city: "Kanpur",
    quantityKg: 3500,
    harvest: "12 Sep",
    farmerPrice: 22,
    logistics: 3,
    retailPrice: 34,
    demand: "High",
    routeId: "R-140",
    eta: "14 Sep",
    stage: 0,
  },
];

export type Forecast = {
  crop: string;
  current: number;
  predicted: number;
  note: string;
  tone: "tomato" | "leaf" | "sun";
};

export const forecasts: Forecast[] = [
  { crop: "Tomato", current: 10000, predicted: 12500, note: "+18% next week", tone: "tomato" },
  { crop: "Onion", current: 15000, predicted: 16000, note: "+7% stable", tone: "leaf" },
  { crop: "Potato", current: 8000, predicted: 7200, note: "-10% cooling", tone: "sun" },
  { crop: "Cauliflower", current: 4200, predicted: 5100, note: "+21% festival pull", tone: "tomato" },
];

export type PriceAdvice = {
  low: number;
  high: number;
  recommended: number;
  demand: string;
  buyers: number;
};

const base: Record<string, PriceAdvice> = {
  Tomato: { low: 22, high: 28, recommended: 26, demand: "High", buyers: 8 },
  Onion: { low: 20, high: 27, recommended: 24, demand: "Steady", buyers: 6 },
  Potato: { low: 14, high: 20, recommended: 17, demand: "Cooling", buyers: 4 },
  Cauliflower: { low: 18, high: 26, recommended: 23, demand: "High", buyers: 5 },
};

/** Simple transparent price-intelligence model used for the prototype. */
export function recommendPrice(crop: string, quantityKg: number, city: string): PriceAdvice {
  const b = base[crop] ?? { low: 15, high: 25, recommended: 20, demand: "Steady", buyers: 3 };
  const volumeAdjust = quantityKg > 5000 ? -1 : quantityKg < 500 ? 1 : 0;
  const cityAdjust = /hyderabad|mumbai|delhi|bengaluru/i.test(city) ? 1 : 0;
  const recommended = Math.max(b.low, Math.min(b.high, b.recommended + volumeAdjust + cityAdjust));
  return { ...b, recommended, buyers: b.buyers + (cityAdjust ? 2 : 0) };
}

export type MatchedFarmer = {
  name: string;
  city: string;
  distanceKm: number;
  match: number;
  price: number;
};

export function matchFarmers(crop: string, maxPrice: number): MatchedFarmer[] {
  const pool: MatchedFarmer[] = [
    { name: "Vijayvada FPO", city: "Hyderabad", distanceKm: 3, match: 98, price: 27 },
    { name: "Siddipet Growers", city: "Siddipet", distanceKm: 12, match: 86, price: 24 },
    { name: "Medak Farmer Union", city: "Medak", distanceKm: 41, match: 74, price: 22 },
    { name: "Sutlej Collective", city: "Ludhiana", distanceKm: 118, match: 61, price: 18 },
  ];
  return pool
    .filter((f) => f.price <= maxPrice)
    .map((f) => ({ ...f, match: Math.max(40, f.match - (crop === "Onion" ? 0 : 4)) }));
}

export type RouteStop = {
  label: string;
  detail: string;
  loadKg: number;
  done: boolean;
};

export const optimisedRoute: RouteStop[] = [
  { label: "Farmer A · Shamirpet", detail: "Pickup 06:10", loadKg: 500, done: true },
  { label: "Farmer B · Medchal", detail: "Pickup 07:05", loadKg: 700, done: true },
  { label: "Farmer C · Shameerpet", detail: "Pickup 07:50", loadKg: 400, done: false },
  { label: "Hyderabad Hub", detail: "Sorting 09:20", loadKg: 1600, done: false },
  { label: "Buyer · Banjara Hills", detail: "Drop 10:40", loadKg: 1600, done: false },
];

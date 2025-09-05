export type ProjectType = "Agroforestry" | "Rice" | "Mixed";

export interface ProjectInput {
  projectType: ProjectType;
  areaHa: number; // area in hectares
  crop: string;
  lat?: number;
  lon?: number;
}

export interface EstimationResult {
  co2Tons: number;
  credits: number;
  incomeINR: number;
  waterSavedKL: number;
  envScore: number; // 0-100
  communityImpact: number; // 0-100
}

export function estimate(input: ProjectInput): EstimationResult {
  const base = input.areaHa || 1;
  const typeFactor =
    input.projectType === "Agroforestry" ? 4.2 : input.projectType === "Rice" ? 1.8 : 2.6; // tCO2/ha/year
  const cropAdj = /rice|धान/i.test(input.crop) ? 1.2 : /wheat|गेहूं/i.test(input.crop) ? 0.9 : 1.0;
  const co2Tons = +(base * typeFactor * cropAdj).toFixed(2);
  const credits = +co2Tons.toFixed(2); // 1 credit ~= 1 tCO2e
  const price = 800; // INR per credit (demo)
  const incomeINR = +(credits * price).toFixed(0);
  const waterSavedKL = +(base * (input.projectType === "Rice" ? 120 : 60)).toFixed(1);
  const envScore = Math.min(100, Math.round(40 + typeFactor * 12));
  const communityImpact = Math.min(100, Math.round(30 + base * 8));
  return { co2Tons, credits, incomeINR, waterSavedKL, envScore, communityImpact };
}

export async function sha256Hex(data: unknown): Promise<string> {
  const str = typeof data === "string" ? data : JSON.stringify(data);
  const enc = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  const bytes = Array.from(new Uint8Array(hash));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

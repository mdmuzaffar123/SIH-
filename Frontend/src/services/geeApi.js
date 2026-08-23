import { geeLocations } from '../data/geeMockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function normalizeAnalysis(data) {
  const { location, solar, water, nightLights, vegetation, temperature } = data;
  return {
    name: location.name,
    state: location.state,
    coordinates: [location.latitude, location.longitude],
    solarPotential: solar.rating,
    waterStressLabel: water.rating,
    energyAccess: nightLights.priority,
    environmental: vegetation.rating,
    priority: data.overallPriority,
    summary: data.priorityReasons?.join('. ') || 'Satellite indicators are available for this location.',
    indicators: {
      solarPotential: solar.potential,
      waterStress: water.stressIndex,
      lowLightAreaKm2: nightLights.lowLightAreaKm2,
      ndvi: vegetation.ndvi,
      temperature: temperature.landSurfaceTemperature,
    },
  };
}

export async function getGeeAnalysis(location = 'Raipur') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gee/analysis?location=${encodeURIComponent(location)}&state=Chhattisgarh`);
    if (!response.ok) throw new Error('Backend unavailable');
    const payload = await response.json();
    return { ...payload, data: normalizeAnalysis(payload.data), source: 'Google Earth Engine' };
  } catch {
    const key = Object.keys(geeLocations).find((name) => name.toLowerCase() === location.trim().toLowerCase());
    if (!key) throw new Error('We could not find that location. Try a Chhattisgarh district.');
    return { success: true, data: geeLocations[key], source: 'Demo fallback', updatedAt: 'Demo data' };
  }
}

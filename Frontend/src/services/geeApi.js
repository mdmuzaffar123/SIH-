const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      rainfallMm: water.rainfallMm,
      lowLightAreaKm2: nightLights.lowLightAreaKm2,
      averageRadiance: nightLights.averageRadiance,
      ndvi: vegetation.ndvi,
      temperature: temperature.landSurfaceTemperature,
    },
    analysis: data,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  let payload;
  try { payload = await response.json(); } catch { payload = null; }
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.detail?.error?.message || 'Satellite service is temporarily unavailable.');
  }
  return payload;
}

export async function searchLocation(query, signal) {
  return request(`/api/location/search?q=${encodeURIComponent(query)}`, { signal });
}

export async function getGeeAnalysis(location, state = 'Chhattisgarh', signal) {
  const payload = await request(`/api/gee/analysis?location=${encodeURIComponent(location)}&state=${encodeURIComponent(state)}`, { signal });
  return { ...payload, data: normalizeAnalysis(payload.data), rawData: payload.data };
}

export async function getGeeMap(location, layer, signal) {
  return request(`/api/gee/map?location=${encodeURIComponent(location)}&layer=${encodeURIComponent(layer)}`, { signal });
}

export async function getBoundary(district, state, signal) {
  return request(`/api/location/boundary?district=${encodeURIComponent(district)}&state=${encodeURIComponent(state)}`, { signal });
}

export async function getRecommendations(location, signal) {
  return request(`/api/recommendations?location=${encodeURIComponent(location)}`, { signal });
}

export async function compareLocations(locations, signal) {
  return request('/api/gee/compare', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locations }), signal });
}

export async function getReportSummary(location, signal) {
  return request(`/api/reports/summary?location=${encodeURIComponent(location)}`, { signal });
}

export async function getGeeHealth(signal) {
  return request('/api/health/gee', { signal });
}

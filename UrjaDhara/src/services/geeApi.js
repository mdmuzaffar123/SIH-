import { geeLocations } from '../data/geeMockData';

/**
 * Backend boundary for GEE analysis. Replace the mock branch with:
 * GET /api/gee/analysis?state=Chhattisgarh&location={location}
 * when the FastAPI service is available.
 */
export async function getGeeAnalysis(location = 'Raipur') {
  await new Promise((resolve) => setTimeout(resolve, 650));
  const key = Object.keys(geeLocations).find((name) => name.toLowerCase() === location.trim().toLowerCase());
  if (!key) throw new Error('We could not find that location. Try a Chhattisgarh district.');
  return { success: true, data: geeLocations[key], source: 'Google Earth Engine', updatedAt: 'Today, 10:30 AM' };
}

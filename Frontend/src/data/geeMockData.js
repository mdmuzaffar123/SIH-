export const popularLocations = ['Raipur', 'Bilaspur', 'Durg', 'Bastar', 'Korba', 'Surguja', 'Dantewada'];

export const geeLocations = {
  Raipur: {
    name: 'Raipur', state: 'Chhattisgarh', coordinates: [21.2514, 81.6296],
    solarPotential: 'High', waterStressLabel: 'Moderate', energyAccess: 'Needs Attention', environmental: 'Moderate', priority: 'High',
    summary: 'Raipur shows strong solar potential in several regions, while moderate water stress is visible in selected areas. Night-light analysis indicates energy-access gaps in some rural locations.',
    indicators: { solarPotential: 5.21, waterStress: 0.68, lowLightAreaKm2: 18420, ndvi: 0.32, temperature: 31.4 },
  },
  Bilaspur: { name: 'Bilaspur', state: 'Chhattisgarh', coordinates: [22.0797, 82.1409], solarPotential: 'High', waterStressLabel: 'Moderate', energyAccess: 'Moderate', environmental: 'Good', priority: 'Medium', summary: 'Bilaspur combines dependable solar availability with moderate water stress. Targeted energy access projects can improve rural resilience.', indicators: { solarPotential: 5.05, waterStress: 0.54, lowLightAreaKm2: 12980, ndvi: 0.41, temperature: 30.8 } },
  Bastar: { name: 'Bastar', state: 'Chhattisgarh', coordinates: [19.1071, 81.9535], solarPotential: 'Very High', waterStressLabel: 'High', energyAccess: 'High Need', environmental: 'Moderate', priority: 'High', summary: 'Bastar has very high solar potential, but water stress and low-light pockets point to a strong case for integrated infrastructure planning.', indicators: { solarPotential: 5.48, waterStress: 0.79, lowLightAreaKm2: 22310, ndvi: 0.36, temperature: 32.1 } },
  Dantewada: { name: 'Dantewada', state: 'Chhattisgarh', coordinates: [18.8998, 81.3453], solarPotential: 'High', waterStressLabel: 'High', energyAccess: 'Very High Need', environmental: 'Moderate', priority: 'Very High', summary: 'Dantewada is a priority district: high water stress and energy-access gaps make decentralized solar-water solutions especially valuable.', indicators: { solarPotential: 5.31, waterStress: 0.84, lowLightAreaKm2: 24120, ndvi: 0.29, temperature: 32.6 } },
  Durg: { name: 'Durg', state: 'Chhattisgarh', coordinates: [21.1904, 81.2849], solarPotential: 'High', waterStressLabel: 'Low', energyAccess: 'Moderate', environmental: 'Good', priority: 'Medium', summary: 'Durg has high solar potential and comparatively lower water stress, supporting efficient solar infrastructure expansion.', indicators: { solarPotential: 5.12, waterStress: 0.42, lowLightAreaKm2: 9870, ndvi: 0.44, temperature: 31.1 } },
};

export const featureCards = [
  { icon: 'map', title: 'Satellite Maps', description: 'Explore satellite imagery and geographic layers for detailed analysis.', tone: 'green' },
  { icon: 'sun', title: 'Solar Potential', description: 'Identify areas with strong solar radiation potential.', tone: 'yellow' },
  { icon: 'droplets', title: 'Water Stress', description: 'Detect areas facing water scarcity and environmental stress.', tone: 'blue' },
  { icon: 'activity', title: 'Night Light Analysis', description: 'Identify low-light areas that may indicate energy-access gaps.', tone: 'purple' },
  { icon: 'leaf', title: 'Environmental Change', description: 'Track vegetation and land-use changes over time.', tone: 'green' },
];

export const comparisonRows = [
  { label: 'Solar Potential', values: ['High', 'Very High', 'High'] },
  { label: 'Water Stress', values: ['Medium', 'High', 'High'] },
  { label: 'Energy Access', values: ['Medium', 'High Need', 'Very High Need'] },
  { label: 'Priority', values: ['Medium', 'High', 'Very High'] },
];

export const comparisonChartData = [
  { indicator: 'Solar', Raipur: 78, Bastar: 92, Dantewada: 85 },
  { indicator: 'Water stress', Raipur: 68, Bastar: 79, Dantewada: 84 },
  { indicator: 'Energy need', Raipur: 52, Bastar: 78, Dantewada: 93 },
];

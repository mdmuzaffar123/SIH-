import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowDown, CheckCircle2 } from 'lucide-react';
import { getGeeAnalysis, getRecommendations, searchLocation } from '../services/geeApi';
import GEEHero from '../components/gee/GEEHero';
import GEESearch from '../components/gee/GEESearch';
import GEEFeatureCards from '../components/gee/GEEFeatureCards';
import HowItWorks from '../components/gee/HowItWorks';
import GEEMap from '../components/gee/GEEMap';
import KeyIndicators from '../components/gee/KeyIndicators';
import InsightSummary from '../components/gee/InsightSummary';
import DataSources from '../components/gee/DataSources';
import DistrictComparison from '../components/gee/DistrictComparison';
import Recommendations from '../components/gee/Recommendations';
import ReportActions from '../components/gee/ReportActions';
import GEEAIChat from '../components/gee/GEEAIChat';
import './GEEInsights.css';
import './GEEApiIntegration.css';

export default function GEEInsights() {
  const [query, setQuery] = useState('Raipur');
  const [location, setLocation] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const insightsRef = useRef(null);
  const search = async (value) => {
    const name = typeof value === 'string' ? value : value?.name;
    const state = typeof value === 'string' ? 'Chhattisgarh' : value?.state;
    if (!name?.trim()) return;
    setLoading(true); setError(''); setAnalysis(null);
    setSearchResults([]);
    try {
      const response = await getGeeAnalysis(name, state);
      setLocation(response.data); setAnalysis(response.rawData); setQuery(response.data.name);
      setRecommendationsLoading(true); setRecommendationsError('');
      try { const recommendationResponse = await getRecommendations(response.rawData.location.name); setRecommendations(recommendationResponse.recommendations || []); } catch (recommendationError) { setRecommendationsError(recommendationError.message || 'Unable to load recommendations.'); } finally { setRecommendationsLoading(false); }
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'Satellite analysis is temporarily unavailable. Please try again.');
    } finally { setLoading(false); }
  };
  const handleQueryChange = (value) => { setQuery(value); setSearchResults([]); };
  useEffect(() => {
    if (query.trim().length < 2 || (location && query.trim().toLowerCase() === location.name.toLowerCase())) { setSearchResults([]); return undefined; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => { setSearching(true); try { const response = await searchLocation(query, controller.signal); setSearchResults(response.results || []); } catch (err) { if (err.name !== 'AbortError') setSearchResults([]); } finally { setSearching(false); } }, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, location]);
  useEffect(() => { search('Raipur'); }, []);
  return <main className="gee-page">
    <GEEHero onExplore={() => insightsRef.current?.scrollIntoView({ behavior: 'smooth' })} />
    <GEESearch value={query} onChange={handleQueryChange} onSearch={search} loading={loading} selected={location} results={searchResults} searching={searching} />
    {error && <div className="gee-container"><div className="gee-error" role="alert"><AlertCircle size={18} />{error}</div></div>}
    <div ref={insightsRef}><GEEFeatureCards /></div>
    <HowItWorks />
    {loading && <div className="gee-container gee-analysis-loading" role="status"><span className="gee-spin gee-loading-orb" /> Analyzing satellite data...</div>}
    {location && analysis && !loading && <>
      <GEEMap location={location} />
      <KeyIndicators analysis={analysis} />
      <InsightSummary location={location} analysis={analysis} />
    </>}
    <DistrictComparison />
    <Recommendations items={recommendations} loading={recommendationsLoading} error={recommendationsError} />
    {analysis && <DataSources sources={analysis.dataSources} />}
    <section className="gee-container gee-sih-section"><div className="gee-sih-copy"><div className="gee-section-kicker">OUR INNOVATION</div><h2>From Satellite Data to Smart Decisions</h2><p>UrjaDhara transforms satellite intelligence into actionable infrastructure decisions for rural India.</p></div><div className="gee-sih-flow">{['Satellite Data', 'GEE Analysis', 'Local Insights', 'Priority Detection', 'Solar + Water Recommendation', 'Investment Planning'].map((step, index) => <div key={step} className="gee-flow-step"><span>{String(index + 1).padStart(2, '0')}</span>{step}{index < 5 && <ArrowDown size={15} />}</div>)}</div><div className="gee-sih-trust"><CheckCircle2 size={17} /> Built for transparent, evidence-led public investment</div></section>
    {location && <ReportActions location={location} />}
    <GEEAIChat />
  </main>;
}

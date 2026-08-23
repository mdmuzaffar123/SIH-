import { useRef, useState } from 'react';
import { AlertCircle, ArrowDown, CheckCircle2 } from 'lucide-react';
import { getGeeAnalysis } from '../services/geeApi';
import { geeLocations } from '../data/geeMockData';
import GEEHero from '../components/gee/GEEHero';
import GEESearch from '../components/gee/GEESearch';
import GEEFeatureCards from '../components/gee/GEEFeatureCards';
import HowItWorks from '../components/gee/HowItWorks';
import GEEMap from '../components/gee/GEEMap';
import KeyIndicators from '../components/gee/KeyIndicators';
import InsightSummary from '../components/gee/InsightSummary';
import DistrictComparison from '../components/gee/DistrictComparison';
import Recommendations from '../components/gee/Recommendations';
import ReportActions from '../components/gee/ReportActions';
import GEEAIChat from '../components/gee/GEEAIChat';
import './GEEInsights.css';

export default function GEEInsights() {
  const [query, setQuery] = useState('Raipur');
  const [location, setLocation] = useState(geeLocations.Raipur);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const insightsRef = useRef(null);
  const search = async (value) => { if (!value?.trim()) return; setLoading(true); setError(''); try { const response = await getGeeAnalysis(value); setLocation(response.data); setQuery(response.data.name); } catch (err) { setError(err.message); } finally { setLoading(false); } };
  return <main className="gee-page">
    <GEEHero onExplore={() => insightsRef.current?.scrollIntoView({ behavior: 'smooth' })} />
    <GEESearch value={query} onChange={setQuery} onSearch={search} loading={loading} selected={location} />
    {error && <div className="gee-container"><div className="gee-error" role="alert"><AlertCircle size={18} />{error}</div></div>}
    <div ref={insightsRef}><GEEFeatureCards /></div>
    <HowItWorks />
    <GEEMap location={location} />
    <KeyIndicators data={location.indicators} />
    <InsightSummary location={location} />
    <DistrictComparison />
    <Recommendations />
    <section className="gee-container gee-sih-section"><div className="gee-sih-copy"><div className="gee-section-kicker">OUR INNOVATION</div><h2>From Satellite Data to Smart Decisions</h2><p>UrjaDhara transforms satellite intelligence into actionable infrastructure decisions for rural India.</p></div><div className="gee-sih-flow">{['Satellite Data', 'GEE Analysis', 'Local Insights', 'Priority Detection', 'Solar + Water Recommendation', 'Investment Planning'].map((step, index) => <div key={step} className="gee-flow-step"><span>{String(index + 1).padStart(2, '0')}</span>{step}{index < 5 && <ArrowDown size={15} />}</div>)}</div><div className="gee-sih-trust"><CheckCircle2 size={17} /> Built for transparent, evidence-led public investment</div></section>
    <ReportActions />
    <GEEAIChat />
  </main>;
}

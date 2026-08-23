import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { findLocation, allLocations } from '../data/cgDistricts';
import './SearchModal.css';

const PRIORITY_COLOR = {
  Critical: '#c62828',
  High: '#e65100',
  Medium: '#f9a825',
  Low: '#2d7a2d',
};

function SolarResult({ data, name }) {
  const s = data.solar;
  const pct = Math.round((s.facilitiesWithSolar / (s.facilitiesWithSolar + s.facilitiesNeedSolar)) * 100);
  return (
    <div className="result-card solar-result">
      <div className="result-header solar-header-r">
        <span>☀️</span>
        <div>
          <h3>Solar Energy — {name}</h3>
          <span className="region-tag">{data.region}</span>
        </div>
        <span className="priority-badge" style={{ background: PRIORITY_COLOR[s.priority] }}>
          {s.priority} Priority
        </span>
      </div>
      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-val">{s.avgSunHours} hrs</div>
          <div className="metric-label">Avg Sun Hours/Day</div>
        </div>
        <div className="metric">
          <div className="metric-val">{s.installedMW} MW</div>
          <div className="metric-label">Solar Installed</div>
        </div>
        <div className="metric">
          <div className="metric-val">{s.targetMW} MW</div>
          <div className="metric-label">Target Capacity</div>
        </div>
        <div className="metric">
          <div className="metric-val">{s.coveredArea}</div>
          <div className="metric-label">Coverage Area</div>
        </div>
        <div className="metric">
          <div className="metric-val">{s.facilitiesWithSolar}</div>
          <div className="metric-label">Facilities with Solar</div>
        </div>
        <div className="metric highlight-metric">
          <div className="metric-val">{s.facilitiesNeedSolar}</div>
          <div className="metric-label">Still Need Solar ⚠️</div>
        </div>
        <div className="metric">
          <div className="metric-val">{s.avgCostPerKW}</div>
          <div className="metric-label">Avg Cost / kW</div>
        </div>
        <div className="metric">
          <div className="metric-val">{s.co2SavedTonnes.toLocaleString()} T</div>
          <div className="metric-label">CO₂ Saved/Year</div>
        </div>
      </div>
      <div className="progress-row">
        <span>Solar Coverage</span>
        <div className="progress-bar">
          <div className="progress-fill solar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span>{pct}%</span>
      </div>
      <div className="villages-row">
        <span className="villages-label">🏘️ Key Villages:</span>
        {s.topVillages.map((v, i) => <span key={i} className="village-chip">{v}</span>)}
      </div>
    </div>
  );
}

function WaterResult({ data, name }) {
  const w = data.water;
  return (
    <div className="result-card water-result">
      <div className="result-header water-header-r">
        <span>💧</span>
        <div>
          <h3>Water Systems — {name}</h3>
          <span className="region-tag">{data.region}</span>
        </div>
        <span className="priority-badge" style={{ background: PRIORITY_COLOR[w.priority] }}>
          {w.priority} Priority
        </span>
      </div>
      <div className="metrics-grid">
        <div className="metric">
          <div className="metric-val">{w.groundwaterLevel}</div>
          <div className="metric-label">Groundwater Level</div>
        </div>
        <div className="metric">
          <div className="metric-val">{w.annualRainfall}</div>
          <div className="metric-label">Annual Rainfall</div>
        </div>
        <div className="metric">
          <div className="metric-val">{w.coveragePercent}%</div>
          <div className="metric-label">Water Coverage</div>
        </div>
        <div className="metric">
          <div className="metric-val">{w.borewellDepth}</div>
          <div className="metric-label">Borewell Depth</div>
        </div>
        <div className="metric">
          <div className="metric-val">{w.solarPumpsInstalled}</div>
          <div className="metric-label">Solar Pumps Installed</div>
        </div>
        <div className="metric highlight-metric">
          <div className="metric-val">{w.solarPumpsNeeded}</div>
          <div className="metric-label">More Pumps Needed ⚠️</div>
        </div>
        <div className="metric">
          <div className="metric-val">{w.householdsWithTap}</div>
          <div className="metric-label">Tap Water Access</div>
        </div>
      </div>
      <div className="quality-row">
        <span className="quality-label">🧪 Water Quality:</span>
        <span className="quality-text">{w.waterQuality}</span>
      </div>
      <div className="progress-row">
        <span>Water Coverage</span>
        <div className="progress-bar">
          <div className="progress-fill water-fill" style={{ width: `${w.coveragePercent}%` }} />
        </div>
        <span>{w.coveragePercent}%</span>
      </div>
      <div className="villages-row">
        <span className="villages-label">🚨 Critical Villages:</span>
        {w.criticalVillages.map((v, i) => <span key={i} className="village-chip critical-chip">{v}</span>)}
      </div>
    </div>
  );
}

export default function SearchModal({ onClose }) {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = (val) => {
    setQuery(val);
    if (val.length > 1) {
      const q = val.toLowerCase();
      setSuggestions(allLocations.filter(l => l.toLowerCase().includes(q)));
    } else {
      setSuggestions([]);
    }
  };

  const doSearch = (q) => {
    const found = findLocation(q);
    setResult(found ? { data: found } : { data: null });
    setSuggestions([]);
    setQuery(q);
  };

  const search = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="search-modal-title">
          <span>🔍</span>
          <div>
            <h2>Search Chhattisgarh</h2>
            <p>Search any district or village to get solar & water data</p>
          </div>
        </div>

        <form onSubmit={search} className="search-form">
          <div className="search-input-wrap">
            <input
              autoFocus
              value={query}
              onChange={e => handleInput(e.target.value)}
              placeholder="e.g. Raipur, Bastar, Jagdalpur, Dantewada..."
            />
            {suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((s, i) => (
                  <div key={i} className="suggestion-item" onClick={() => doSearch(s)}>
                    📍 {s}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <div className="quick-chips">
          {allLocations.map((l, i) => (
            <span key={i} className="quick-chip" onClick={() => doSearch(l)}>📍 {l}</span>
          ))}
        </div>

        {result && !result.data && (
          <div className="no-result">
            <span>😕</span>
            <p>No data found for "<strong>{query}</strong>"</p>
            <small>Try: Raipur, Bilaspur, Bastar, Korba, Dantewada, Surguja...</small>
          </div>
        )}

        {result?.data && (
          <div className="results-container">
            <div className="results-summary">
              <span>📍 Showing data for <strong>{result.data.name}</strong> ({result.data.type})</span>
            </div>
            <SolarResult data={result.data} name={result.data.name} />
            <WaterResult data={result.data} name={result.data.name} />
          </div>
        )}
      </div>
    </div>
  );
}

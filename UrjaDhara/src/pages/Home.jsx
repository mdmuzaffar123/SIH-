import { useEffect, useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import SearchModal from '../components/SearchModal';
import cardOneArtwork from '../../Image/Card 1.jpeg';
import smartPlanningArtwork from '../../Image/5 card.png';
import './Home.css';

const PRIORITY_COLOR = { Critical: '#c62828', High: '#e65100', Medium: '#f9a825', Low: '#2d7a2d' };

const STATE_DATA = [
  { name: 'Chhattisgarh', solar: '68%', water: '52%', priority: 'Critical', facilities: 4200 },
  { name: 'Madhya Pradesh', solar: '55%', water: '61%', priority: 'High', facilities: 6800 },
  { name: 'Rajasthan', solar: '72%', water: '38%', priority: 'High', facilities: 5100 },
  { name: 'Odisha', solar: '48%', water: '44%', priority: 'Critical', facilities: 3900 },
  { name: 'Jharkhand', solar: '42%', water: '40%', priority: 'Critical', facilities: 2800 },
  { name: 'Uttar Pradesh', solar: '61%', water: '70%', priority: 'Medium', facilities: 9200 },
  { name: 'Bihar', solar: '38%', water: '55%', priority: 'High', facilities: 7400 },
  { name: 'Maharashtra', solar: '74%', water: '78%', priority: 'Medium', facilities: 5600 },
  { name: 'Gujarat', solar: '80%', water: '82%', priority: 'Low', facilities: 3200 },
  { name: 'Andhra Pradesh', solar: '69%', water: '66%', priority: 'Medium', facilities: 4100 },
];

const IMPACT_CARDS = [
  {
    eyebrow: 'National Mission',
    title: 'Solar power for every rural classroom',
    text: 'Supporting India’s clean-energy vision with reliable electricity for schools and health centres.',
    image: cardOneArtwork,
    tone: 'gold',
  },
  {
    eyebrow: 'Clean Water Access',
    title: 'Water where communities need it most',
    text: 'Solar-powered pumps can bring dependable water closer to rural families every day.',
    image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&q=85',
    tone: 'blue',
  },
  {
    eyebrow: 'Policy & Funding',
    title: 'Turn government schemes into action',
    text: 'Discover subsidy and funding pathways that help local clean-energy projects move faster.',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Narendra%20Modi%20official%20portrait.jpg',
    tone: 'green',
  },
  {
    eyebrow: 'Community Impact',
    title: 'A stronger future for rural India',
    text: 'Better energy and water systems create healthier, safer, and more resilient communities.',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=85',
    tone: 'orange',
  },
  {
    eyebrow: 'Smart Planning',
    // title: 'Plan every project with confidence',
    // text: 'Use local data to choose the right solar system, water solution, and investment priority.',
    image: smartPlanningArtwork,
    tone: 'teal',
    isArtwork: true,
  },
];

function FeatureModal({ feature, onClose, ft }) {
  const d = feature.details;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feature-modal" onClick={e => e.stopPropagation()}>
        <button className="feat-modal-close" onClick={onClose}>✕</button>
        <div className="feat-modal-header" style={{ background: `linear-gradient(135deg, ${feature.color}22, ${feature.color}11)`, borderLeft: `4px solid ${feature.color}` }}>
          <span className="feat-modal-icon">{feature.icon}</span>
          <div>
            <h2 style={{ color: feature.color }}>{feature.title}</h2>
            <p>{feature.desc}</p>
          </div>
        </div>

        {feature.hasMap && (
          <div className="feat-map-wrap">
            <div className="feat-map-label">{ft.mapLabel}</div>
            <iframe
              title="Chhattisgarh Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=80.24%2C17.78%2C84.40%2C24.10&layer=mapnik&marker=21.27%2C81.86"
              className="feat-map-iframe"
              loading="lazy"
            />
            <div className="map-legend">
              <span><span className="dot green" />{ft.mapLegendSolar}</span>
              <span><span className="dot red" />{ft.mapLegendNeeds}</span>
              <span><span className="dot blue" />{ft.mapLegendWater}</span>
              <span><span className="dot orange" />{ft.mapLegendPriority}</span>
            </div>
          </div>
        )}

        <div className="feat-modal-body">
          <div className="feat-section"><h4>{ft.whatLabel}</h4><p>{d.what}</p></div>
          <div className="feat-section"><h4>{ft.howLabel}</h4><p>{d.how}</p></div>
          <div className="feat-section"><h4>{ft.whyLabel}</h4><p>{d.why}</p></div>
          <div className="feat-section">
            <h4>{ft.stepsLabel}</h4>
            <ol className="feat-steps">{d.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          </div>
          <div className="feat-impact"><span>📈</span><strong>{ft.impactLabel}</strong>{d.impact}</div>
        </div>
        <div className="feat-modal-footer">
          <Link to="/services" className="btn btn-primary" onClick={onClose}>{ft.exploreBtn}</Link>
          <Link to="/contact" className="feat-contact-btn" onClick={onClose}>{ft.requestDemo}</Link>
        </div>
      </div>
    </div>
  );
}

function StateModal({ state, stateNames, sm, onClose }) {
  if (!state) return null;
  const idx = STATE_DATA.findIndex(s => s.name === state.name);
  const displayName = stateNames?.[idx] || state.name;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="state-modal" onClick={e => e.stopPropagation()}>
        <button className="feat-modal-close" onClick={onClose}>✕</button>
        <div className="state-modal-header">
          <h2>📍 {displayName}</h2>
          <span className="state-priority-badge" style={{ background: PRIORITY_COLOR[state.priority] }}>
            {state.priority} {sm.priorityLabel}
          </span>
        </div>
        <div className="state-modal-stats">
          <div className="sm-stat">
            <div className="sm-stat-val" style={{ color: '#f9a825' }}>{state.solar}</div>
            <div className="sm-stat-label">{sm.solarCoverage}</div>
            <div className="sm-bar"><div className="sm-bar-fill solar-bar" style={{ width: state.solar }} /></div>
          </div>
          <div className="sm-stat">
            <div className="sm-stat-val" style={{ color: '#0288d1' }}>{state.water}</div>
            <div className="sm-stat-label">{sm.waterAccess}</div>
            <div className="sm-bar"><div className="sm-bar-fill water-bar" style={{ width: state.water }} /></div>
          </div>
          <div className="sm-stat">
            <div className="sm-stat-val" style={{ color: '#2d7a2d' }}>{state.facilities.toLocaleString()}</div>
            <div className="sm-stat-label">{sm.totalFacilities}</div>
          </div>
        </div>
        <div className="state-modal-info">
          <p>{sm.bodyText.replace('{state}', displayName)}</p>
          <p>{sm.needsSolar} <strong>{Math.round(state.facilities * (1 - parseInt(state.solar) / 100)).toLocaleString()}</strong></p>
          <p>{sm.needsWater} <strong>{Math.round(state.facilities * (1 - parseInt(state.water) / 100)).toLocaleString()}</strong></p>
        </div>
        <div className="feat-modal-footer">
          <Link to="/contact" className="btn btn-primary" onClick={onClose}>{sm.ctaBtn.replace('{state}', displayName)}</Link>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLang();
  const stateNames = t('states.list');
  const features = t('features.list');
  const ft = t('features');
  const sm = t('stateModal');
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeState, setActiveState] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [impactIndex, setImpactIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setImpactIndex(current => (current + 1) % IMPACT_CARDS.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const activeImpactCard = IMPACT_CARDS[impactIndex];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="hero-badge">{t('hero.badge')}</div>
          <h1>{t('hero.title')}</h1>
          <p className="hero-sub">{t('hero.subtitle')}</p>
          <p className="hero-desc">{t('hero.desc')}</p>
          <div className="hero-btns">
            <Link to="/services" className="btn btn-primary">{t('hero.cta')}</Link>
            <Link to="/about" className="btn btn-outline">{t('hero.cta2')}</Link>
          </div>
          <div className={`impact-carousel impact-${activeImpactCard.tone} ${activeImpactCard.isArtwork ? 'impact-artwork' : ''}`}>
            {!activeImpactCard.isArtwork && <div className="impact-card-content">
              <span className="impact-card-eyebrow">{activeImpactCard.eyebrow}</span>
              <h2>{activeImpactCard.title}</h2>
              <p>{activeImpactCard.text}</p>
            </div>}
            <img src={activeImpactCard.image} alt="Rural clean energy and water initiative" className="impact-card-image" />
          </div>
          <div className="impact-dots" aria-label="Impact highlights">
            {IMPACT_CARDS.map((card, index) => (
              <button
                key={card.title}
                className={`impact-dot ${index === impactIndex ? 'active' : ''}`}
                onClick={() => setImpactIndex(index)}
                aria-label={`Show ${card.title}`}
              />
            ))}
          </div>
        </div>
        <div className="hero-scroll">{t('hero.scroll')}</div>
      </section>

      {/* Search */}
      <section className="home-search-section">
        <div className="container home-search-card">
          <div className="home-search-copy">
            <span className="home-search-eyebrow">📍 Explore local data</span>
          </div>
          <button className="home-search-btn" onClick={() => setSearchOpen(true)}>
            <span className="home-search-btn-icon" aria-hidden="true">⌕</span>
            <span>Search your area</span>
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">{ft?.sectionTitle}</h2>
          <p className="section-subtitle">{ft?.sectionSub}</p>
          <div className="features-grid">
            {(features || []).map((f, i) => (
              <div key={i} className="feature-card card" onClick={() => setActiveFeature(f)} style={{ '--accent': f.color }}>
                <div className="feature-icon" style={{ background: f.color + '18' }}>{f.icon}</div>
                <h3 style={{ color: f.color }}>{f.title}</h3>
                <p>{f.desc}</p>
                <button className="feature-more-btn" style={{ color: f.color, borderColor: f.color + '44', background: f.color + '10' }}>
                  {ft?.learnMore}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* States */}
      <section className="section states-section">
        <div className="container">
          <h2 className="section-title">{t('states.title')}</h2>
          <p className="section-subtitle">{t('states.subTitle')}</p>
          <div className="states-grid">
            {STATE_DATA.map((s, i) => (
              <div key={i} className="state-card" onClick={() => setActiveState(s)}>
                <span className="state-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="state-name">{stateNames?.[i] || s.name}</span>
                <span className="state-priority-dot" style={{ background: PRIORITY_COLOR[s.priority] }} title={s.priority} />
                <span className="state-more">{ft?.learnMore?.replace('→','') || 'More'} →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-content">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.desc')}</p>
          <Link to="/contact" className="btn btn-primary">{t('cta.btn')}</Link>
        </div>
      </section>

      {activeFeature && <FeatureModal feature={activeFeature} onClose={() => setActiveFeature(null)} ft={ft} />}
      {activeState && <StateModal state={activeState} stateNames={stateNames} sm={sm} onClose={() => setActiveState(null)} />}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

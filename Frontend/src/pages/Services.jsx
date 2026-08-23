import { useLang } from '../context/LanguageContext';
import SolarData from '../components/SolarData';
import WaterData from '../components/WaterData';
import './Services.css';

const SERVICE_KEYS = [
  { key: 'solar', icon: '☀️', color: '#f9a825' },
  { key: 'water', icon: '💧', color: '#0288d1' },
  { key: 'hybrid', icon: '⚡', color: '#7b1fa2' },
  { key: 'dashboard', icon: '📊', color: '#2d7a2d' },
  { key: 'cost', icon: '💰', color: '#00897b' },
  { key: 'policy', icon: '📋', color: '#e65100' },
];

export default function Services() {
  const { t } = useLang();
  const steps = t('services.steps');

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="services-hero-overlay" />
        <div className="container services-hero-content">
          <h1>{t('services.title')}</h1>
          <p>{t('services.subDesc')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="services-grid">
            {SERVICE_KEYS.map((s, i) => (
              <div key={i} className="service-card card" style={{ '--accent': s.color }}>
                <div className="service-icon" style={{ background: s.color + '20', color: s.color }}>{s.icon}</div>
                <h3>{t(`services.${s.key}`)}</h3>
                <p>{t(`services.${s.key}Desc`)}</p>
                <div className="service-line" style={{ background: s.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section data-section">
        <div className="container">
          <h2 className="section-title">{t('services.dataTitle')}</h2>
          <p className="section-subtitle">{t('services.dataSub')}</p>
          <div className="data-grid">
            <SolarData />
            <WaterData />
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="container">
          <h2 className="section-title">{t('services.processTitle')}</h2>
          <p className="section-subtitle">{t('services.processSub')}</p>
          <div className="process-steps">
            {(steps || []).map((p, i) => (
              <div key={i} className="process-step">
                <div className="step-num">{p.step}</div>
                <div className="step-content">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useLang } from '../context/LanguageContext';
import './DataCard.css';

export default function SolarData() {
  const { t } = useLang();
  const points = t('solar.points');
  return (
    <div className="data-card solar-card">
      <div className="data-card-header solar-header">
        <span className="data-icon">☀️</span>
        <h3>{t('solar.title')}</h3>
      </div>
      <ul className="data-points">
        {Array.isArray(points) && points.map((p, i) => (
          <li key={i} className="data-point">{p}</li>
        ))}
      </ul>
    </div>
  );
}

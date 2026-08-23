import { useLang } from '../context/LanguageContext';
import './DataCard.css';

export default function WaterData() {
  const { t } = useLang();
  const points = t('water.points');
  return (
    <div className="data-card water-card">
      <div className="data-card-header water-header">
        <span className="data-icon">💧</span>
        <h3>{t('water.title')}</h3>
      </div>
      <ul className="data-points">
        {Array.isArray(points) && points.map((p, i) => (
          <li key={i} className="data-point">{p}</li>
        ))}
      </ul>
    </div>
  );
}

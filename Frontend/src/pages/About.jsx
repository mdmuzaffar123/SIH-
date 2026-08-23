import { useLang } from '../context/LanguageContext';
import './About.css';

export default function About() {
  const { t } = useLang();
  const team = t('about.team');

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay" />
        <div className="container about-hero-content">
          <h1>{t('about.title')}</h1>
          <p>{t('about.desc')}</p>
        </div>
      </div>

      <section className="section">
        <div className="container about-cards">
          <div className="about-card card">
            <div className="about-card-icon">🎯</div>
            <h3>{t('about.mission')}</h3>
            <p>{t('about.missionDesc')}</p>
          </div>
          <div className="about-card card">
            <div className="about-card-icon">🌟</div>
            <h3>{t('about.vision')}</h3>
            <p>{t('about.visionDesc')}</p>
          </div>
          <div className="about-card card">
            <div className="about-card-icon">⚠️</div>
            <h3>{t('about.problem')}</h3>
            <p>{t('about.problemDesc')}</p>
          </div>
        </div>
      </section>

      <section className="section about-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-text">
              <h2>{t('about.storyTitle')}</h2>
              <p>{t('about.story1')}</p>
              <p>{t('about.story2')}</p>
              <p>{t('about.story3')}</p>
            </div>
            <div className="story-image">
              <div className="story-img-box">
                <div className="story-img-overlay">
                  <span>🌞</span>
                  <p>{t('about.storyBadge')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section team-section">
        <div className="container">
          <h2 className="section-title">{t('about.teamTitle')}</h2>
          <p className="section-subtitle">{t('about.teamSub')}</p>
          <div className="team-grid">
            {(team || []).map((m, i) => (
              <div key={i} className="team-card card">
                <div className="team-emoji">{m.emoji}</div>
                <h3>{m.name}</h3>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

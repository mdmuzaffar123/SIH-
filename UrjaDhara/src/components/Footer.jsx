import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import './Footer.css';

const SOCIAL_LINKS = [
  {
    label: 'Email',
    href: 'mailto:info@urjadhara.in',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <polyline points="2,4 12,13 22,4"/>
      </svg>
    ),
    color: '#ea4335',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    color: '#0a66c2',
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    color: '#1da1f2',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/7282962922',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
    color: '#25d366',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: '#1877f2',
  },
];

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">☀️ UrjaDhara</div>
            <p>{t('footer.tagline')}</p>
            <div className="footer-social">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="social-icon-btn"
                  style={{ '--social-color': s.color }}
                  title={s.label}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>{t('footer.links')}</h4>
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/services">{t('nav.services')}</Link>
            <Link to="/contact">{t('nav.contact')}</Link>
          </div>
          <div className="footer-col">
            <h4>{t('footer.contact')}</h4>
            <p>📍 {t('contact.addressVal')}</p>
            <p>📞 {t('contact.phoneVal')}</p>
            <p>✉️ {t('contact.emailVal')}</p>
          </div>
          <div className="footer-col">
            <h4>{t('states.title')}</h4>
            <div className="footer-states">
              {(t('states.list') || []).map((s, i) => (
                <span key={i} className="state-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer.rights')}</p>
          <Link to="/admin" className="footer-admin-link">🛡️ Admin</Link>
        </div>
      </div>
    </footer>
  );
}

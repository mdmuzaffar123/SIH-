import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import './Navbar.css';
import './UserMenu.css';

const LANGS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'cg', label: 'Chhattisgarhi', native: 'छत्तीसगढ़ी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">☀️</span>
            <span>UrjaDhara</span>
          </Link>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
            <Link to="/services" onClick={() => setMenuOpen(false)}>{t('nav.services')}</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>{t('nav.contact')}</Link>
          </div>

          <div className="nav-actions">
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} title="Search">
              🔍
            </button>

            <div className="lang-dropdown" ref={langRef}>
              <button
                className={`lang-toggle-btn ${langOpen ? 'open' : ''}`}
                onClick={() => setLangOpen(!langOpen)}
              >
                🌐 Language <span className="lang-arrow">{langOpen ? '▲' : '▼'}</span>
              </button>
              {langOpen && (
                <div className="lang-menu">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      className={`lang-option ${lang === l.code ? 'active' : ''}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                    >
                      <span className="lang-native">{l.native}</span>
                      <span className="lang-english">{l.label}</span>
                      {lang === l.code && <span className="lang-check">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="user-dropdown" ref={userRef}>
                <button className="user-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} className="nav-avatar-img" />
                    : <div className="nav-avatar-initials">{user.name?.charAt(0).toUpperCase()}</div>
                  }
                  <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                  <span className="nav-arrow">{userMenuOpen ? '▲' : '▼'}</span>
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="user-dropdown-header">
                      {user.avatar
                        ? <img src={user.avatar} alt={user.name} className="dropdown-avatar" />
                        : <div className="dropdown-avatar-initials">{user.name?.charAt(0).toUpperCase()}</div>
                      }
                      <div>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                        {user.role && <span className="user-role-tag">{user.role}</span>}
                      </div>
                    </div>
                    {user.mobile && (
                      <div className="user-dropdown-info">📱 +91 {user.mobile}</div>
                    )}
                    {user.state && (
                      <div className="user-dropdown-info">📍 {user.state}</div>
                    )}
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-logout" onClick={() => { logout(); setUserMenuOpen(false); }}>
                      🚪 {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-primary nav-auth-btn" onClick={() => setAuthOpen(true)}>
                {t('nav.login')}
              </button>
            )}

            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}

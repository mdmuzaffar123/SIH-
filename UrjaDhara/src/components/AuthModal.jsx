import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useLang } from '../context/LanguageContext';
import './AuthModal.css';

const DEFAULT_AVATAR = null;

const ROLES = ['Government Official', 'Planner / Engineer', 'NGO Worker', 'Researcher', 'Student', 'Other'];

export default function AuthModal({ onClose }) {
  const { login, signup } = useAuth();
  const { addUser } = useAdmin();
  const [mode, setMode] = useState('login');
  const [step, setStep] = useState(1); // signup has 2 steps
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    mobile: '', role: '', state: '', avatar: null,
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
      setForm(f => ({ ...f, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Full name is required';
    if (!form.email.includes('@')) return 'Enter a valid email';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const nextStep = (e) => {
    e.preventDefault();
    const err = validateStep1();
    if (err) return setError(err);
    setError('');
    setStep(2);
  };

  const submitSignup = (e) => {
    e.preventDefault();
    setError('');
    if (!form.mobile || form.mobile.length < 10) return setError('Enter a valid 10-digit mobile number');
    const res = signup(form);
    if (res.error) return setError(res.error);
    addUser({ name: form.name, email: form.email, mobile: form.mobile, role: form.role, state: form.state, avatar: form.avatar });
    setSuccess('Account created successfully! Please login.');
    setMode('login');
    setStep(1);
    setForm({ name: '', email: '', password: '', confirmPassword: '', mobile: '', role: '', state: '', avatar: null });
    setAvatarPreview(null);
  };

  const submitLogin = (e) => {
    e.preventDefault();
    setError('');
    const res = login(form.email, form.password);
    if (res.error) return setError(res.error);
    onClose();
  };

  const switchMode = (m) => {
    setMode(m); setError(''); setSuccess(''); setStep(1);
    setForm({ name: '', email: '', password: '', confirmPassword: '', mobile: '', role: '', state: '', avatar: null });
    setAvatarPreview(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`auth-modal ${mode === 'signup' ? 'auth-modal-wide' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">☀️</div>
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
          <p>{mode === 'login' ? 'Login to access your planning dashboard' : 'Join UrjaDhara — Plan a greener India'}</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Sign Up</button>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={submitLogin} className="auth-form">
            <div className="form-field">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
              </div>
            </div>
            <div className="form-field">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input name="password" type={showPass ? 'text' : 'password'} placeholder="Enter password" value={form.password} onChange={handle} required />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>
            <button type="submit" className="auth-submit-btn">
              <span>Login to Dashboard</span> →
            </button>
          </form>
        )}

        {/* SIGNUP FORM — Step 1 */}
        {mode === 'signup' && step === 1 && (
          <form onSubmit={nextStep} className="auth-form">
            {/* Avatar upload */}
            <div className="avatar-upload-row">
              <div className="avatar-circle" onClick={() => fileRef.current.click()}>
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" />
                  : <span>📷</span>
                }
                <div className="avatar-overlay">Upload Photo</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} hidden />
              <div className="avatar-hint">
                <strong>Profile Photo</strong>
                <small>Click to upload (optional)</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Full Name *</label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input name="name" placeholder="Your full name" value={form.name} onChange={handle} required />
                </div>
              </div>
              <div className="form-field">
                <label>Email Address *</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Password *</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input name="password" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={handle} required />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div className="form-field">
                <label>Confirm Password *</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input name="confirmPassword" type={showPass ? 'text' : 'password'} placeholder="Repeat password" value={form.confirmPassword} onChange={handle} required />
                </div>
              </div>
            </div>

            <div className="step-indicator">
              <span className="step active">1</span>
              <span className="step-line" />
              <span className="step">2</span>
              <small>Step 1 of 2 — Basic Info</small>
            </div>

            <button type="submit" className="auth-submit-btn">Continue →</button>
          </form>
        )}

        {/* SIGNUP FORM — Step 2 */}
        {mode === 'signup' && step === 2 && (
          <form onSubmit={submitSignup} className="auth-form">
            <div className="form-row">
              <div className="form-field">
                <label>Mobile Number *</label>
                <div className="input-wrap">
                  <span className="input-icon">📱</span>
                  <span className="country-code">+91</span>
                  <input name="mobile" type="tel" placeholder="10-digit number" maxLength={10} value={form.mobile} onChange={handle} required />
                </div>
              </div>
              <div className="form-field">
                <label>Your Role</label>
                <div className="input-wrap">
                  <span className="input-icon">💼</span>
                  <select name="role" value={form.role} onChange={handle}>
                    <option value="">Select role</option>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-field">
              <label>State / District</label>
              <div className="input-wrap">
                <span className="input-icon">📍</span>
                <input name="state" placeholder="e.g. Chhattisgarh, Raipur" value={form.state} onChange={handle} />
              </div>
            </div>

            <div className="step-indicator">
              <span className="step done">✓</span>
              <span className="step-line done-line" />
              <span className="step active">2</span>
              <small>Step 2 of 2 — Additional Info</small>
            </div>

            <div className="step2-actions">
              <button type="button" className="back-btn" onClick={() => { setStep(1); setError(''); }}>← Back</button>
              <button type="submit" className="auth-submit-btn">Create Account 🎉</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

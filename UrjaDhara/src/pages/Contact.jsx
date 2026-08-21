import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import './Contact.css';

const ENQUIRY_TYPES = [
  'Solar Energy Installation',
  'Water Pump System',
  'Hybrid Renewable Setup',
  'Cost & Feasibility Study',
  'Government Scheme Guidance',
  'Planning Dashboard Demo',
  'Partnership / Collaboration',
  'Other',
];

const STATES = [
  'Chhattisgarh', 'Madhya Pradesh', 'Rajasthan', 'Odisha', 'Jharkhand',
  'Uttar Pradesh', 'Bihar', 'Maharashtra', 'Gujarat', 'Andhra Pradesh', 'Other',
];

const FACILITY_TYPES = ['School', 'Health Centre', 'Village / Community', 'Government Office', 'NGO', 'Other'];

const FAQ = [
  { q: 'How long does solar installation take?', a: 'A typical 5kW solar system for a school takes 3–7 days to install after approval.' },
  { q: 'What government schemes are available?', a: 'PM-KUSUM, MNRE subsidies, and state-level schemes can cover 30–70% of costs.' },
  { q: 'Is solar suitable for tribal/remote areas?', a: 'Yes — off-grid solar systems work perfectly in remote areas with no grid connection.' },
  { q: 'How do I apply for a solar water pump?', a: 'Contact your district agriculture office or apply online via PM-KUSUM portal.' },
];

export default function Contact() {
  const { t } = useLang();
  const { addInquiry } = useAdmin();
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', organisation: '',
    facilityType: '', state: '', district: '',
    enquiryType: '', urgency: 'normal', message: '',
    newsletter: false,
  });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'message') setCharCount(value.length);
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.mobile && form.mobile.length !== 10) e.mobile = 'Enter 10-digit number';
    if (!form.enquiryType) e.enquiryType = 'Please select enquiry type';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    addInquiry(form);
    setSent(true);
    setForm({ name:'',email:'',mobile:'',organisation:'',facilityType:'',state:'',district:'',enquiryType:'',urgency:'normal',message:'',newsletter:false });
    setCharCount(0);
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-overlay" />
        <div className="container contact-hero-content">
          <div className="contact-hero-badge">📬 Get In Touch</div>
          <h1>Contact Us</h1>
          <p>Send an enquiry about solar energy, water systems, or planning support. We respond within 24 hours.</p>
          <div className="hero-stats">
            <div><strong>24hrs</strong><span>Response Time</span></div>
            <div><strong>Free</strong><span>Consultation</span></div>
            <div><strong>10+</strong><span>States Covered</span></div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container contact-grid">

          {/* Left — Info + FAQ */}
          <div className="contact-info">
            <h2>We're Here to Help</h2>
            <p>Whether you're a government official, NGO worker, or community leader — our team will guide you through the best renewable energy and water solutions for your area.</p>

            <div className="info-items">
              {[
                { icon: '📍', label: 'Address', val: 'Raipur, Chhattisgarh, India' },
                { icon: '📞', label: 'Phone', val: '+91 98765 43210' },
                { icon: '✉️', label: 'Email', val: 'info@urjadhara.in' },
                { icon: '🕐', label: 'Working Hours', val: 'Mon–Sat, 9:00 AM – 6:00 PM' },
              ].map((item, i) => (
                <div key={i} className="info-item">
                  <div className="info-icon-box">{item.icon}</div>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick contact buttons */}
            <div className="quick-contact">
              <a href="tel:+919876543210" className="quick-btn call-btn">📞 Call Now</a>
              <a href="mailto:info@urjadhara.in" className="quick-btn email-btn">✉️ Email Us</a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="quick-btn whatsapp-btn">💬 WhatsApp</a>
            </div>

            {/* FAQ */}
            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              {FAQ.map((f, i) => (
                <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{f.q}</span>
                    <span className="faq-arrow">{openFaq === i ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === i && <div className="faq-a">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Enquiry Form */}
          <div className="contact-form-box card">
            <div className="form-header">
              <div className="form-header-icon">📋</div>
              <div>
                <h2>Send Enquiry</h2>
                <p>Fill in the details below and we'll get back to you</p>
              </div>
            </div>

            {sent && (
              <div className="form-success">
                <span>🎉</span>
                <div>
                  <strong>Enquiry Sent Successfully!</strong>
                  <p>Our team will contact you within 24 hours. Check your email for confirmation.</p>
                </div>
              </div>
            )}

            <form onSubmit={submit} noValidate>
              {/* Personal Info */}
              <div className="form-section-label">👤 Personal Information</div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <div className={`input-field ${errors.name ? 'error' : ''}`}>
                    <span>👤</span>
                    <input name="name" value={form.name} onChange={handle} placeholder="Your full name" />
                  </div>
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <div className={`input-field ${errors.mobile ? 'error' : ''}`}>
                    <span className="prefix">+91</span>
                    <input name="mobile" type="tel" maxLength={10} value={form.mobile} onChange={handle} placeholder="10-digit number" />
                  </div>
                  {errors.mobile && <span className="field-error">{errors.mobile}</span>}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Email Address *</label>
                  <div className={`input-field ${errors.email ? 'error' : ''}`}>
                    <span>✉️</span>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" />
                  </div>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Organisation / Department</label>
                  <div className="input-field">
                    <span>🏢</span>
                    <input name="organisation" value={form.organisation} onChange={handle} placeholder="e.g. District Collector Office" />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="form-section-label">📍 Location Details</div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>State</label>
                  <div className="input-field">
                    <span>🗺️</span>
                    <select name="state" value={form.state} onChange={handle}>
                      <option value="">Select state</option>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>District / Village</label>
                  <div className="input-field">
                    <span>📌</span>
                    <input name="district" value={form.district} onChange={handle} placeholder="e.g. Bastar, Jagdalpur" />
                  </div>
                </div>
              </div>

              {/* Enquiry Details */}
              <div className="form-section-label">⚡ Enquiry Details</div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Facility Type</label>
                  <div className="input-field">
                    <span>🏫</span>
                    <select name="facilityType" value={form.facilityType} onChange={handle}>
                      <option value="">Select type</option>
                      {FACILITY_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Enquiry Type *</label>
                  <div className={`input-field ${errors.enquiryType ? 'error' : ''}`}>
                    <span>📋</span>
                    <select name="enquiryType" value={form.enquiryType} onChange={handle}>
                      <option value="">Select enquiry</option>
                      {ENQUIRY_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  {errors.enquiryType && <span className="field-error">{errors.enquiryType}</span>}
                </div>
              </div>

              {/* Urgency */}
              <div className="form-group">
                <label>Urgency Level</label>
                <div className="urgency-options">
                  {[
                    { val: 'low', label: 'Low', icon: '🟢', desc: 'General inquiry' },
                    { val: 'normal', label: 'Normal', icon: '🟡', desc: 'Within a week' },
                    { val: 'high', label: 'High', icon: '🔴', desc: 'Urgent need' },
                  ].map(u => (
                    <label key={u.val} className={`urgency-opt ${form.urgency === u.val ? 'selected' : ''}`}>
                      <input type="radio" name="urgency" value={u.val} checked={form.urgency === u.val} onChange={handle} hidden />
                      <span>{u.icon}</span>
                      <strong>{u.label}</strong>
                      <small>{u.desc}</small>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label>Your Message *</label>
                <div className={`input-field textarea-field ${errors.message ? 'error' : ''}`}>
                  <textarea
                    name="message" value={form.message} onChange={handle}
                    placeholder="Describe your requirement — e.g. We have 3 schools in Bastar district without electricity. Need solar panels and water pump system..."
                    rows={4} maxLength={500}
                  />
                </div>
                <div className="char-count">{charCount}/500 characters</div>
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              {/* Newsletter */}
              <label className="newsletter-check">
                <input type="checkbox" name="newsletter" checked={form.newsletter} onChange={handle} />
                <span className="checkmark" />
                <span>Subscribe to UrjaDhara updates — solar news, scheme alerts, and planning tips</span>
              </label>

              <button type="submit" className="contact-submit-btn">
                <span>📤 Send Enquiry</span>
                <span className="btn-arrow">→</span>
              </button>

              <p className="form-note">🔒 Your information is secure and will never be shared with third parties.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

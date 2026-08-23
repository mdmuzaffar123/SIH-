import { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import './AdminDashboard.css';

const ADMIN_PASS = 'admin123';

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     color: '#f9a825', bg: '#fff8e1' },
  'in-progress': { label: 'In Progress', color: '#0288d1', bg: '#e1f5fe' },
  resolved:    { label: 'Resolved',    color: '#2d7a2d', bg: '#e8f5e9' },
};

const URGENCY_CONFIG = {
  high:   { label: 'High',   color: '#c62828', bg: '#ffebee' },
  normal: { label: 'Normal', color: '#e65100', bg: '#fff3e0' },
  low:    { label: 'Low',    color: '#2d7a2d', bg: '#e8f5e9' },
};

function Badge({ config, value }) {
  const c = config[value] || {};
  return <span className="badge" style={{ color: c.color, background: c.bg }}>{c.label || value}</span>;
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="adm-stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="adm-stat-icon" style={{ background: color + '18', color }}>{icon}</div>
      <div>
        <div className="adm-stat-val">{value}</div>
        <div className="adm-stat-label">{label}</div>
        {sub && <div className="adm-stat-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { inquiries, registeredUsers, updateStatus, deleteInquiry } = useAdmin();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // ── Stats (always computed — hooks must not be after early return) ──
  const totalInq = inquiries.length;
  const pending = inquiries.filter(i => i.status === 'pending').length;
  const inProgress = inquiries.filter(i => i.status === 'in-progress').length;
  const resolved = inquiries.filter(i => i.status === 'resolved').length;
  const highUrgency = inquiries.filter(i => i.urgency === 'high').length;
  const solarInq = inquiries.filter(i => i.enquiryType?.toLowerCase().includes('solar')).length;
  const waterInq = inquiries.filter(i => i.enquiryType?.toLowerCase().includes('water')).length;
  const newsletter = inquiries.filter(i => i.newsletter).length;

  // ── Filtered inquiries ──
  const filtered = useMemo(() => {
    return inquiries.filter(i => {
      if (filterType !== 'all' && i.enquiryType !== filterType) return false;
      if (filterStatus !== 'all' && i.status !== filterStatus) return false;
      if (filterUrgency !== 'all' && i.urgency !== filterUrgency) return false;
      if (filterState !== 'all' && i.state !== filterState) return false;
      if (search) {
        const q = search.toLowerCase();
        return i.name?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q) ||
          i.district?.toLowerCase().includes(q) || i.organisation?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [inquiries, filterType, filterStatus, filterUrgency, filterState, search]);

  // ── Auth gate (after all hooks) ──
  if (!authed) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <div className="admin-login-logo">🛡️</div>
          <h2>Admin Dashboard</h2>
          <p>UrjaDhara — Restricted Access</p>
          {passErr && <div className="admin-err">{passErr}</div>}
          <input
            type="password" placeholder="Enter admin password"
            value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (pass === ADMIN_PASS ? setAuthed(true) : setPassErr('Wrong password'))}
          />
          <button onClick={() => pass === ADMIN_PASS ? (setAuthed(true), setPassErr('')) : setPassErr('Wrong password')}>
            Login →
          </button>
          <small>Demo password: <code>admin123</code></small>
        </div>
      </div>
    );
  }

  // ── Unique values for filters ──
  const allTypes = [...new Set(inquiries.map(i => i.enquiryType).filter(Boolean))];
  const allStates = [...new Set(inquiries.map(i => i.state).filter(Boolean))];

  // ── Inquiry type breakdown ──
  const typeBreakdown = allTypes.map(type => ({
    type, count: inquiries.filter(i => i.enquiryType === type).length
  })).sort((a, b) => b.count - a.count);

  const stateBreakdown = allStates.map(state => ({
    state, count: inquiries.filter(i => i.state === state).length
  })).sort((a, b) => b.count - a.count);

  const TABS = [
    { id: 'overview', label: '📊 Overview', },
    { id: 'inquiries', label: `📋 All Inquiries (${totalInq})` },
    { id: 'solar', label: `☀️ Solar (${solarInq})` },
    { id: 'water', label: `💧 Water (${waterInq})` },
    { id: 'users', label: `👥 Users (${registeredUsers.length})` },
    { id: 'newsletter', label: `📧 Newsletter (${newsletter})` },
  ];

  const getTabInquiries = () => {
    if (activeTab === 'solar') return filtered.filter(i => i.enquiryType?.toLowerCase().includes('solar'));
    if (activeTab === 'water') return filtered.filter(i => i.enquiryType?.toLowerCase().includes('water'));
    return filtered;
  };

  const tabInquiries = getTabInquiries();

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>☀️</span>
          <div>
            <strong>UrjaDhara</strong>
            <small>Admin Panel</small>
          </div>
        </div>
        <nav className="admin-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={() => setAuthed(false)}>🚪 Logout</button>
          <a href="/" className="admin-site-btn">🌐 View Site</a>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{TABS.find(t => t.id === activeTab)?.label}</h1>
            <p>Last updated: {new Date().toLocaleString()}</p>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-badge-live">● Live</span>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="adm-stats-grid">
              <StatCard icon="📋" label="Total Inquiries" value={totalInq} sub={`${highUrgency} high urgency`} color="#2d7a2d" />
              <StatCard icon="⏳" label="Pending" value={pending} sub="Needs attention" color="#f9a825" />
              <StatCard icon="🔄" label="In Progress" value={inProgress} sub="Being handled" color="#0288d1" />
              <StatCard icon="✅" label="Resolved" value={resolved} sub={`${totalInq ? Math.round(resolved/totalInq*100) : 0}% resolution rate`} color="#4caf50" />
              <StatCard icon="☀️" label="Solar Inquiries" value={solarInq} sub="Energy related" color="#ff8f00" />
              <StatCard icon="💧" label="Water Inquiries" value={waterInq} sub="Water systems" color="#0288d1" />
              <StatCard icon="👥" label="Registered Users" value={registeredUsers.length} sub="Active accounts" color="#7b1fa2" />
              <StatCard icon="📧" label="Newsletter Subs" value={newsletter} sub="Email subscribers" color="#e65100" />
            </div>

            <div className="adm-charts-row">
              <div className="adm-chart-box">
                <h3>Inquiries by Type</h3>
                {typeBreakdown.map((t, i) => (
                  <div key={i} className="adm-bar-row">
                    <span className="adm-bar-label">{t.type}</span>
                    <div className="adm-bar-track">
                      <div className="adm-bar-fill" style={{ width: `${(t.count / totalInq) * 100}%` }} />
                    </div>
                    <span className="adm-bar-count">{t.count}</span>
                  </div>
                ))}
              </div>

              <div className="adm-chart-box">
                <h3>Inquiries by State</h3>
                {stateBreakdown.map((s, i) => (
                  <div key={i} className="adm-bar-row">
                    <span className="adm-bar-label">{s.state}</span>
                    <div className="adm-bar-track">
                      <div className="adm-bar-fill state-bar" style={{ width: `${(s.count / totalInq) * 100}%` }} />
                    </div>
                    <span className="adm-bar-count">{s.count}</span>
                  </div>
                ))}
              </div>

              <div className="adm-chart-box">
                <h3>Status Breakdown</h3>
                <div className="adm-donut-wrap">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                    const count = inquiries.filter(i => i.status === key).length;
                    const pct = Math.round((count / totalInq) * 100);
                    return (
                      <div key={key} className="adm-status-row">
                        <span className="adm-status-dot" style={{ background: cfg.color }} />
                        <span className="adm-status-name">{cfg.label}</span>
                        <div className="adm-bar-track">
                          <div className="adm-bar-fill" style={{ width: `${pct}%`, background: cfg.color }} />
                        </div>
                        <span className="adm-bar-count">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
                <h3 style={{ marginTop: 20 }}>Urgency Breakdown</h3>
                {Object.entries(URGENCY_CONFIG).map(([key, cfg]) => {
                  const count = inquiries.filter(i => i.urgency === key).length;
                  return (
                    <div key={key} className="adm-status-row">
                      <span className="adm-status-dot" style={{ background: cfg.color }} />
                      <span className="adm-status-name">{cfg.label}</span>
                      <div className="adm-bar-track">
                        <div className="adm-bar-fill" style={{ width: `${(count/totalInq)*100}%`, background: cfg.color }} />
                      </div>
                      <span className="adm-bar-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="adm-recent-box">
              <h3>Recent Inquiries</h3>
              <table className="adm-table">
                <thead><tr><th>Name</th><th>Type</th><th>State</th><th>Urgency</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {inquiries.slice(0, 5).map(i => (
                    <tr key={i.id} onClick={() => setSelected(i)} className="adm-table-row">
                      <td><strong>{i.name}</strong><br /><small>{i.organisation}</small></td>
                      <td>{i.enquiryType}</td>
                      <td>{i.state}</td>
                      <td><Badge config={URGENCY_CONFIG} value={i.urgency} /></td>
                      <td><Badge config={STATUS_CONFIG} value={i.status} /></td>
                      <td>{i.date?.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── INQUIRY TABLES (All / Solar / Water) ── */}
        {(activeTab === 'inquiries' || activeTab === 'solar' || activeTab === 'water') && (
          <div className="admin-inquiries">
            {/* Filters */}
            <div className="adm-filters">
              <input className="adm-search" placeholder="🔍 Search name, email, district..." value={search} onChange={e => setSearch(e.target.value)} />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}>
                <option value="all">All Urgency</option>
                {Object.entries(URGENCY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={filterState} onChange={e => setFilterState(e.target.value)}>
                <option value="all">All States</option>
                {allStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {activeTab === 'inquiries' && (
                <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="all">All Types</option>
                  {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
              <span className="adm-result-count">{tabInquiries.length} results</span>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>#</th><th>Name & Org</th><th>Contact</th><th>Location</th>
                    <th>Enquiry Type</th><th>Facility</th><th>Urgency</th><th>Status</th><th>Date</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tabInquiries.length === 0 && (
                    <tr><td colSpan={10} className="adm-empty">No inquiries found</td></tr>
                  )}
                  {tabInquiries.map((inq, idx) => (
                    <tr key={inq.id} className="adm-table-row">
                      <td className="adm-idx">{idx + 1}</td>
                      <td>
                        <div className="adm-name-cell">
                          <div className="adm-avatar">{inq.name?.charAt(0)}</div>
                          <div>
                            <strong>{inq.name}</strong>
                            <small>{inq.organisation}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <small>{inq.email}</small><br />
                        <small>📱 {inq.mobile}</small>
                      </td>
                      <td><small>{inq.state}</small><br /><small>{inq.district}</small></td>
                      <td><span className="adm-type-chip">{inq.enquiryType}</span></td>
                      <td><small>{inq.facilityType}</small></td>
                      <td><Badge config={URGENCY_CONFIG} value={inq.urgency} /></td>
                      <td>
                        <select
                          className="adm-status-select"
                          value={inq.status}
                          onChange={e => updateStatus(inq.id, e.target.value)}
                          style={{ color: STATUS_CONFIG[inq.status]?.color }}
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td><small>{inq.date?.toLocaleDateString()}</small></td>
                      <td>
                        <div className="adm-actions">
                          <button className="adm-btn-view" onClick={() => setSelected(inq)} title="View">👁</button>
                          <button className="adm-btn-del" onClick={() => setConfirmDelete(inq.id)} title="Delete">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'users' && (
          <div className="admin-users">
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Mobile</th><th>Role</th><th>State</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {registeredUsers.length === 0 && <tr><td colSpan={7} className="adm-empty">No registered users yet</td></tr>}
                  {registeredUsers.map((u, i) => (
                    <tr key={i} className="adm-table-row">
                      <td className="adm-idx">{i + 1}</td>
                      <td>
                        <div className="adm-name-cell">
                          <div className="adm-avatar">{u.name?.charAt(0)}</div>
                          <strong>{u.name}</strong>
                        </div>
                      </td>
                      <td><small>{u.email}</small></td>
                      <td><small>+91 {u.mobile}</small></td>
                      <td><span className="adm-role-chip">{u.role || 'User'}</span></td>
                      <td><small>{u.state || '—'}</small></td>
                      <td><small>{u.joinDate?.toLocaleDateString()}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── NEWSLETTER ── */}
        {activeTab === 'newsletter' && (
          <div className="admin-newsletter">
            <div className="adm-newsletter-header">
              <div className="adm-nl-stat"><strong>{newsletter}</strong><span>Subscribers</span></div>
              <div className="adm-nl-stat"><strong>{inquiries.filter(i => !i.newsletter).length}</strong><span>Not Subscribed</span></div>
              <div className="adm-nl-stat"><strong>{totalInq ? Math.round(newsletter / totalInq * 100) : 0}%</strong><span>Subscription Rate</span></div>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>State</th><th>Enquiry Type</th><th>Subscribed</th></tr></thead>
                <tbody>
                  {inquiries.filter(i => i.newsletter).map((i, idx) => (
                    <tr key={i.id} className="adm-table-row">
                      <td className="adm-idx">{idx + 1}</td>
                      <td><strong>{i.name}</strong></td>
                      <td><small>{i.email}</small></td>
                      <td><small>{i.state}</small></td>
                      <td><small>{i.enquiryType}</small></td>
                      <td><span className="badge" style={{ color: '#2d7a2d', background: '#e8f5e9' }}>✓ Yes</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="adm-modal-overlay" onClick={() => setSelected(null)}>
          <div className="adm-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="adm-modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="adm-detail-header">
              <div className="adm-detail-avatar">{selected.name?.charAt(0)}</div>
              <div>
                <h2>{selected.name}</h2>
                <p>{selected.organisation}</p>
                <div className="adm-detail-badges">
                  <Badge config={URGENCY_CONFIG} value={selected.urgency} />
                  <Badge config={STATUS_CONFIG} value={selected.status} />
                </div>
              </div>
            </div>
            <div className="adm-detail-grid">
              {[
                ['✉️ Email', selected.email],
                ['📱 Mobile', `+91 ${selected.mobile}`],
                ['📍 State', selected.state],
                ['🏘️ District', selected.district],
                ['🏫 Facility', selected.facilityType],
                ['📋 Enquiry', selected.enquiryType],
                ['📅 Date', selected.date?.toLocaleString()],
                ['📧 Newsletter', selected.newsletter ? 'Subscribed' : 'Not subscribed'],
              ].map(([label, val]) => (
                <div key={label} className="adm-detail-item">
                  <span className="adm-detail-label">{label}</span>
                  <span className="adm-detail-val">{val}</span>
                </div>
              ))}
            </div>
            <div className="adm-detail-message">
              <strong>💬 Message</strong>
              <p>{selected.message}</p>
            </div>
            <div className="adm-detail-actions">
              <label>Update Status:</label>
              <select value={selected.status} onChange={e => { updateStatus(selected.id, e.target.value); setSelected(s => ({ ...s, status: e.target.value })); }}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <a href={`mailto:${selected.email}`} className="adm-reply-btn">✉️ Reply via Email</a>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Delete ── */}
      {confirmDelete && (
        <div className="adm-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="adm-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-confirm-icon">🗑️</div>
            <h3>Delete Inquiry?</h3>
            <p>This action cannot be undone.</p>
            <div className="adm-confirm-btns">
              <button className="adm-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="adm-delete-btn" onClick={() => { deleteInquiry(confirmDelete); setConfirmDelete(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

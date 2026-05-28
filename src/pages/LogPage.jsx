import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import PageSeo from '../components/PageSeo.jsx';
import AccessibilityMenu from '../components/AccessibilityMenu.jsx';
import { FiPhone, FiMessageSquare, FiLogOut, FiRefreshCw, FiFilter } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const SOURCE_LABELS = {
  floating_button: 'כפתור צף',
  contact_form: 'טופס יצירת קשר',
  catalog: 'קטלוג',
};

const TYPE_LABELS = {
  whatsapp: 'וואטסאפ',
  phone: 'התקשרות',
};

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function isMobile(ua = '') {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) ? 'מובייל' : 'מחשב';
}

/* ─── LOGIN ─────────────────────────────────────────── */
function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const hash = await sha256(password);
    setLoading(false);
    const storedHash = localStorage.getItem('israelfix_tech_password_hash') || HASH;
    if (hash === storedHash) {
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#002C3E] flex items-center justify-center p-4">
      <div className="bg-[#003a52] rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-white/10 text-right">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#78BCC4]/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FiFilter className="w-7 h-7 text-[#78BCC4]" />
          </div>
          <h1 className="text-xl font-black text-white">יומן פעילות</h1>
          <p className="text-white/50 text-sm mt-1">כניסה למנהל</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-right outline-none focus:border-[#78BCC4]"
          />
          {error && <p className="text-[#F7444E] text-sm text-center">סיסמה שגויה</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#78BCC4] hover:bg-[#5fa8b0] text-[#002C3E] font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'בודק...' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────── */
export default function LogPage() {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem('israelfix_log_authed'));
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all | whatsapp | phone

  const handleLogin = () => {
    sessionStorage.setItem('israelfix_log_authed', '1');
    setAuthed(true);
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('click_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (!error && data) {
        const local = JSON.parse(localStorage.getItem('israelfix_click_logs') || '[]');
        const supabaseIds = new Set(data.map((r) => r.id));
        const mergedLocal = local.filter((r) => !supabaseIds.has(r.id));
        setLogs([...data, ...mergedLocal].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        setLoading(false);
        return;
      }
    } catch (_) {}

    const local = JSON.parse(localStorage.getItem('israelfix_click_logs') || '[]');
    setLogs(local);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) loadLogs();
  }, [authed]);

  if (!authed) return <LoginForm onSuccess={handleLogin} />;

  const filtered = filter === 'all' ? logs : logs.filter((l) => l.type === filter);
  const countWhatsapp = logs.filter((l) => l.type === 'whatsapp').length;
  const countPhone = logs.filter((l) => l.type === 'phone').length;

  return (
    <div className="min-h-screen bg-[#002C3E] text-white" dir="rtl">
      <PageSeo
        title="יומן פעילות"
        description="יומן לחיצות על כפתורי יצירת קשר"
        path="/log"
      />
      <AccessibilityMenu stackAboveWhatsApp={false} />

      {/* Header */}
      <header className="bg-[#001f2e] border-b border-white/10 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiFilter className="w-5 h-5 text-[#78BCC4]" />
          <span className="font-black text-lg">יומן פעילות</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadLogs}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            רענן
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('israelfix_log_authed'); setAuthed(false); }}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-[#F7444E] transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            יציאה
          </button>
          <Link to="/" className="text-sm text-[#78BCC4] hover:underline">חזרה לאתר</Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-[#003a52] rounded-2xl p-5 border border-white/10 text-center">
            <FaWhatsapp className="w-7 h-7 text-[#06d6a0] mx-auto mb-2" />
            <div className="text-3xl font-black text-white">{countWhatsapp}</div>
            <div className="text-white/50 text-sm mt-1">לחיצות וואטסאפ</div>
          </div>
          <div className="bg-[#003a52] rounded-2xl p-5 border border-white/10 text-center">
            <FiPhone className="w-7 h-7 text-[#F7444E] mx-auto mb-2" />
            <div className="text-3xl font-black text-white">{countPhone}</div>
            <div className="text-white/50 text-sm mt-1">לחיצות התקשרות</div>
          </div>
          <div className="col-span-2 md:col-span-1 bg-[#003a52] rounded-2xl p-5 border border-white/10 text-center">
            <FiMessageSquare className="w-7 h-7 text-[#78BCC4] mx-auto mb-2" />
            <div className="text-3xl font-black text-white">{logs.length}</div>
            <div className="text-white/50 text-sm mt-1">סה"כ אירועים</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'הכל' },
            { key: 'whatsapp', label: 'וואטסאפ' },
            { key: 'phone', label: 'התקשרות' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                filter === key
                  ? 'bg-[#78BCC4] text-[#002C3E]'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#003a52] rounded-2xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-white/40">טוען נתונים...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-white/40">אין נתונים להצגה</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-xs uppercase">
                    <th className="text-right px-5 py-3">תאריך ושעה</th>
                    <th className="text-right px-5 py-3">סוג</th>
                    <th className="text-right px-5 py-3">מקור</th>
                    <th className="text-right px-5 py-3">מכשיר</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, i) => (
                    <tr
                      key={log.id ?? i}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-white/70 whitespace-nowrap" dir="ltr">
                        {formatDate(log.created_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          log.type === 'whatsapp'
                            ? 'bg-[#06d6a0]/20 text-[#06d6a0]'
                            : 'bg-[#F7444E]/20 text-[#F7444E]'
                        }`}>
                          {log.type === 'whatsapp' ? <FaWhatsapp className="w-3 h-3" /> : <FiPhone className="w-3 h-3" />}
                          {TYPE_LABELS[log.type] ?? log.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/60">
                        {SOURCE_LABELS[log.source] ?? log.source ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-white/50 text-xs">
                        {isMobile(log.user_agent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SQL hint */}
        <details className="bg-[#001f2e] rounded-xl border border-white/10 text-xs text-white/40">
          <summary className="px-4 py-3 cursor-pointer select-none hover:text-white/60 transition-colors">
            יצירת טבלה ב-Supabase (הרחב)
          </summary>
          <pre className="px-4 pb-4 overflow-x-auto text-[11px] leading-relaxed whitespace-pre-wrap">{`CREATE TABLE IF NOT EXISTS public.click_logs (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  source TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.click_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read and write"
  ON public.click_logs FOR ALL USING (true) WITH CHECK (true);`}</pre>
        </details>
      </div>
    </div>
  );
}

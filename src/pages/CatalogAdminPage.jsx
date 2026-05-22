import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons.jsx';
import AccessibilityMenu from '../components/AccessibilityMenu.jsx';
import PageSeo from '../components/PageSeo.jsx';
import { supabase } from '../lib/supabase.js';

// סיסמת כניסה: admin123
const HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* ─── LOGIN ─────────────────────────────────────────────── */
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
    if (hash === HASH) onSuccess();
    else setError(true);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto text-right">
      <div className="mb-6">
        <label className="block text-sm font-bold text-[#2a8fa0] mb-2">סיסמת מנהל קטלוג</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="הזן סיסמה"
          className="w-full bg-[#F4F9FA] px-4 py-3.5 rounded-xl border border-[#002C3E]/20 outline-none focus:border-[#78BCC4] focus:bg-white transition-all text-[#002C3E] text-right text-sm placeholder:text-[#002C3E]/35"
          autoFocus
        />
      </div>
      {error && <p className="text-[#F7444E] text-sm font-semibold mb-4 text-center">סיסמה שגויה. נסה שנית.</p>}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full bg-[#F7444E] hover:bg-[#de3d46] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
      >
        {loading ? 'מאמת...' : 'כניסה לניהול קטלוג'}
      </button>
    </form>
  );
}

/* ─── THUMBNAIL ──────────────────────────────────────────── */
function Thumbnail({ src }) {
  return (
    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#EEF6F8] shrink-0 flex items-center justify-center">
      {src ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <svg className="w-6 h-6 text-[#002C3E]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  );
}

/* ─── PRODUCT ROW ────────────────────────────────────────── */
function ProductRow({ product, index, isOpen, onToggle, onChange, onRemove }) {
  const set = (field) => (e) => onChange(index, { ...product, [field]: e.target.value });
  const [uploadState, setUploadState] = useState({ loading: false, error: null });
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadState({ loading: true, error: null });
    const ext = file.name.split('.').pop().toLowerCase();
    const fileName = `product-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('catalog-images')
      .upload(fileName, file, { upsert: true });
    if (error) {
      setUploadState({ loading: false, error: 'שגיאה בהעלאה, נסה שנית' });
      return;
    }
    const { data: urlData } = supabase.storage.from('catalog-images').getPublicUrl(fileName);
    onChange(index, { ...product, image: urlData.publicUrl });
    setUploadState({ loading: false, error: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const inputCls = "w-full bg-[#F4F9FA] px-3 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white transition-all text-[#002C3E] text-sm placeholder:text-[#002C3E]/35";

  return (
    <div className={`transition-colors ${isOpen ? 'bg-[#FAFCFD]' : 'hover:bg-[#F9FAFB]'}`}>

      {/* ── DESKTOP ROW ── */}
      <div className="hidden md:grid grid-cols-[56px_1fr_108px_1fr_128px] gap-4 items-center px-5 py-3.5">
        <Thumbnail src={product.image} />
        <p className="font-semibold text-[#002C3E] text-sm truncate leading-snug">
          {product.name || <span className="text-[#002C3E]/30 italic">ללא שם</span>}
        </p>
        <p className="text-[#F7444E] font-black text-sm">{product.price || <span className="text-[#002C3E]/30">—</span>}</p>
        <p className="text-[#002C3E]/45 text-sm truncate">{product.description || <span className="italic">—</span>}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onToggle}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isOpen
                ? 'bg-[#002C3E] text-white'
                : 'bg-[#EEF6F8] hover:bg-[#002C3E] text-[#002C3E] hover:text-white'
            }`}
          >
            {isOpen ? 'סגור' : 'ערוך'}
          </button>
          <button
            onClick={() => onRemove(index)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#002C3E]/30 hover:text-[#F7444E] hover:bg-[#FEF2F2] transition-all"
            title="מחק מוצר"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── MOBILE ROW ── */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3.5">
        <Thumbnail src={product.image} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#002C3E] text-sm truncate">
            {product.name || <span className="text-[#002C3E]/30 italic">ללא שם</span>}
          </p>
          <p className="text-[#F7444E] text-sm font-black">{product.price || '—'}</p>
        </div>
        <button
          onClick={onToggle}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
            isOpen
              ? 'bg-[#002C3E] text-white'
              : 'bg-[#EEF6F8] hover:bg-[#002C3E] text-[#002C3E] hover:text-white'
          }`}
        >
          {isOpen ? 'סגור' : 'ערוך'}
        </button>
        <button
          onClick={() => onRemove(index)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#002C3E]/30 hover:text-[#F7444E] hover:bg-[#FEF2F2] transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* ── EDIT FORM (accordion, shared desktop + mobile) ── */}
      {isOpen && (
        <div className="border-t border-[#002C3E]/8 px-4 md:px-5 py-5 space-y-4 bg-[#F8FAFB]">

          {/* Image */}
          <div className="space-y-2">
            {product.image && (
              <div className="relative w-full max-w-xs aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F9FA] border border-[#002C3E]/10">
                <img src={product.image} alt="תצוגה מקדימה" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange(index, { ...product, image: '' })}
                  className="absolute top-2 left-2 bg-black/50 hover:bg-[#F7444E] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all font-bold"
                >✕</button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadState.loading}
                className="flex items-center gap-1.5 bg-[#EBF5F7] hover:bg-[#d8edf0] text-[#2a8fa0] text-xs font-bold px-3 py-2.5 rounded-xl transition-all disabled:opacity-50 whitespace-nowrap border border-[#78BCC4]/30"
              >
                {uploadState.loading ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
                {uploadState.loading ? 'מעלה...' : 'העלה תמונה'}
              </button>
              <input
                type="text"
                value={product.image}
                onChange={set('image')}
                placeholder="או הכנס קישור URL"
                className="flex-1 bg-[#F4F9FA] px-3 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white transition-all text-[#002C3E] text-xs placeholder:text-[#002C3E]/35"
                dir="ltr"
              />
            </div>
            {uploadState.error && <p className="text-[#F7444E] text-xs font-semibold">{uploadState.error}</p>}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFileUpload} className="hidden" />
          </div>

          {/* Name + Price — 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={product.name}
              onChange={set('name')}
              placeholder="שם המוצר"
              className={inputCls + " text-right"}
            />
            <input
              type="text"
              value={product.price}
              onChange={set('price')}
              placeholder="₪ מחיר"
              className={inputCls + " text-right"}
            />
          </div>

          {/* Description */}
          <textarea
            rows={2}
            value={product.description}
            onChange={set('description')}
            placeholder="תיאור קצר (אופציונלי)"
            className={inputCls + " resize-none text-right"}
          />
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN PANEL ────────────────────────────────────────── */
function AdminPanel() {
  const [data, setData] = useState({ enabled: false, products: [] });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    supabase
      .from('catalog_data')
      .select('enabled, products')
      .eq('id', 1)
      .single()
      .then(({ data: row }) => {
        if (row) setData(row);
        setLoading(false);
      });
  }, []);

  const saveToSupabase = async (next) => {
    setSaveError(false);
    const { error } = await supabase
      .from('catalog_data')
      .upsert({ id: 1, enabled: next.enabled, products: next.products, updated_at: new Date().toISOString() });
    if (error) setSaveError(true);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const updateData = (patch) => {
    const next = { ...data, ...patch };
    setData(next);
    saveToSupabase(next);
  };

  const addProduct = () => {
    if (data.products.length >= 10) return;
    const newIndex = data.products.length;
    const next = { ...data, products: [...data.products, { name: '', image: '', price: '', description: '' }] };
    setData(next);
    saveToSupabase(next);
    setOpenIndex(newIndex); // auto-open
  };

  const updateProduct = (index, product) => {
    const products = [...data.products];
    products[index] = product;
    updateData({ products });
  };

  const removeProduct = (index) => {
    const products = data.products.filter((_, i) => i !== index);
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex > index) setOpenIndex(openIndex - 1);
    updateData({ products });
  };

  const refreshFromDB = () => {
    setLoading(true);
    setOpenIndex(null);
    supabase
      .from('catalog_data')
      .select('enabled, products')
      .eq('id', 1)
      .single()
      .then(({ data: row }) => {
        if (row) setData(row);
        setLoading(false);
      });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'catalog.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#002C3E]/40 text-sm gap-3">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        טוען נתונים...
      </div>
    );
  }

  return (
    <div className="text-[#002C3E] text-right space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#06d6a0] rounded-xl flex items-center justify-center shrink-0">
            <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-black text-[#002C3E]">ניהול קטלוג</h2>
            <p className="text-[#002C3E]/40 text-xs">{data.products.length}/10 מוצרים</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-[#06d6a0] text-xs font-bold bg-[#06d6a0]/10 px-2 py-1 rounded-lg">✓ נשמר</span>}
          {saveError && <span className="text-[#F7444E] text-xs font-bold">שגיאת שמירה</span>}
        </div>
      </div>

      {/* Toggle */}
      <label className="flex items-center gap-3 cursor-pointer bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-4 py-3.5">
        <div className="relative shrink-0">
          <input
            type="checkbox"
            checked={data.enabled}
            onChange={(e) => updateData({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-10 h-5 bg-[#002C3E]/15 rounded-full peer-checked:bg-[#06d6a0] transition-colors" />
          <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-[-20px] transition-transform" />
        </div>
        <span className="text-sm font-bold text-[#002C3E]">הצג קטלוג בעמוד הראשי</span>
      </label>

      {/* Table */}
      {data.products.length > 0 ? (
        <div className="rounded-xl border border-[#002C3E]/10 overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[56px_1fr_108px_1fr_128px] gap-4 px-5 py-2.5 bg-[#F4F9FA] border-b border-[#002C3E]/10">
            <span className="text-xs font-bold text-[#002C3E]/40 uppercase tracking-wider">תמונה</span>
            <span className="text-xs font-bold text-[#002C3E]/40 uppercase tracking-wider">שם המוצר</span>
            <span className="text-xs font-bold text-[#002C3E]/40 uppercase tracking-wider">מחיר</span>
            <span className="text-xs font-bold text-[#002C3E]/40 uppercase tracking-wider">תיאור</span>
            <span className="text-xs font-bold text-[#002C3E]/40 uppercase tracking-wider text-left">פעולות</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#002C3E]/8">
            {data.products.map((product, i) => (
              <ProductRow
                key={i}
                product={product}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(prev => prev === i ? null : i)}
                onChange={updateProduct}
                onRemove={removeProduct}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-[#002C3E]/15 py-10 text-center text-[#002C3E]/30 text-sm">
          אין מוצרים עדיין — הוסף את המוצר הראשון
        </div>
      )}

      {/* Add product */}
      {data.products.length < 10 && (
        <button
          onClick={addProduct}
          className="w-full border-2 border-dashed border-[#002C3E]/20 hover:border-[#78BCC4] text-[#002C3E]/40 hover:text-[#78BCC4] px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-[#EBF5F7] flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          הוסף מוצר
        </button>
      )}

      {/* Bottom actions */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={refreshFromDB}
          className="flex-1 bg-[#002C3E]/8 hover:bg-[#002C3E]/15 text-[#002C3E] px-5 py-2.5 rounded-xl font-bold text-sm transition-all border border-[#002C3E]/10 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          רענן
        </button>
        <button
          onClick={exportJson}
          className="flex-1 bg-[#78BCC4] hover:bg-[#6aacb4] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          ייצוא JSON
        </button>
      </div>
    </div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────── */
export default function CatalogAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageSeo title="ניהול קטלוג" description="ניהול קטלוג מוצרים - israelfix" path="/catalog" />
      <AccessibilityMenu stackAboveWhatsApp={false} />
      <div className="min-h-screen bg-[#EEF6F8] font-sans">
        <header className="bg-white border-b border-[#002C3E]/10 py-4 shadow-sm">
          <div className="container mx-auto px-5 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#78BCC4]/15 border border-[#78BCC4]/40 rounded-xl flex items-center justify-center text-[#78BCC4]">
                <Icons.Electric className="w-4 h-4" />
              </div>
              <span className="font-display text-lg font-black tracking-tight text-[#002C3E]">
                israelfix<span className="text-[#F7444E]">.</span>
              </span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[#002C3E]/50 hover:text-[#002C3E] transition-colors text-sm font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
              </svg>
              חזרה לאתר
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 md:px-6 py-10 max-w-2xl">
          <div className="bg-white border border-[#002C3E]/10 rounded-2xl p-5 md:p-7 shadow-sm">
            {authenticated
              ? <AdminPanel />
              : <LoginForm onSuccess={() => setAuthenticated(true)} />
            }
          </div>
        </main>

        <footer className="border-t border-[#002C3E]/10 py-5 text-center text-xs text-[#002C3E]/30 font-medium">
          &copy; {new Date().getFullYear()} israelfix · ניהול קטלוג
        </footer>
      </div>
    </>
  );
}

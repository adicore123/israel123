import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons.jsx';
import AccessibilityMenu from '../components/AccessibilityMenu.jsx';
import PageSeo from '../components/PageSeo.jsx';
import { supabase } from '../lib/supabase.js';

const HASH = '2dae8ae7c497683869fd69dce52fa6f4fa58f405cbfd5b4599c9676902eba6d2';

async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

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
    if (hash === HASH) {
      onSuccess();
    } else {
      setError(true);
    }
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
      {error && (
        <p className="text-[#F7444E] text-sm font-semibold mb-4 text-center">סיסמה שגויה. נסה שנית.</p>
      )}
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

function ProductForm({ product, index, onChange, onRemove }) {
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
    const { data: urlData } = supabase.storage
      .from('catalog-images')
      .getPublicUrl(fileName);
    onChange(index, { ...product, image: urlData.publicUrl });
    setUploadState({ loading: false, error: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white border border-[#002C3E]/10 rounded-xl p-5 space-y-3 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#002C3E]/40 text-xs font-bold">מוצר #{index + 1}</span>
        <button
          onClick={() => onRemove(index)}
          className="text-[#F7444E] hover:text-white hover:bg-[#F7444E] text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
        >
          הסר
        </button>
      </div>

      <input
        type="text"
        value={product.name}
        onChange={set('name')}
        placeholder="שם המוצר"
        className="w-full bg-[#F4F9FA] px-4 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white transition-all text-[#002C3E] text-right text-sm placeholder:text-[#002C3E]/35"
      />

      {/* Image upload section */}
      <div className="space-y-2">
        {product.image && (
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F4F9FA] border border-[#002C3E]/10">
            <img src={product.image} alt="תצוגה מקדימה" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(index, { ...product, image: '' })}
              className="absolute top-2 left-2 bg-black/50 hover:bg-[#F7444E] text-white w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all font-bold"
              title="הסר תמונה"
            >
              ✕
            </button>
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

        {uploadState.error && (
          <p className="text-[#F7444E] text-xs font-semibold">{uploadState.error}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <input
        type="text"
        value={product.price}
        onChange={set('price')}
        placeholder='מחיר (לדוגמה: ₪150)'
        className="w-full bg-[#F4F9FA] px-4 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white transition-all text-[#002C3E] text-right text-sm placeholder:text-[#002C3E]/35"
      />
      <textarea
        rows={2}
        value={product.description}
        onChange={set('description')}
        placeholder="תיאור קצר (אופציונלי)"
        className="w-full bg-[#F4F9FA] px-4 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white transition-all text-[#002C3E] text-right text-sm resize-none placeholder:text-[#002C3E]/35"
      />
    </div>
  );
}

function AdminPanel() {
  const [data, setData] = useState({ enabled: false, products: [] });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);

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
    if (error) {
      setSaveError(true);
    } else {
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
    const next = { ...data, products: [...data.products, { name: '', image: '', price: '', description: '' }] };
    setData(next);
    saveToSupabase(next);
  };

  const updateProduct = (index, product) => {
    const products = [...data.products];
    products[index] = product;
    updateData({ products });
  };

  const removeProduct = (index) => {
    const products = data.products.filter((_, i) => i !== index);
    updateData({ products });
  };

  const refreshFromDB = () => {
    setLoading(true);
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
    <div className="text-[#002C3E] text-right space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#06d6a0] rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-black text-[#002C3E]">ניהול קטלוג</h2>
            <p className="text-[#002C3E]/40 text-xs">{data.products.length}/10 מוצרים</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="text-[#06d6a0] text-xs font-bold">נשמר!</span>}
          {saveError && <span className="text-[#F7444E] text-xs font-bold">שגיאת שמירה</span>}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-5 py-4">
        <div className="relative">
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

      <div className="space-y-4">
        {data.products.map((product, i) => (
          <ProductForm
            key={i}
            product={product}
            index={i}
            onChange={updateProduct}
            onRemove={removeProduct}
          />
        ))}
      </div>

      {data.products.length < 10 && (
        <button
          onClick={addProduct}
          className="w-full border-2 border-dashed border-[#002C3E]/20 hover:border-[#78BCC4] text-[#002C3E]/40 hover:text-[#78BCC4] px-6 py-4 rounded-xl font-bold text-sm transition-all hover:bg-[#EBF5F7]"
        >
          + הוסף מוצר
        </button>
      )}

      <div className="flex gap-3">
        <button
          onClick={refreshFromDB}
          className="flex-1 bg-[#002C3E]/8 hover:bg-[#002C3E]/15 text-[#002C3E] px-5 py-3 rounded-xl font-bold text-sm transition-all border border-[#002C3E]/10"
        >
          רענן
        </button>
        <button
          onClick={exportJson}
          className="flex-1 bg-[#78BCC4] hover:bg-[#6aacb4] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all"
        >
          ייצוא JSON
        </button>
      </div>
    </div>
  );
}

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
      <div className="min-h-screen bg-[#EEF6F8] text-[#002C3E] font-sans">
        <header className="bg-white border-b border-[#002C3E]/10 py-5 shadow-sm">
          <div className="container mx-auto px-5 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#78BCC4]/15 border border-[#78BCC4]/40 rounded-xl flex items-center justify-center text-[#78BCC4]">
                <Icons.Electric className="w-5 h-5" />
              </div>
              <span className="font-display text-xl font-black tracking-tight text-[#002C3E]">
                israelfix<span className="text-[#F7444E]">.</span>
              </span>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 text-[#002C3E]/50 hover:text-[#002C3E] transition-colors text-sm font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7l-7-7 7-7" />
              </svg>
              חזרה לאתר
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-5 md:px-6 py-12 max-w-xl">
          <div className="bg-white border border-[#002C3E]/10 rounded-2xl p-6 md:p-8 shadow-sm">
            {authenticated ? <AdminPanel /> : <LoginForm onSuccess={() => setAuthenticated(true)} />}
          </div>
        </main>

        <footer className="border-t border-[#002C3E]/10 py-6 text-center text-xs text-[#002C3E]/30 font-medium">
          &copy; {new Date().getFullYear()} israelfix · ניהול קטלוג
        </footer>
      </div>
    </>
  );
}

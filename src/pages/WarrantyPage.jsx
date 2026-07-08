import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageSeo from '../components/PageSeo.jsx';
import AccessibilityMenu from '../components/AccessibilityMenu.jsx';
import { supabase } from '../lib/supabase.js';
import { FiCheckCircle, FiAlertTriangle, FiPhone, FiPrinter, FiArrowRight, FiShield, FiCalendar, FiUser, FiCpu } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function WarrantyPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warranty, setWarranty] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadWarranty();
  }, [id]);

  const loadWarranty = async () => {
    setLoading(true);
    setError(null);

    // Try Supabase first
    try {
      // Check if it's a UUID or integer ID
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      let query = supabase.from('warranties').select('*');
      if (isUuid) {
        query = query.eq('uuid', id);
      } else {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
          throw new Error('מזהה תעודה לא תקין');
        }
        query = query.eq('id', parsedId);
      }

      const { data, error: sbError } = await query.single();

      if (!sbError && data) {
        processWarranty(data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('Supabase warranty fetch failed or table not found, trying local storage.', err);
    }

    // Fallback to LocalStorage
    try {
      const localReps = localStorage.getItem('israelfix_warranties');
      if (localReps) {
        const list = JSON.parse(localReps);
        const item = list.find(w => w.uuid === id || String(w.id) === String(id));
        if (item) {
          processWarranty(item);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to read from localStorage:', err);
    }

    setError('תעודת האחריות לא נמצאה במערכת. אנא ודא שהקישור תקין או פנה למעבדה.');
    setLoading(false);
  };

  const processWarranty = (data) => {
    setWarranty(data);
    
    // Check if active
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(data.end_date);
    end.setHours(23, 59, 59, 999);
    
    const active = end >= today;
    setIsActive(active);

    if (active) {
      const diffTime = Math.max(0, end - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);
    } else {
      setDaysRemaining(0);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <PageSeo title="טוען תעודת אחריות..." description="טעינת תעודת אחריות דיגיטלית - israelfix" path={`/warranty/${id}`} />
        <div className="min-h-screen bg-[#002C3E] text-white flex flex-col justify-center items-center p-6 font-sans" dir="rtl">
          <div className="w-16 h-16 border-4 border-[#78BCC4] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#78BCC4] font-bold text-lg animate-pulse">טוען תעודת אחריות דיגיטלית...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageSeo title="תעודת אחריות לא נמצאה" description="תעודת אחריות דיגיטלית - israelfix" path={`/warranty/${id}`} />
        <AccessibilityMenu stackAboveWhatsApp={false} />
        <div className="min-h-screen bg-[#002C3E] text-white flex flex-col justify-center items-center p-6 font-sans" dir="rtl">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center space-y-6 backdrop-blur-md">
            <div className="w-16 h-16 bg-[#F7444E]/20 text-[#F7444E] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <FiAlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black">שגיאה באיתור התעודה</h1>
            <p className="text-white/70 text-sm leading-relaxed">{error}</p>
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/" className="bg-[#78BCC4] text-[#002C3E] hover:bg-[#6aacb4] px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2">
                <FiArrowRight /> חזרה לדף הבית
              </Link>
              <a href="https://wa.me/972545050609" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2">
                <FaWhatsapp className="text-lg" /> צור קשר עם המעבדה
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSeo 
        title={`תעודת אחריות - ${warranty.customer_name}`} 
        description={`תעודת אחריות דיגיטלית עבור תיקון במעבדת israelfix ללקוח ${warranty.customer_name}`} 
        path={`/warranty/${id}`} 
      />
      <AccessibilityMenu stackAboveWhatsApp={false} />

      <div className="min-h-screen bg-[#002C3E] text-white py-12 px-4 md:px-6 flex flex-col items-center font-sans print:bg-white print:text-black print:p-0" dir="rtl">
        
        {/* Back link - hidden on print */}
        <div className="w-full max-w-2xl mb-8 flex justify-between items-center print:hidden">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-semibold">
            <FiArrowRight className="text-lg" />
            <span>חזרה לאתר israelfix</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-[#78BCC4]">
              <FiShield className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white/70">אחריות דיגיטלית רשמית</span>
          </div>
        </div>

        {/* Certificate Card Container */}
        <div className="w-full max-w-2xl bg-gradient-to-br from-[#02374e] to-[#002534] border-2 border-[#78BCC4]/30 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md print:border-2 print:border-black print:rounded-none print:shadow-none print:bg-white print:text-black print:m-0 print:w-full">
          
          {/* Decorative Background Glows - hidden on print */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#78BCC4] opacity-10 rounded-full blur-[100px] pointer-events-none print:hidden" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#F7444E] opacity-5 rounded-full blur-[100px] pointer-events-none print:hidden" />
          
          {/* Watermark Logo - hidden on print */}
          <FiShield className="absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 w-80 h-80 text-white/5 pointer-events-none print:hidden" />

          {/* Certificate Header */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start border-b border-white/10 pb-8 gap-6 print:border-black print:pb-4">
            
            {/* Logo and Subtitle */}
            <div className="text-center md:text-right">
              <span className="font-display text-3xl font-black tracking-tight text-white print:text-black">
                israelfix<span className="text-[#F7444E]">.</span>
              </span>
              <p className="text-[11px] text-[#78BCC4] uppercase tracking-widest font-black mt-1 print:text-black">
                מעבדה וטכנאי מומחה לכלים חשמליים
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-4 print:text-black">
                תעודת אחריות דיגיטלית
              </h1>
            </div>

            {/* Status Stamp */}
            <div className="flex flex-col items-center">
              {isActive ? (
                <div className="bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 px-5 py-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/10 print:border-black print:text-black print:shadow-none">
                  <div className="flex items-center gap-2 font-black text-sm">
                    <FiCheckCircle className="text-lg animate-pulse" />
                    <span>אחריות בתוקף</span>
                  </div>
                  <span className="text-[10px] opacity-85 mt-0.5 font-bold">נותרו עוד {daysRemaining} ימים</span>
                </div>
              ) : (
                <div className="bg-[#F7444E]/10 border-2 border-[#F7444E] text-[#F7444E] px-5 py-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg shadow-[#F7444E]/10 print:border-black print:text-black print:shadow-none">
                  <div className="flex items-center gap-2 font-black text-sm">
                    <FiAlertTriangle className="text-lg" />
                    <span>פג תוקף אחריות</span>
                  </div>
                  <span className="text-[10px] opacity-85 mt-0.5 font-bold">האחריות הסתיימה</span>
                </div>
              )}
            </div>

          </div>

          {/* Certificate Body - Grid of details */}
          <div className="py-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-right print:py-6 print:gap-y-4">
            
            <div className="space-y-1.5 border-r-2 border-white/5 pr-4 print:border-black">
              <span className="text-xs text-white/50 font-bold flex items-center gap-1.5 print:text-black/60">
                <FiUser className="text-[#78BCC4] print:text-black" /> שם לקוח
              </span>
              <p className="text-lg font-extrabold text-white print:text-black">
                {warranty.customer_name}
              </p>
            </div>

            {warranty.customer_phone && (
              <div className="space-y-1.5 border-r-2 border-white/5 pr-4 print:border-black">
                <span className="text-xs text-white/50 font-bold flex items-center gap-1.5 print:text-black/60">
                  <FiPhone className="text-[#78BCC4] print:text-black" /> טלפון ליצירת קשר
                </span>
                <p className="text-lg font-extrabold text-white print:text-black">
                  {warranty.customer_phone}
                </p>
              </div>
            )}

            <div className="space-y-1.5 border-r-2 border-white/5 pr-4 md:col-span-2 print:border-black">
              <span className="text-xs text-white/50 font-bold flex items-center gap-1.5 print:text-black/60">
                <FiCpu className="text-[#78BCC4] print:text-black" /> תיאור התיקון והאחריות
              </span>
              <p className="text-base md:text-lg font-extrabold text-[#78BCC4] leading-relaxed print:text-black">
                {warranty.vehicle_description}
              </p>
            </div>

            <div className="space-y-1.5 border-r-2 border-white/5 pr-4 print:border-black">
              <span className="text-xs text-white/50 font-bold flex items-center gap-1.5 print:text-black/60">
                <FiCalendar className="text-[#78BCC4] print:text-black" /> תאריך התחלת אחריות
              </span>
              <p className="text-base font-extrabold text-white print:text-black">
                {formatDate(warranty.start_date)}
              </p>
            </div>

            <div className="space-y-1.5 border-r-2 border-white/5 pr-4 print:border-black">
              <span className="text-xs text-white/50 font-bold flex items-center gap-1.5 print:text-black/60">
                <FiCalendar className="text-[#78BCC4] print:text-black" /> תאריך סיום אחריות
              </span>
              <p className="text-base font-extrabold text-white print:text-black">
                {formatDate(warranty.end_date)}
              </p>
            </div>

            <div className="space-y-1.5 border-r-2 border-white/5 pr-4 print:border-black">
              <span className="text-xs text-white/50 font-bold flex items-center gap-1.5 print:text-black/60">
                <FiShield className="text-[#78BCC4] print:text-black" /> תקופת אחריות כוללת
              </span>
              <p className="text-base font-extrabold text-white print:text-black">
                {warranty.duration_months} חודשים
              </p>
            </div>

            {warranty.notes && (
              <div className="space-y-1.5 border-r-2 border-white/5 pr-4 md:col-span-2 print:border-black">
                <span className="text-xs text-white/50 font-bold print:text-black/60">הערות ותנאים נוספים</span>
                <p className="text-xs md:text-sm text-white/70 bg-white/5 p-3 rounded-xl leading-relaxed print:bg-none print:border print:border-black/20 print:text-black">
                  {warranty.notes}
                </p>
              </div>
            )}

          </div>

          {/* Certificate Footer Notes */}
          <div className="border-t border-white/10 pt-8 space-y-4 text-xs text-white/40 leading-relaxed text-center print:border-black print:text-black print:pt-4">
            <p>
              אחריות זו מכסה תקלות הקשורות ישירות לתיקון שבוצע כמפורט לעיל. האחריות אינה מכסה נזק פיזי, קורוזיה, שימוש לא סביר בכלי, או שינוי מערכות שבוצע על ידי גורם אחר.
            </p>
            <p className="font-bold text-[#78BCC4]/70 print:text-black">
              תעודה זו הופקה דיגיטלית על ידי מערכת israelfix והינה מסמך רשמי ומחייב של המעבדה.
            </p>
          </div>

        </div>

        {/* Action Buttons - Hidden on print */}
        <div className="w-full max-w-2xl mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center print:hidden">
          <button 
            onClick={handlePrint}
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-[#002C3E] px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 smooth-interactive active-click hover-tilt"
          >
            <FiPrinter className="text-lg" />
            <span>הדפס תעודה / שמור כ-PDF</span>
          </button>
          
          <a 
            href="https://wa.me/972545050609" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 smooth-interactive active-click hover-tilt shadow-lg shadow-[#25D366]/20"
          >
            <FaWhatsapp className="text-xl" />
            <span>צור קשר ב-WhatsApp</span>
          </a>
        </div>

        {/* Footer info */}
        <footer className="mt-12 text-center text-xs text-white/30 font-medium print:hidden">
          &copy; {new Date().getFullYear()} israelfix · כל הזכויות שמורות לטכנאי המעבדה
        </footer>

      </div>
    </>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons.jsx';
import AccessibilityMenu from '../components/AccessibilityMenu.jsx';
import PageSeo from '../components/PageSeo.jsx';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-display text-xl md:text-2xl font-black text-[#002C3E] mb-4 pb-2 border-b border-[#002C3E]/10">
      {title}
    </h2>
    <div className="space-y-3 text-[#002C3E]/75 leading-relaxed text-base md:text-lg font-medium">
      {children}
    </div>
  </div>
);

export default function AccessibilityPage() {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <PageSeo
        title="הצהרת נגישות"
        description="הצהרת נגישות אתר israelfix — התאמות נגישות, פניות לרכז נגישות ותקן ישראלי."
        path="/accessibility"
      />
      <AccessibilityMenu stackAboveWhatsApp={false} />
      <div id="site-content" className="min-h-screen bg-[#F7F8F3] text-[#002C3E] font-sans">
      {/* Header */}
      <header className="bg-[#002C3E] py-5">
        <div className="container mx-auto px-5 md:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#78BCC4]/20 border border-[#78BCC4]/40 rounded-xl flex items-center justify-center text-[#78BCC4]">
              <Icons.Electric className="w-5 h-5" />
            </div>
            <span className="font-display text-xl font-black text-white tracking-tight">
              israelfix<span className="text-[#F7444E]">.</span>
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            חזרה לאתר
          </Link>
        </div>
      </header>

      {/* Hero strip — teal accent for accessibility theme */}
      <div className="bg-[#002C3E] pb-10 pt-2">
        <div className="container mx-auto px-5 md:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#78BCC4]/20 border border-[#78BCC4]/30 text-[#78BCC4] text-xs font-bold mb-4">
            <Icons.WhyUsUsers className="w-3.5 h-3.5" />
            שוויון ונגישות
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-white mb-2">הצהרת נגישות</h1>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-5 md:px-6 py-12 md:py-16 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-sm border border-[#002C3E]/5 p-8 md:p-12">
          <div className="mb-10">
            <h2 className="font-display text-xl md:text-2xl font-black text-[#002C3E] mb-4">מבוא</h2>
            <div className="space-y-3 text-[#002C3E]/75 leading-relaxed text-base md:text-lg font-medium">
              <p>
                אנו ב-[שם העסק/האתר] רואים חשיבות עליונה במתן שירות שוויוני, מכובד, נגיש ומקצועי לכלל לקוחותינו, לרבות
                אנשים עם מוגבלויות. אנו משקיעים משאבים רבים בהנגשת האתר שלנו, במטרה לאפשר לאנשים עם מוגבלויות להשתמש
                בו בקלות ובנוחות.
              </p>
            </div>
          </div>

          <Section title="1. נגישות האתר">
            <p>
              אתר אינטרנט נגיש הוא אתר המאפשר לאנשים עם מוגבלות ולאנשים מבוגרים לגלוש באותה רמה של יעילות והנאה ככל
              הגולשים.
            </p>
            <p>
              אתר זה הונגש בהתאם להוראות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013,
              ולתקן הישראלי (ת&quot;י 5568) ברמת [ציין את הרמה, לרוב AA].
            </p>
          </Section>

          <Section title="2. פעולות ההנגשה שבוצעו באתר">
            <p>ניווט מקלדת: האתר תומך בניווט באמצעות מקלדת (שימוש במקשי Tab, Enter, והחיצים).</p>
            <p>התאמה לקוראי מסך: האתר מותאם לגלישה בעזרת תוכנות קוראות מסך (כגון NVDA, JAWS).</p>
            <p>
              הגדלת טקסט וניגודיות: שולב תפריט נגישות המאפשר לשנות את גודל הגופן, לשנות את ניגודיות הצבעים (ניגודיות
              גבוהה/כהה), ולהדגיש קישורים.
            </p>
            <p>
              תמונות: הוספנו טקסט חלופי (Alt Text) לתמונות בעלות משמעות באתר, כדי שקוראי מסך יוכלו להקריא את התיאור שלהן.
            </p>
          </Section>

          <Section title='3. הסדרי נגישות פיזיים בבית העסק (אם רלוונטי - אם מדובר בעסק אינטרנטי בלבד, יש למחוק סעיף זה)'>
            <p>העסק שלנו ממוקם בכתובת: [הכנס כתובת מלאה].</p>
            <p>להלן הסדרי הנגישות הקיימים במקום:</p>
            <p>חניות נכים: [יש / אין, מיקום מדוייק].</p>
            <p>דרכי גישה למבנה: [מונגשות, ללא מדרגות / יש רמפה].</p>
            <p>שירותי נכים: [יש / אין].</p>
            <p>דלפק שירות נגיש: [יש / אין].</p>
          </Section>

          <Section title="4. פניות בנושא נגישות">
            <p>
              אנו ממשיכים במאמצים לשפר את נגישות האתר כחלק ממחויבותנו לאפשר שימוש בו עבור כלל האוכלוסייה. אם במהלך
              הגלישה באתר נתקלת בבעיית נגישות, או אם יש לך הצעה לשיפור, נשמח מאוד לשמוע ממך!
            </p>
            <p>ניתן לפנות לרכז/ת הנגישות שלנו:</p>
            <p>שם רכז/ת הנגישות: [שם מלא]</p>
            <p>טלפון: [מספר טלפון]</p>
            <p>דוא&quot;ל: [כתובת אימייל ייעודית לנגישות]</p>
            <p>תאריך עדכון ההצהרה: [הכנס תאריך עדכני]</p>
          </Section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/terms" className="px-5 py-2.5 rounded-xl border border-[#002C3E]/15 bg-white text-[#002C3E]/70 hover:text-[#002C3E] hover:border-[#78BCC4] font-semibold text-sm transition-all">
            תנאי שימוש
          </Link>
          <Link to="/privacy" className="px-5 py-2.5 rounded-xl border border-[#002C3E]/15 bg-white text-[#002C3E]/70 hover:text-[#002C3E] hover:border-[#78BCC4] font-semibold text-sm transition-all">
            מדיניות פרטיות
          </Link>
          <Link to="/" className="px-5 py-2.5 rounded-xl bg-[#002C3E] text-white hover:bg-[#F7444E] font-semibold text-sm transition-all">
            חזרה לאתר הראשי
          </Link>
        </div>
      </main>

      <footer className="bg-white border-t border-[#002C3E]/5 py-6 text-center text-xs text-[#002C3E]/40 font-medium">
        © {new Date().getFullYear()} israelfix · טכנאי אומן לכלים חשמליים
      </footer>
      </div>
    </>
  );
}

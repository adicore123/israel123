import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageSeo from '../components/PageSeo.jsx';
import AccessibilityMenu from '../components/AccessibilityMenu.jsx';
import { supabase } from '../lib/supabase.js';


// סיסמת כניסה: admin123
const HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// נתוני הדגמה התחלתיים לטכנאי
const MOCK_CALLS = [
  {
    id: 101,
    customer_name: 'יוסי כהן',
    customer_phone: '0521234567',
    customer_address: 'בן יהודה 45, תל אביב, כניסה א\', קוד 2580#, דירה 12, קומה 3',
    symptom: 'רעשים מוזרים מהמנוע בנסיעה מהירה וריח של שרוף מהבקר. אופני Teverun Fighter.',
    status: 'pending',
    tech_notes: '',
    total_price: '',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 102,
    customer_name: 'שירה לוי',
    customer_phone: '0549876543',
    customer_address: 'העצמאות 12, הרצליה, קומה קרקע',
    symptom: 'פנצ\'ר בגלגל האחורי בקורקינט Nami Burn-e 2. צריך החלפת צמיג ופנימית.',
    status: 'in_progress',
    tech_notes: '',
    total_price: '',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 103,
    customer_name: 'רוני אברהם',
    customer_phone: '0504445556',
    customer_address: 'הרצל 102, ראשון לציון, קומה 2, דירה 6',
    symptom: 'החלפת צמה ראשית ותיקון ידית גז. אופני אקסטרים 48V.',
    status: 'completed',
    tech_notes: 'הוחלפה צמה ראשית מקורית ותוקנה ידית הגז. בוצעו בדיקות מאמץ במעבדה.',
    total_price: '450',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const MOCK_CUSTOMERS = [
  {
    id: 1,
    shop_name: 'אופני דניאל',
    owner_name: 'דניאל כהן',
    phone: '0521234567',
    address: 'הרצל 40, ראשון לציון',
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  },
  {
    id: 2,
    shop_name: 'בייק סנטר',
    owner_name: 'אלון שוורץ',
    phone: '0549876543',
    address: 'בן יהודה 12, תל אביב',
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    id: 3,
    shop_name: 'חשמלי בעיר',
    owner_name: 'יוסי מזרחי',
    phone: '0501112223',
    address: 'העצמאות 50, הרצליה',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  }
];

/* ─── LOGIN FORM ────────────────────────────────────────── */
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
    <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-[#002C3E]/10 p-8 shadow-xl text-right">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#002C3E]/5 rounded-2xl flex items-center justify-center text-[#78BCC4] mx-auto mb-4 border border-[#78BCC4]/20 shadow-inner">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-[#002C3E]">אזור טכנאי שטח</h2>
        <p className="text-[#002C3E]/50 text-sm mt-1">אנא הזן סיסמת טכנאי על מנת לראות ולנהל את קריאות השירות</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[#002C3E] mb-2">סיסמת אבטחה</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="הזן סיסמת ניהול"
            className="w-full bg-[#F4F9FA] px-4 py-3.5 rounded-xl border border-[#002C3E]/20 outline-none focus:border-[#78BCC4] focus:bg-white transition-all text-[#002C3E] text-right text-sm placeholder:text-[#002C3E]/35"
            autoFocus
          />
        </div>
        
        {error && (
          <p className="text-[#F7444E] text-xs font-bold text-center bg-[#FEF2F2] py-2 rounded-lg border border-[#F7444E]/20">
            סיסמה שגויה. נסה שנית.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-[#002C3E] hover:bg-[#F7444E] text-white px-6 py-4 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#002C3E]/10 disabled:opacity-50"
        >
          {loading ? 'מאמת...' : 'כניסה לממשק העבודה'}
        </button>
      </form>
    </div>
  );
}

/* ─── MAIN DASHBOARD ────────────────────────────────────── */
export default function ServiceDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [calls, setCalls] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, in_progress, completed
  const [searchQuery, setSearchQuery] = useState('');
  
  // טופס פתיחת קריאה מהירה
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newSymptom, setNewSymptom] = useState('');

  // ניהול מאגר לקוחות
  const [activeTab, setActiveTab] = useState('calls'); // calls, customers
  const [customers, setCustomers] = useState([]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  
  // טופס הוספת לקוח
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [custShopName, setCustShopName] = useState('');
  const [custOwnerName, setCustOwnerName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  
  // טופס עריכת לקוח
  const [editingCustomer, setEditingCustomer] = useState(null);

  // סנכרון ושמירה כלקוח חדש בעת פתיחת קריאה
  const [saveToDatabase, setSaveToDatabase] = useState(false);
  const [selectedCustId, setSelectedCustId] = useState('');
  const [showInlineAddCust, setShowInlineAddCust] = useState(false);

  // משתני סינון קריאות שירות
  const [dateFilter, setDateFilter] = useState('all'); // all, today, yesterday, week, month
  const [shopFilter, setShopFilter] = useState('');

  // משתני טופס לקוח מהיר מתוך קריאת שירות
  const [inlineShopName, setInlineShopName] = useState('');
  const [inlineOwnerName, setInlineOwnerName] = useState('');
  const [inlinePhone, setInlinePhone] = useState('');
  const [inlineAddress, setInlineAddress] = useState('');

  // תיעוד סגירת קריאה
  const [closingCallId, setClosingCallId] = useState(null);
  const [techNotes, setTechNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState('');

  // סנכרון עם Supabase
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  // סיידבאר והגדרות
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  // פונקציות עזר לסינון קריאות לפי תאריך
  const matchesDateFilter = (createdAtStr) => {
    if (dateFilter === 'all') return true;
    if (!createdAtStr) return true;
    const date = new Date(createdAtStr);
    const now = new Date();
    
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    if (dateFilter === 'today') {
      return date >= todayStart;
    } else if (dateFilter === 'yesterday') {
      return date >= yesterdayStart && date < todayStart;
    } else if (dateFilter === 'week') {
      return date >= weekStart;
    } else if (dateFilter === 'month') {
      return date >= monthStart;
    }
    return true;
  };

  const matchesShopFilter = (customerName) => {
    if (!shopFilter) return true;
    if (!customerName) return false;
    return customerName.toLowerCase().includes(shopFilter.toLowerCase());
  };

  // בדיקת התחברות קודמת
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    window.scrollTo(0, 0);
    const session = localStorage.getItem('israelfix_tech_auth');
    if (session === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // טעינת נתונים
  useEffect(() => {
    if (!authenticated) return;

    // פונקציה לטעינה מ-Supabase
    const loadFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('service_calls')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setCalls(data || []);
        
        // טעינת לקוחות מ-Supabase
        try {
          const { data: custData, error: custError } = await supabase
            .from('customers')
            .select('*')
            .order('shop_name', { ascending: true });

          if (!custError && custData) {
            setCustomers(custData);
          } else {
            loadCustomersFromLocalStorage();
          }
        } catch {
          loadCustomersFromLocalStorage();
        }

        setIsUsingSupabase(true);
      } catch (err) {
        console.log('Supabase service_calls table not ready. Falling back to localStorage.', err.message);
        loadFromLocalStorage();
      }
    };

    // פונקציה לטעינה מ-localStorage
    const loadFromLocalStorage = () => {
      setIsUsingSupabase(false);
      const local = localStorage.getItem('israelfix_service_calls');
      if (local) {
        setCalls(JSON.parse(local));
      } else {
        localStorage.setItem('israelfix_service_calls', JSON.stringify(MOCK_CALLS));
        setCalls(MOCK_CALLS);
      }
      loadCustomersFromLocalStorage();
    };

    const loadCustomersFromLocalStorage = () => {
      const localCust = localStorage.getItem('israelfix_customers');
      if (localCust) {
        setCustomers(JSON.parse(localCust));
      } else {
        localStorage.setItem('israelfix_customers', JSON.stringify(MOCK_CUSTOMERS));
        setCustomers(MOCK_CUSTOMERS);
      }
    };

    loadFromSupabase();
  }, [authenticated]);

  // שמירה ועדכון משימות
  const saveCallsState = async (updatedCalls) => {
    setCalls(updatedCalls);
    localStorage.setItem('israelfix_service_calls', JSON.stringify(updatedCalls));
  };

  // שמירה ועדכון לקוחות
  const saveCustomersState = async (updatedCustomers) => {
    setCustomers(updatedCustomers);
    localStorage.setItem('israelfix_customers', JSON.stringify(updatedCustomers));
  };

  // 1. פתיחת קריאה מהירה חדשה
  const handleCreateCall = async (e) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone || !newCustomerAddress || !newSymptom) return;

    const newCall = {
      customer_name: newCustomerName,
      customer_phone: newCustomerPhone,
      customer_address: newCustomerAddress,
      symptom: newSymptom,
      status: 'pending',
      tech_notes: '',
      total_price: '',
      created_at: new Date().toISOString()
    };

    let updatedCalls = [];

    if (isUsingSupabase) {
      try {
        const { data, error } = await supabase
          .from('service_calls')
          .insert([newCall])
          .select();

        if (error) throw error;
        updatedCalls = [data[0], ...calls];
      } catch (err) {
        console.error('Supabase insert failed, adding to local instead:', err.message);
        const localCall = { id: Date.now(), ...newCall };
        updatedCalls = [localCall, ...calls];
      }
    } else {
      const localCall = { id: Date.now(), ...newCall };
      updatedCalls = [localCall, ...calls];
    }

    saveCallsState(updatedCalls);

    // אם סומן לשמור במאגר הלקוחות
    if (saveToDatabase) {
      // ננסה לחלץ שם בעל עסק אם מופיע בסוגריים, או להשתמש בשם הלקוח כשם החנות
      let shopName = newCustomerName;
      let ownerName = 'בעל עסק';
      if (newCustomerName.includes('(') && newCustomerName.includes(')')) {
        const idxOpen = newCustomerName.indexOf('(');
        const idxClose = newCustomerName.indexOf(')');
        shopName = newCustomerName.substring(0, idxOpen).trim();
        ownerName = newCustomerName.substring(idxOpen + 1, idxClose).trim();
      }

      const newCust = {
        shop_name: shopName,
        owner_name: ownerName,
        phone: newCustomerPhone,
        address: newCustomerAddress,
        created_at: new Date().toISOString()
      };

      let updatedCustList = [];
      if (isUsingSupabase) {
        try {
          const { data, error } = await supabase
            .from('customers')
            .insert([newCust])
            .select();
          if (!error && data) {
            updatedCustList = [...customers, data[0]].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
          } else {
            const localCust = { id: Date.now(), ...newCust };
            updatedCustList = [...customers, localCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
          }
        } catch {
          const localCust = { id: Date.now(), ...newCust };
          updatedCustList = [...customers, localCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
        }
      } else {
        const localCust = { id: Date.now(), ...newCust };
        updatedCustList = [...customers, localCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
      }
      saveCustomersState(updatedCustList);
    }

    // איפוס שדות וסגירת מודל
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerAddress('');
    setNewSymptom('');
    setSaveToDatabase(false);
    setSelectedCustId('');
    setShowAddModal(false);
  };

  // פונקציות ניהול לקוחות במאגר
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!custShopName || !custPhone || !custAddress || !custOwnerName) return;

    const newCustomer = {
      shop_name: custShopName,
      owner_name: custOwnerName,
      phone: custPhone,
      address: custAddress,
      created_at: new Date().toISOString()
    };

    let updatedCustList = [];

    if (isUsingSupabase) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert([newCustomer])
          .select();

        if (error) throw error;
        updatedCustList = [...customers, data[0]].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
      } catch (err) {
        console.error('Supabase customer insert failed:', err.message);
        const localCust = { id: Date.now(), ...newCustomer };
        updatedCustList = [...customers, localCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
      }
    } else {
      const localCust = { id: Date.now(), ...newCustomer };
      updatedCustList = [...customers, localCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
    }

    saveCustomersState(updatedCustList);

    setCustShopName('');
    setCustOwnerName('');
    setCustPhone('');
    setCustAddress('');
    setShowAddCustomerModal(false);
  };

  const handleCreateCustomerInline = async (e) => {
    e.preventDefault();
    if (!inlineShopName || !inlineOwnerName || !inlinePhone || !inlineAddress) return;

    const newCustomer = {
      shop_name: inlineShopName,
      owner_name: inlineOwnerName,
      phone: inlinePhone,
      address: inlineAddress,
      created_at: new Date().toISOString()
    };

    let createdCust = null;
    let updatedCustList = [];

    if (isUsingSupabase) {
      try {
        const { data, error } = await supabase
          .from('customers')
          .insert([newCustomer])
          .select();

        if (error) throw error;
        createdCust = data[0];
        updatedCustList = [...customers, createdCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
      } catch (err) {
        console.error('Supabase customer insert failed:', err.message);
        createdCust = { id: Date.now(), ...newCustomer };
        updatedCustList = [...customers, createdCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
      }
    } else {
      createdCust = { id: Date.now(), ...newCustomer };
      updatedCustList = [...customers, createdCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
    }

    saveCustomersState(updatedCustList);

    // Auto-prefill the call form with this customer's details
    setSelectedCustId(createdCust.id);
    setNewCustomerName(`${createdCust.shop_name} (${createdCust.owner_name})`);
    setNewCustomerPhone(createdCust.phone);
    setNewCustomerAddress(createdCust.address);

    // Reset inline form & close inline view
    setInlineShopName('');
    setInlineOwnerName('');
    setInlinePhone('');
    setInlineAddress('');
    setShowInlineAddCust(false);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.shop_name || !editingCustomer.phone || !editingCustomer.address || !editingCustomer.owner_name) return;

    let updatedCustList = customers.map(c => c.id === editingCustomer.id ? editingCustomer : c);
    saveCustomersState(updatedCustList);

    if (isUsingSupabase) {
      try {
        await supabase
          .from('customers')
          .update({
            shop_name: editingCustomer.shop_name,
            owner_name: editingCustomer.owner_name,
            phone: editingCustomer.phone,
            address: editingCustomer.address
          })
          .eq('id', editingCustomer.id);
      } catch (err) {
        console.error('Supabase customer update error:', err.message);
      }
    }

    setEditingCustomer(null);
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק לקוח זה ממאגר הלקוחות?')) return;

    let updatedCustList = customers.filter(c => c.id !== id);
    saveCustomersState(updatedCustList);

    if (isUsingSupabase) {
      try {
        await supabase
          .from('customers')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Supabase customer delete error:', err.message);
      }
    }
  };

  const handleSelectCustomerChange = (id) => {
    setSelectedCustId(id);
    if (!id) {
      setNewCustomerName('');
      setNewCustomerPhone('');
      setNewCustomerAddress('');
      return;
    }
    const found = customers.find(c => String(c.id) === String(id));
    if (found) {
      setNewCustomerName(`${found.shop_name} (${found.owner_name})`);
      setNewCustomerPhone(found.phone);
      setNewCustomerAddress(found.address);
    }
  };

  // 2. עדכון סטטוס מהיר (ללא הזנת מחיר/הערות)
  const handleUpdateStatus = async (id, nextStatus) => {
    let updatedCalls = calls.map(c => c.id === id ? { ...c, status: nextStatus } : c);
    saveCallsState(updatedCalls);

    if (isUsingSupabase) {
      try {
        await supabase
          .from('service_calls')
          .update({ status: nextStatus })
          .eq('id', id);
      } catch (err) {
        console.error('Supabase update status error:', err.message);
      }
    }
  };

  // 3. סגירת קריאה והזנת פרטים סופיים (שינוי ל-completed)
  const handleCompleteCall = async (e) => {
    e.preventDefault();
    if (!closingCallId) return;

    let updatedCalls = calls.map(c => 
      c.id === closingCallId 
        ? { ...c, status: 'completed', tech_notes: techNotes, total_price: totalPrice } 
        : c
    );
    saveCallsState(updatedCalls);

    if (isUsingSupabase) {
      try {
        await supabase
          .from('service_calls')
          .update({ status: 'completed', tech_notes: techNotes, total_price: totalPrice })
          .eq('id', closingCallId);
      } catch (err) {
        console.error('Supabase complete error:', err.message);
      }
    }

    // איפוס שדות סגירה
    setClosingCallId(null);
    setTechNotes('');
    setTotalPrice('');
  };

  // 4. מחיקת קריאה
  const handleDeleteCall = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את קריאת השירות הזו?')) return;

    let updatedCalls = calls.filter(c => c.id !== id);
    saveCallsState(updatedCalls);

    if (isUsingSupabase) {
      try {
        await supabase
          .from('service_calls')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Supabase delete error:', err.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('israelfix_tech_auth');
    setAuthenticated(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus('');
    if (!newPassword) {
      setPasswordStatus('error:אנא הזן סיסמה חדשה');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus('error:הסיסמאות אינן תואמות');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus('error:הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }
    try {
      const hash = await sha256(newPassword);
      localStorage.setItem('israelfix_tech_password_hash', hash);
      setPasswordStatus('success:הסיסמה שונתה בהצלחה! היא תהיה פעילה בכניסה הבאה.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordStatus('error:אירעה שגיאה בשינוי הסיסמה');
    }
  };

  // סינון וחיפוש קריאות
  const filteredCalls = calls.filter(c => {
    // 1. סינון לפי סטטוס
    if (filter !== 'all' && c.status !== filter) return false;
    
    // 2. סינון לפי ימים
    if (!matchesDateFilter(c.created_at)) return false;

    // 3. סינון לפי חנות
    if (!matchesShopFilter(c.customer_name)) return false;

    // 4. סינון לפי חיפוש
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = c.customer_name?.toLowerCase().includes(q);
      const phoneMatch = c.customer_phone?.includes(q);
      const addressMatch = c.customer_address?.toLowerCase().includes(q);
      const symptomMatch = c.symptom?.toLowerCase().includes(q);
      return nameMatch || phoneMatch || addressMatch || symptomMatch;
    }

    return true;
  });

  // רשימת חנויות ייחודיות לצורך סינון
  const uniqueShops = [...new Set(calls.map(c => {
    if (!c.customer_name) return '';
    const idx = c.customer_name.indexOf('(');
    return idx !== -1 ? c.customer_name.substring(0, idx).trim() : c.customer_name.trim();
  }))].filter(Boolean).sort();

  // חישוב סטטיסטיקות פשוטות
  const countPending = calls.filter(c => c.status === 'pending').length;
  const countInProgress = calls.filter(c => c.status === 'in_progress').length;
  const countCompleted = calls.filter(c => c.status === 'completed').length;
  const totalRevenue = calls
    .filter(c => c.status === 'completed' && c.total_price)
    .reduce((sum, c) => sum + parseFloat(c.total_price || 0), 0);

  // סקריפט ה-SQL ליצירת טבלאות ב-Supabase
  const sqlCommand = `
-- 1. טבלת קריאות שירות
CREATE TABLE IF NOT EXISTS public.service_calls (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    customer_address text NOT NULL,
    symptom text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    tech_notes text DEFAULT ''::text,
    total_price text DEFAULT ''::text
);

ALTER TABLE public.service_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read and write" ON public.service_calls 
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 2. טבלת מאגר לקוחות
CREATE TABLE IF NOT EXISTS public.customers (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    shop_name text NOT NULL,
    owner_name text NOT NULL,
    phone text NOT NULL,
    address text NOT NULL
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read and write" ON public.customers 
    FOR ALL TO anon USING (true) WITH CHECK (true);
  `.trim();

  if (!authenticated) {
    return (
      <>
        <PageSeo title="ממשק קריאות שירות" description="לוח עבודה דיגיטלי וסדר לטכנאי שטח - israelfix" path="/service" />
        <AccessibilityMenu stackAboveWhatsApp={false} />

        <div className="min-h-screen bg-[#F4F9FA] flex flex-col justify-center items-center p-4 font-sans selection:bg-[#78BCC4]/20 text-[#002C3E]" dir="rtl">
          <div className="flex items-center gap-3 mb-6" data-aos="zoom-in">
            <div className="w-10 h-10 bg-[#002C3E] rounded-2xl flex items-center justify-center text-[#78BCC4] shadow-md">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-display text-2xl font-black tracking-tight text-[#002C3E]">
              israelfix<span className="text-[#F7444E]">.</span>
              <span className="text-xs bg-[#78BCC4]/20 text-[#2a8fa0] px-2.5 py-0.5 rounded-full mr-2 font-bold">טכנאי שטח</span>
            </span>
          </div>

          <LoginForm onSuccess={() => {
            localStorage.setItem('israelfix_tech_auth', 'true');
            setAuthenticated(true);
          }} />

          <footer className="mt-8 text-center text-xs text-[#002C3E]/30 font-medium">
            &copy; {new Date().getFullYear()} israelfix · ניהול קריאות שירות וסדר לטכנאי
          </footer>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSeo title="ממשק קריאות שירות" description="לוח עבודה דיגיטלי וסדר לטכנאי שטח - israelfix" path="/service" />
      <AccessibilityMenu stackAboveWhatsApp={false} />

      <div className="flex flex-col md:flex-row min-h-screen bg-[#F4F9FA] font-sans selection:bg-[#78BCC4]/20 text-[#002C3E]" dir="rtl">
        
        {/* --- DESKTOP SIDEBAR --- */}
        <aside className="hidden md:flex flex-col w-72 bg-[#002C3E] text-white min-h-screen sticky top-0 border-l border-white/10 p-6 justify-between shrink-0 z-40">
          <div className="space-y-8">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#78BCC4] shadow-inner">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-display text-xl font-black tracking-tight text-white flex flex-col">
                <span className="flex items-center gap-1">israelfix<span className="text-[#F7444E]">.</span></span>
                <span className="text-[10px] text-[#78BCC4] font-bold">מערכת CRM לטכנאי</span>
              </span>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('calls')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'calls'
                    ? 'bg-[#78BCC4] text-[#002C3E] shadow-lg shadow-[#78BCC4]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📋</span>
                  <span>קריאות שירות</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-all duration-200 ${
                  activeTab === 'calls' ? 'bg-[#002C3E] text-white' : 'bg-white/15 text-white'
                }`}>
                  {calls.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'customers'
                    ? 'bg-[#78BCC4] text-[#002C3E] shadow-lg shadow-[#78BCC4]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">👥</span>
                  <span>מאגר לקוחות</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-all duration-200 ${
                  activeTab === 'customers' ? 'bg-[#002C3E] text-white' : 'bg-white/15 text-white'
                }`}>
                  {customers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-[#78BCC4] text-[#002C3E] shadow-lg shadow-[#78BCC4]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">⚙️</span>
                  <span>הגדרות מערכת</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Bottom elements of Sidebar */}
          <div className="space-y-5 pt-6 border-t border-white/10">
            {/* Connection Indicator */}
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 shadow-inner space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isUsingSupabase ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[10px] font-extrabold text-white/95">
                  {isUsingSupabase ? 'סנכרון ענן פעיל' : 'גיבוי מקומי פעיל'}
                </span>
              </div>
              <p className="text-[9px] text-white/50 leading-normal">
                {isUsingSupabase ? 'הנתונים מסונכרנים לענן' : 'נתונים נשמרים בדפדפן בלבד'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 text-white/70 hover:text-white transition-all text-xs font-black bg-white/5 hover:bg-white/10 py-3 rounded-xl border border-white/5"
              >
                <span>🏠 חזרה לאתר</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-xs font-black text-white bg-[#F7444E]/90 hover:bg-[#F7444E] border border-white/10 py-3 rounded-xl transition-all shadow-md shadow-[#F7444E]/10"
              >
                התנתק ✕
              </button>
            </div>
          </div>
        </aside>

        {/* --- MOBILE HEADER & DRAWER --- */}
        <div className="md:hidden w-full bg-[#002C3E] text-white border-b border-[#78BCC4]/20 py-3.5 px-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-[#78BCC4]">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="font-display text-md font-black tracking-tight text-white">
              israelfix<span className="text-[#F7444E]">.</span>
            </span>
          </div>

          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Backdrop for Mobile Drawer */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 animate-fade-in"
          />
        )}

        {/* Mobile Drawer Content */}
        <div className={`md:hidden fixed inset-y-0 right-0 z-50 w-72 bg-[#002C3E] text-white p-6 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-[#78BCC4]">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-display text-lg font-black text-white">israelfix<span className="text-[#F7444E]">.</span></span>
              </div>

              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-white/60 hover:text-white text-lg font-bold p-1 hover:bg-white/5 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs in Drawer */}
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('calls');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'calls'
                    ? 'bg-[#78BCC4] text-[#002C3E]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>📋</span>
                  <span>קריאות שירות</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === 'calls' ? 'bg-[#002C3E] text-white' : 'bg-white/15 text-white'
                }`}>
                  {calls.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('customers');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'customers'
                    ? 'bg-[#78BCC4] text-[#002C3E]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>👥</span>
                  <span>מאגר לקוחות</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === 'customers' ? 'bg-[#002C3E] text-white' : 'bg-white/15 text-white'
                }`}>
                  {customers.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-[#78BCC4] text-[#002C3E]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span>⚙️</span>
                  <span>הגדרות מערכת</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Bottom elements of Mobile Drawer */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Connection Indicator */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 shadow-inner">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isUsingSupabase ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="text-[10px] font-extrabold text-white/95">
                  {isUsingSupabase ? 'סנכרון ענן פעיל' : 'גיבוי מקומי פעיל'}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <Link
                to="/"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-full flex items-center justify-center gap-2 text-white/70 hover:text-white transition-all text-xs font-black bg-white/5 py-2.5 rounded-xl border border-white/5"
              >
                <span>🏠 חזרה לאתר</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full text-xs font-black text-white bg-[#F7444E]/90 hover:bg-[#F7444E] border border-white/10 py-2.5 rounded-xl transition-all shadow-md shadow-[#F7444E]/10"
              >
                התנתק ✕
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT PANEL --- */}
        <main className="flex-1 min-h-screen p-4 md:p-8 text-right overflow-y-auto max-w-full">
          <div className="space-y-6">
            
            {/* --- 1. SETTINGS WORKSPACE --- */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fade-in" data-aos="fade-up">
                {/* Page Title */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-[#002C3E]">⚙️ הגדרות מערכת ואבטחה</h2>
                  <p className="text-[#002C3E]/50 text-xs">ניהול סיסמאות כניסה, סנכרון מסדי נתונים והרשאות טכנאי שטח</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Column 1 & 2: Security & SQL */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Security Card: Change Password */}
                    <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-3 border-b border-[#002C3E]/5 pb-3">
                        <span className="text-xl">🔒</span>
                        <h3 className="text-lg font-extrabold text-[#002C3E]">שינוי סיסמת גישה לטכנאי</h3>
                      </div>

                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#002C3E]/60 mb-1.5">סיסמה חדשה (מינימום 6 תווים)</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="הזן סיסמה חדשה"
                              className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#002C3E]/60 mb-1.5">אימות סיסמה חדשה</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="הזן שוב לאימות"
                              className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                            />
                          </div>
                        </div>

                        {passwordStatus && (
                          <div className={`p-3 rounded-xl border text-xs font-bold text-center ${
                            passwordStatus.startsWith('success:')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-[#FEF2F2] text-[#F7444E] border-[#F7444E]/20'
                          }`}>
                            {passwordStatus.split(':')[1]}
                          </div>
                        )}

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-[#002C3E] hover:bg-[#F7444E] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-[#002C3E]/10"
                          >
                            שמור סיסמה חדשה 💾
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* SQL Setup Script Card */}
                    <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-[#002C3E]/5 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🗄️</span>
                          <h3 className="text-lg font-extrabold text-[#002C3E]">סקריפט SQL להקמת בסיס הנתונים</h3>
                        </div>
                        <span className="text-[10px] bg-[#78BCC4]/20 text-[#2a8fa0] px-2.5 py-0.5 rounded-full font-bold">Supabase Code</span>
                      </div>

                      <p className="text-xs text-[#002C3E]/70 leading-relaxed">
                        להקמה מהירה של הטבלאות המתאימות ב-Supabase, הרץ את הסקריפט הבא בתוך ה-<strong>SQL Editor</strong> של הפרויקט שלך בענן:
                      </p>

                      <div className="relative group">
                        <textarea
                          readOnly
                          rows={8}
                          value={sqlCommand}
                          onClick={(e) => {
                            e.target.select();
                            navigator.clipboard.writeText(sqlCommand);
                            alert('הסקריפט הועתק ללוח בהצלחה!');
                          }}
                          className="w-full bg-[#002C3E] text-[#78BCC4] font-mono text-[10px] p-4 rounded-xl border border-white/10 outline-none select-all cursor-pointer leading-normal"
                          dir="ltr"
                        />
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[9px] px-2 py-1 rounded font-bold pointer-events-none">
                          לחץ להעתקה מהירה
                        </div>
                      </div>
                      <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded-xl font-medium leading-relaxed">
                        💡 הסקריפט כולל יצירה של שתי טבלאות (service_calls ו-customers) עם הגדרות הרשאות Row Level Security (RLS) המאפשרות כתיבה וקריאה אנונימית לצורך חיבור מהיר ללא צורך במנגנוני Auth מורכבים.
                      </div>
                    </div>

                  </div>

                  {/* Column 3: Database Connection Status & System Metadata */}
                  <div className="space-y-6">
                    
                    {/* Connection Stats Card */}
                    <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-3 border-b border-[#002C3E]/5 pb-3">
                        <span className="text-xl">📡</span>
                        <h3 className="text-lg font-extrabold text-[#002C3E]">חיבור לענן</h3>
                      </div>

                      <div className="space-y-4 text-xs font-semibold">
                        <div className="flex justify-between items-center bg-[#F4F9FA] p-3.5 rounded-2xl border border-[#002C3E]/5">
                          <span className="text-[#002C3E]/50">סטטוס סנכרון:</span>
                          <span className={`flex items-center gap-1.5 font-bold ${isUsingSupabase ? 'text-emerald-600' : 'text-amber-500'}`}>
                            <span className={`w-2.5 h-2.5 rounded-full ${isUsingSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                            {isUsingSupabase ? 'מחובר ומסונכרן' : 'גיבוי מקומי'}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-[#F4F9FA] p-3.5 rounded-2xl border border-[#002C3E]/5">
                          <span className="text-[#002C3E]/50">סוג מסד נתונים:</span>
                          <span className="text-[#002C3E] font-bold">{isUsingSupabase ? 'PostgreSQL (Cloud)' : 'Local Storage (Browser)'}</span>
                        </div>

                        {isUsingSupabase && (
                          <div className="space-y-2 bg-[#F4F9FA] p-3.5 rounded-2xl border border-[#002C3E]/5">
                            <span className="text-[#002C3E]/50 block">Supabase Endpoint URL:</span>
                            <code className="text-[10px] text-[#2a8fa0] bg-white px-2 py-1 rounded border border-[#002C3E]/10 block select-all overflow-x-auto" dir="ltr">
                              {import.meta.env.VITE_SUPABASE_URL || 'מחובר באמצעות הגדרות הלקוח'}
                            </code>
                          </div>
                        )}

                        {!isUsingSupabase && (
                          <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl text-[10px] text-amber-800 leading-relaxed font-semibold">
                            ⚠️ לא זוהתה טבלת service_calls פעילה ב-Supabase, או שלא הוגדרו פרטי Supabase URL ו-Key בקובץ ה-env. המערכת שומרת ומציגה נתונים מקומית על גבי הדפדפן.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* System Info Card */}
                    <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-3 border-b border-[#002C3E]/5 pb-3">
                        <span className="text-xl">ℹ️</span>
                        <h3 className="text-lg font-extrabold text-[#002C3E]">פרטי מערכת</h3>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between border-b border-[#002C3E]/5 pb-2">
                          <span className="text-[#002C3E]/55">גרסה נוכחית:</span>
                          <span className="font-bold text-[#002C3E]">v2.1.0-crm</span>
                        </div>
                        <div className="flex justify-between border-b border-[#002C3E]/5 pb-2">
                          <span className="text-[#002C3E]/55">סביבת ריצה:</span>
                          <span className="font-bold text-[#002C3E]">production</span>
                        </div>
                        <div className="flex justify-between border-b border-[#002C3E]/5 pb-2">
                          <span className="text-[#002C3E]/55">מנוע עיצוב:</span>
                          <span className="font-bold text-[#002C3E]">Tailwind CSS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#002C3E]/55">פיתוח ואפיון:</span>
                          <span className="font-bold text-[#78BCC4]">israelfix DevTeam</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* --- 2. CUSTOMERS WORKSPACE --- */}
            {activeTab === 'customers' && (
              <div className="space-y-6 animate-fade-in" data-aos="fade-up">
                {/* --- Customers Action Panel --- */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-[#002C3E]/5 rounded-3xl p-5 shadow-sm">
                  <button
                    onClick={() => setShowAddCustomerModal(true)}
                    className="w-full sm:w-auto bg-[#F7444E] hover:bg-[#de3d46] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-[#F7444E]/25 transition-all flex items-center justify-center gap-2"
                  >
                    ➕ הוספת לקוח חדש במאגר
                  </button>

                  <div className="w-full sm:max-w-md relative">
                    <input
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      placeholder="🔍 חפש לפי שם חנות, בעל עסק או טלפון..."
                      className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-2xl px-4 py-3.5 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    />
                    {customerSearchQuery && (
                      <button
                        onClick={() => setCustomerSearchQuery('')}
                        className="absolute left-3 top-3.5 text-xs text-[#002C3E]/30 hover:text-[#002C3E] font-bold"
                      >
                        ✕ נקה
                      </button>
                    )}
                  </div>
                </div>

                {/* --- Customers Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customers.filter(c => {
                    if (!customerSearchQuery) return true;
                    const q = customerSearchQuery.toLowerCase();
                    return c.shop_name?.toLowerCase().includes(q) ||
                           c.owner_name?.toLowerCase().includes(q) ||
                           c.phone?.includes(q) ||
                           c.address?.toLowerCase().includes(q);
                  }).length > 0 ? (
                    customers.filter(c => {
                      if (!customerSearchQuery) return true;
                      const q = customerSearchQuery.toLowerCase();
                      return c.shop_name?.toLowerCase().includes(q) ||
                             c.owner_name?.toLowerCase().includes(q) ||
                             c.phone?.includes(q) ||
                             c.address?.toLowerCase().includes(q);
                    }).map(cust => (
                      <div
                        key={cust.id}
                        className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                      >
                        <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#78BCC4]" />
                        
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <div>
                              <h3 className="text-lg font-extrabold text-[#002C3E]">
                                {cust.shop_name}
                              </h3>
                              <span className="text-xs bg-[#78BCC4]/10 text-[#2a8fa0] px-2.5 py-0.5 rounded-full font-bold inline-block mt-1">
                                👤 בעל עסק: {cust.owner_name}
                              </span>
                            </div>
                            
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setEditingCustomer(cust)}
                                className="text-xs font-bold text-[#2a8fa0] bg-[#78BCC4]/15 hover:bg-[#78BCC4]/30 px-2.5 py-1.5 rounded-xl transition-all"
                              >
                                ✏️ ערוך
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(cust.id)}
                                className="text-xs font-bold text-[#F7444E] bg-[#FEF2F2] hover:bg-[#F7444E]/20 px-2.5 py-1.5 rounded-xl transition-all"
                              >
                                ✕ מחק
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-[#002C3E]/5 pt-3 text-xs">
                            <div className="flex items-start gap-2 text-[#002C3E]/80">
                              <span className="text-[#002C3E]/45 block shrink-0">📍 כתובת:</span>
                              <span className="font-bold">{cust.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#002C3E]/80">
                              <span className="text-[#002C3E]/45 block shrink-0">📞 טלפון:</span>
                              <a href={`tel:${cust.phone}`} className="font-bold text-[#78BCC4] hover:underline" dir="ltr">{cust.phone}</a>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#002C3E]/5 flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setSelectedCustId(cust.id);
                              setNewCustomerName(`${cust.shop_name} (${cust.owner_name})`);
                              setNewCustomerPhone(cust.phone);
                              setNewCustomerAddress(cust.address);
                              setShowAddModal(true);
                            }}
                            className="bg-[#EEF6F8] hover:bg-[#002C3E] hover:text-white text-[#002C3E] text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
                          >
                            📞 פתח קריאת שירות ללקוח זה
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white rounded-3xl border border-[#002C3E]/5 py-12 text-center text-[#002C3E]/30 text-sm font-semibold">
                      לא נמצאו לקוחות במאגר העונים לחיפוש 👥
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- 3. SERVICE CALLS WORKSPACE --- */}
            {activeTab === 'calls' && (
              <div className="space-y-6 animate-fade-in" data-aos="fade-up">
                {/* --- Top Metrics Banner --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#002C3E]/5 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black text-[#F7444E]">{countPending}</span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">🔴 קריאות בממתין</span>
                  </div>
                  <div className="bg-white border border-[#002C3E]/5 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black text-amber-500">{countInProgress}</span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">🟡 קריאות בטיפול</span>
                  </div>
                  <div className="bg-white border border-[#002C3E]/5 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black text-emerald-500">{countCompleted}</span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">🟢 משימות שהושלמו</span>
                  </div>
                  <div className="bg-[#002C3E] rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-white">
                    <span className="text-2xl md:text-3xl font-black text-[#78BCC4]">₪{totalRevenue}</span>
                    <span className="text-xs font-bold text-white/50 mt-1">💰 סך הכל הכנסות</span>
                  </div>
                </div>

                {/* --- Advanced Filters Panel --- */}
                <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full sm:w-auto bg-[#F7444E] hover:bg-[#de3d46] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-[#F7444E]/25 transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      📞 פתיחת קריאה חדשה
                    </button>

                    <div className="w-full sm:max-w-md relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="🔍 חפש לפי שם לקוח, טלפון, כתובת, תקלה..."
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-2xl px-4 py-3.5 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-medium"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute left-3 top-3.5 text-xs text-[#002C3E]/30 hover:text-[#002C3E] font-bold"
                        >
                          ✕ נקה
                        </button>
                      )}
                    </div>
                  </div>

                  {/* סינון מתקדם לפי ימים וחנויות */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#002C3E]/5">
                    <div>
                      <label className="block text-xs font-bold text-[#002C3E]/55 mb-1.5">📅 סינון לפי ימים (זמן פתיחת קריאה)</label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#78BCC4] text-xs font-bold text-[#002C3E] cursor-pointer"
                      >
                        <option value="all">📅 כל הזמן (ללא הגבלה)</option>
                        <option value="today">🔴 היום האחרון</option>
                        <option value="yesterday">אתמול</option>
                        <option value="week">7 הימים האחרונים</option>
                        <option value="month">החודש הנוכחי</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#002C3E]/55 mb-1.5">🏬 סינון לפי חנות / עסק</label>
                      <select
                        value={shopFilter}
                        onChange={(e) => setShopFilter(e.target.value)}
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#78BCC4] text-xs font-bold text-[#002C3E] cursor-pointer"
                      >
                        <option value="">🏬 כל החנויות והעסקים</option>
                        {uniqueShops.map((shop, i) => (
                          <option key={i} value={shop}>
                            {shop}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* --- Status Filters Tabs --- */}
                <div className="flex gap-2 bg-[#EEF6F8] p-1.5 rounded-2xl border border-[#002C3E]/5">
                  {[
                    { id: 'all', label: 'הכל', icon: '📋' },
                    { id: 'pending', label: '🔴 ממתין', count: countPending },
                    { id: 'in_progress', label: '🟡 בטיפול', count: countInProgress },
                    { id: 'completed', label: '🟢 בוצע', count: countCompleted }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id)}
                      className={`flex-1 py-3 px-2 text-center rounded-xl text-xs md:text-sm font-black transition-all flex items-center justify-center gap-1.5 ${
                        filter === tab.id
                          ? 'bg-[#002C3E] text-white shadow-md'
                          : 'text-[#002C3E]/60 hover:text-[#002C3E] hover:bg-white/50'
                      }`}
                    >
                      <span>{tab.icon || ''} {tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          filter === tab.id ? 'bg-[#78BCC4] text-[#002C3E]' : 'bg-[#002C3E]/10 text-[#002C3E]'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* --- Calls List --- */}
                <div className="space-y-4">
                  {filteredCalls.length > 0 ? (
                    <>
                      {/* --- Mobile Cards View (block md:hidden) --- */}
                      <div className="block md:hidden space-y-4">
                        {filteredCalls.map(c => {
                          const isCallClosing = closingCallId === c.id;
                          return (
                            <div
                              key={c.id}
                              className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden text-right"
                            >
                              {/* Status Label Banner */}
                              <div className={`absolute top-0 right-0 left-0 h-1.5 ${
                                c.status === 'pending' ? 'bg-[#F7444E]' :
                                c.status === 'in_progress' ? 'bg-amber-400' : 'bg-emerald-500'
                              }`} />

                              {/* Top Header Row of Call */}
                              <div className="flex flex-col justify-between items-start gap-3 mb-4">
                                <div className="w-full">
                                  <div className="flex justify-between items-start w-full">
                                    <h3 className="text-xl font-extrabold text-[#002C3E] flex flex-wrap items-center gap-2">
                                      {c.customer_name}
                                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                                        c.status === 'pending' ? 'bg-[#F7444E]/10 text-[#F7444E]' :
                                        c.status === 'in_progress' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                      }`}>
                                        {c.status === 'pending' ? '🔴 ממתין' :
                                         c.status === 'in_progress' ? '🟡 בטיפול' : '🟢 הושלם'}
                                      </span>
                                    </h3>
                                    {/* Action for Deleting */}
                                    <button
                                      onClick={() => handleDeleteCall(c.id)}
                                      className="text-[#002C3E]/20 hover:text-[#F7444E] transition-all p-1 hover:bg-[#FEF2F2] rounded-lg"
                                      title="מחק קריאה"
                                    >
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  <a
                                    href={`tel:${c.customer_phone}`}
                                    className="text-sm font-semibold text-[#78BCC4] hover:underline flex items-center gap-1.5 mt-1 inline-block"
                                    dir="ltr"
                                  >
                                    📞 {c.customer_phone}
                                  </a>
                                </div>
                              </div>

                              {/* Call Details */}
                              <div className="space-y-3 border-t border-[#002C3E]/5 pt-4 pb-2">
                                <div>
                                  <span className="text-xs font-bold text-[#002C3E]/45 block mb-1">📍 כתובת להגעה:</span>
                                  <p className="text-sm font-bold text-[#002C3E]/85 leading-relaxed">{c.customer_address}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-[#002C3E]/45 block mb-1">🔧 תיאור התקלה והכלי:</span>
                                  <p className="text-sm text-[#002C3E] leading-relaxed bg-[#F4F9FA] p-3.5 rounded-xl border border-[#002C3E]/5 font-semibold">
                                    {c.symptom}
                                  </p>
                                </div>
                              </div>

                              {/* Completed Info Section (If closed) */}
                              {c.status === 'completed' && (
                                <div className="mt-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 space-y-2">
                                  <span className="text-xs font-bold text-emerald-800 block">✅ תיעוד טיפול סגור:</span>
                                  <p className="text-sm font-semibold text-emerald-900"><strong className="text-xs block text-emerald-700">מה תוקן:</strong> {c.tech_notes || 'לא נרשמו הערות.'}</p>
                                  <div className="flex justify-between items-center border-t border-emerald-100/50 pt-2 mt-2">
                                    <span className="text-sm font-black text-emerald-900">💰 שולם סך הכל: ₪{c.total_price || '0'}</span>
                                    
                                    {/* WhatsApp Share Invoice */}
                                    <a
                                      href={`https://wa.me/972${c.customer_phone.replace(/^0/, '')}?text=${encodeURIComponent(`היי ${c.customer_name}, להלן סיכום הטיפול שבוצע בכלי שלך:\n\n🛠️ *מה תוקן:* ${c.tech_notes || 'טיפול שוטף ומקצועי'}\n💰 *סך הכל שולם:* ₪${c.total_price || '0'}\n\nתודה רבה שבחרת ב-israelfix! 🚀`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm shadow-[#25D366]/20"
                                    >
                                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                      </svg>
                                      שלח סיכום בוואטסאפ
                                    </a>
                                  </div>
                                </div>
                              )}

                              {/* Interactive Status Changer Row */}
                              <div className="mt-4 pt-4 border-t border-[#002C3E]/5 flex flex-wrap gap-2 items-center justify-between">
                                {/* Left quick-action links */}
                                <div className="flex gap-2">
                                  {/* Waze Navigation Link */}
                                  <a
                                    href={`https://waze.com/ul?q=${encodeURIComponent(c.customer_address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-[#EEF6F8] hover:bg-[#78BCC4]/20 text-[#002C3E] text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
                                  >
                                    🚗 סע ב-Waze
                                  </a>
                                  <a
                                    href={`https://wa.me/972${c.customer_phone.replace(/^0/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-[#EEF6F8] hover:bg-[#25D366]/10 hover:text-[#128C7E] text-[#002C3E] text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
                                  >
                                    💬 צור קשר
                                  </a>
                                </div>

                                {/* Right quick-status buttons */}
                                <div className="flex gap-2">
                                  {c.status === 'pending' && (
                                    <button
                                      onClick={() => handleUpdateStatus(c.id, 'in_progress')}
                                      className="bg-[#002C3E] hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                                    >
                                      🟡 התחל לעבוד
                                    </button>
                                  )}

                                  {c.status === 'in_progress' && !isCallClosing && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleUpdateStatus(c.id, 'pending')}
                                        className="bg-slate-200 hover:bg-slate-300 text-[#002C3E] text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
                                      >
                                        🔙 החזר לממתין
                                      </button>
                                      <button
                                        onClick={() => {
                                          setClosingCallId(c.id);
                                          setTechNotes('');
                                          setTotalPrice('');
                                        }}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10"
                                      >
                                        🟢 סמן כהושלם
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Inline Closing Call Form */}
                              {isCallClosing && (
                                <form onSubmit={handleCompleteCall} className="mt-4 bg-[#F4F9FA] border border-[#002C3E]/10 rounded-2xl p-5 space-y-4 text-right">
                                  <h4 className="text-sm font-black text-[#002C3E]">📝 סגירת קריאה וסיכום טיפול</h4>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2">
                                      <label className="block text-xs font-bold text-[#002C3E]/50 mb-1">מה תוקן בפועל והערות</label>
                                      <input
                                        type="text"
                                        required
                                        value={techNotes}
                                        onChange={(e) => setTechNotes(e.target.value)}
                                        placeholder="לדוגמא: הוחלף צמיג אחורי מקורי של TEVERUN"
                                        className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-[#002C3E]/50 mb-1">מחיר סופי (₪)</label>
                                      <input
                                        type="number"
                                        required
                                        value={totalPrice}
                                        onChange={(e) => setTotalPrice(e.target.value)}
                                        placeholder="₪ סכום"
                                        className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                                      />
                                    </div>
                                  </div>

                                  <div className="flex gap-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => setClosingCallId(null)}
                                      className="bg-slate-200 hover:bg-slate-300 text-[#002C3E] text-xs font-bold px-3 py-2 rounded-xl transition-all"
                                    >
                                      ביטול
                                    </button>
                                    <button
                                      type="submit"
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10"
                                    >
                                      שמור וסגור משימה ✅
                                    </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* --- Desktop Table View (hidden md:block) --- */}
                      <div className="hidden md:block bg-white border border-[#002C3E]/5 rounded-3xl shadow-sm overflow-hidden text-right">
                        <div className="overflow-x-auto">
                          <table className="w-full text-right border-collapse text-[#002C3E]">
                            <thead>
                              <tr className="bg-[#002C3E] text-white text-xs font-bold border-b border-[#002C3E]/10">
                                <th className="py-4 px-4 font-black">📅 תאריך פתיחה</th>
                                <th className="py-4 px-4 font-black">🏬 בית העסק / לקוח</th>
                                <th className="py-4 px-4 font-black">📞 יצירת קשר</th>
                                <th className="py-4 px-4 font-black w-1/4">📍 כתובת להגעה</th>
                                <th className="py-4 px-4 font-black w-1/4">🔧 תיאור התקלה והכלי</th>
                                <th className="py-4 px-4 font-black text-center">🚦 סטטוס</th>
                                <th className="py-4 px-4 font-black text-left">⚙️ פעולות</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#002C3E]/5 text-xs">
                              {filteredCalls.map(c => {
                                const isCallClosing = closingCallId === c.id;
                                const formattedDate = new Date(c.created_at).toLocaleDateString('he-IL', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                });
                                return (
                                  <React.Fragment key={c.id}>
                                    <tr className={`hover:bg-[#78BCC4]/5 transition-colors ${c.status === 'completed' ? 'bg-emerald-50/20' : ''}`}>
                                      <td className="py-4 px-4 font-medium text-[#002C3E]/60 whitespace-nowrap" dir="ltr">{formattedDate}</td>
                                      <td className="py-4 px-4">
                                        <div className="font-extrabold text-[#002C3E] text-sm">{c.customer_name}</div>
                                      </td>
                                      <td className="py-4 px-4 whitespace-nowrap">
                                        <a
                                          href={`tel:${c.customer_phone}`}
                                          className="font-bold text-[#78BCC4] hover:underline block"
                                          dir="ltr"
                                        >
                                          📞 {c.customer_phone}
                                        </a>
                                      </td>
                                      <td className="py-4 px-4 text-[#002C3E]/85 font-medium leading-relaxed">{c.customer_address}</td>
                                      <td className="py-4 px-4">
                                        <div className="text-[#002C3E] leading-relaxed bg-[#F4F9FA] p-2.5 rounded-xl border border-[#002C3E]/5 font-semibold text-xs">
                                          {c.symptom}
                                        </div>
                                        {c.status === 'completed' && (
                                          <div className="mt-2 text-xs bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-900 font-medium">
                                            <span className="font-bold text-emerald-800 block mb-1">✅ טיפול שבוצע:</span>
                                            <p className="leading-relaxed">{c.tech_notes || 'לא נרשמו הערות.'}</p>
                                            <div className="font-black text-emerald-950 mt-1.5 border-t border-emerald-200/50 pt-1.5 flex justify-between">
                                              <span>סכום ששולם:</span>
                                              <span>₪{c.total_price || '0'}</span>
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                      <td className="py-4 px-4 text-center whitespace-nowrap">
                                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold inline-block ${
                                          c.status === 'pending' ? 'bg-[#F7444E]/10 text-[#F7444E]' :
                                          c.status === 'in_progress' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                          {c.status === 'pending' ? '🔴 ממתין' :
                                           c.status === 'in_progress' ? '🟡 בטיפול' : '🟢 הושלם'}
                                        </span>
                                      </td>
                                      <td className="py-4 px-4 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                          {/* Navigation and WhatsApp */}
                                          <a
                                            href={`https://waze.com/ul?q=${encodeURIComponent(c.customer_address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-[#EEF6F8] hover:bg-[#78BCC4]/20 text-[#002C3E] rounded-xl transition-all"
                                            title="סע ב-Waze"
                                          >
                                            🚗
                                          </a>
                                          <a
                                            href={`https://wa.me/972${c.customer_phone.replace(/^0/, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-[#EEF6F8] hover:bg-[#25D366]/10 text-[#002C3E] hover:text-[#128C7E] rounded-xl transition-all"
                                            title="צור קשר בוואטסאפ"
                                          >
                                            💬
                                          </a>

                                          {/* Quick status transitions */}
                                          {c.status === 'pending' && (
                                            <button
                                              onClick={() => handleUpdateStatus(c.id, 'in_progress')}
                                              className="bg-[#002C3E] hover:bg-amber-500 hover:text-white text-white text-xs font-bold px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                                            >
                                              🟡 התחל עבודה
                                            </button>
                                          )}

                                          {c.status === 'in_progress' && !isCallClosing && (
                                            <div className="flex gap-1.5">
                                              <button
                                                onClick={() => handleUpdateStatus(c.id, 'pending')}
                                                className="bg-slate-200 hover:bg-slate-300 text-[#002C3E] text-xs font-bold px-2 py-2 rounded-xl transition-all"
                                                title="החזר לממתין"
                                              >
                                                🔙
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setClosingCallId(c.id);
                                                  setTechNotes('');
                                                  setTotalPrice('');
                                                }}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 whitespace-nowrap"
                                              >
                                                🟢 סגור קריאה
                                              </button>
                                            </div>
                                          )}

                                          {c.status === 'completed' && (
                                            <a
                                              href={`https://wa.me/972${c.customer_phone.replace(/^0/, '')}?text=${encodeURIComponent(`היי ${c.customer_name}, להלן סיכום הטיפול שבוצע בכלי שלך:\n\n🛠️ *מה תוקן:* ${c.tech_notes || 'טיפול שוטף ומקצועי'}\n💰 *סך הכל שולם:* ₪${c.total_price || '0'}\n\nתודה רבה שבחרת ב-israelfix! 🚀`)}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm shadow-[#25D366]/20 whitespace-nowrap"
                                            >
                                              שלח סיכום 📱
                                            </a>
                                          )}

                                          {/* Delete Call */}
                                          <button
                                            onClick={() => handleDeleteCall(c.id)}
                                            className="text-[#002C3E]/20 hover:text-[#F7444E] transition-all p-2 hover:bg-[#FEF2F2] rounded-xl"
                                            title="מחק קריאה"
                                          >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>

                                    {/* Table Row for Closing Call Form */}
                                    {isCallClosing && (
                                      <tr className="bg-[#F4F9FA]">
                                        <td colSpan={7} className="p-5 border-t border-b border-[#002C3E]/10">
                                          <form onSubmit={handleCompleteCall} className="space-y-4 text-right">
                                            <div className="flex items-center gap-2 mb-2">
                                              <span className="text-base">📝</span>
                                              <h4 className="text-sm font-black text-[#002C3E]">סגירת קריאה וסיכום טיפול - {c.customer_name}</h4>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                              <div className="md:col-span-3">
                                                <label className="block text-xs font-bold text-[#002C3E]/50 mb-1">מה תוקן בפועל והערות</label>
                                                <input
                                                  type="text"
                                                  required
                                                  value={techNotes}
                                                  onChange={(e) => setTechNotes(e.target.value)}
                                                  placeholder="לדוגמא: הוחלף צמיג אחורי מקורי של TEVERUN"
                                                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                                                />
                                              </div>
                                              <div>
                                                <label className="block text-xs font-bold text-[#002C3E]/50 mb-1">מחיר סופי (₪)</label>
                                                <input
                                                  type="number"
                                                  required
                                                  value={totalPrice}
                                                  onChange={(e) => setTotalPrice(e.target.value)}
                                                  placeholder="₪ סכום"
                                                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                                                />
                                              </div>
                                            </div>

                                            <div className="flex gap-2 justify-end">
                                              <button
                                                type="button"
                                                onClick={() => setClosingCallId(null)}
                                                className="bg-slate-200 hover:bg-slate-300 text-[#002C3E] text-xs font-bold px-4 py-2 rounded-xl transition-all"
                                              >
                                                ביטול
                                              </button>
                                              <button
                                                type="submit"
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10"
                                              >
                                                שמור וסגור משימה ✅
                                              </button>
                                            </div>
                                          </form>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-3xl border border-[#002C3E]/5 py-12 text-center text-[#002C3E]/30 text-sm font-semibold">
                      אין קריאות שירות העונות לסינון או לחיפוש שבחרת 📋
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- Supabase Connection Footer Indicator (only when not on settings workspace) --- */}
            {activeTab !== 'settings' && (
              <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-5 shadow-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isUsingSupabase ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <span className="font-bold">
                    {isUsingSupabase ? 'מחובר לסנכרון ענן (Supabase)' : 'עובד מקומית (גיבוי דפדפן LocalStorage)'}
                  </span>
                </div>
                {!isUsingSupabase && (
                  <button
                    onClick={() => setShowSqlGuide(true)}
                    className="text-[#78BCC4] hover:underline font-bold"
                  >
                    ⚙️ חבר לענן של Supabase
                  </button>
                )}
              </div>
            )}

          </div>
        </main>

        {/* --- MODAL: Add New Call Dialog --- */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#002C3E]/10 p-6 md:p-8 max-w-lg w-full text-right shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-[#002C3E]/5 pb-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#002C3E]/40 hover:text-[#002C3E] text-lg font-bold"
                >✕</button>
                <h3 className="text-xl font-extrabold text-[#002C3E]">📞 פתיחת קריאת שירות חדשה</h3>
              </div>

              <form onSubmit={handleCreateCall} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#002C3E]/60">📋 בחירת לקוח קיים מהמאגר (אופציונלי)</label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInlineAddCust(!showInlineAddCust);
                        // Reset selection if opening inline creator
                        if (!showInlineAddCust) {
                          setSelectedCustId('');
                          setNewCustomerName('');
                          setNewCustomerPhone('');
                          setNewCustomerAddress('');
                        }
                      }}
                      className="text-xs font-bold text-[#78BCC4] hover:text-[#2a8fa0] transition-colors"
                    >
                      {showInlineAddCust ? '✕ ביטול הוספה מהירה' : '➕ הוסף לקוח חדש למאגר'}
                    </button>
                  </div>
                  
                  {!showInlineAddCust ? (
                    <>
                      <select
                        value={selectedCustId}
                        onChange={(e) => handleSelectCustomerChange(e.target.value)}
                        className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-bold"
                      >
                        <option value="">-- הזן פרטים ידנית או בחר לקוח מהמאגר --</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.shop_name} (👤 בעל עסק: {c.owner_name})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[#002C3E]/40 mt-1 font-medium">בחירה בלקוח מהמאגר תמלא את שאר השדות באופן אוטומטי.</p>
                    </>
                  ) : (
                    <div className="bg-[#EEF6F8] p-4 rounded-2xl border border-[#78BCC4]/20 space-y-3 mt-1">
                      <div className="text-xs font-bold text-[#002C3E] border-b border-[#002C3E]/10 pb-1.5 flex items-center gap-1">
                        <span>👥 הוספת לקוח מהירה למאגר</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#002C3E]/60 mb-0.5">שם חנות / בית עסק</label>
                          <input
                            type="text"
                            value={inlineShopName}
                            onChange={(e) => setInlineShopName(e.target.value)}
                            placeholder="לדוגמא: אופני דניאל"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#002C3E]/60 mb-0.5">שם בעל העסק</label>
                          <input
                            type="text"
                            value={inlineOwnerName}
                            onChange={(e) => setInlineOwnerName(e.target.value)}
                            placeholder="דניאל כהן"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#002C3E]/60 mb-0.5">מספר טלפון</label>
                          <input
                            type="tel"
                            value={inlinePhone}
                            onChange={(e) => setInlinePhone(e.target.value)}
                            placeholder="0521234567"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#002C3E]/60 mb-0.5">כתובת מלאה</label>
                          <input
                            type="text"
                            value={inlineAddress}
                            onChange={(e) => setInlineAddress(e.target.value)}
                            placeholder="הרצל 40, ראשון לציון"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowInlineAddCust(false);
                            // Reset inline form fields
                            setInlineShopName('');
                            setInlineOwnerName('');
                            setInlinePhone('');
                            setInlineAddress('');
                          }}
                          className="bg-white hover:bg-slate-100 text-[#002C3E] text-[11px] font-bold px-3 py-1.5 rounded-lg border border-[#002C3E]/10 transition-all"
                        >
                          ביטול
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateCustomerInline}
                          className="bg-[#002C3E] hover:bg-[#F7444E] text-white font-black text-[11px] px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
                        >
                          שמור לקוח והמשך לקריאה 💾
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם הלקוח / בית העסק</label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="הזן שם מלא"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">מספר טלפון</label>
                  <input
                    type="tel"
                    required
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="לדוגמא: 0521234567"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">כתובת מלאה להגעה</label>
                  <input
                    type="text"
                    required
                    value={newCustomerAddress}
                    onChange={(e) => setNewCustomerAddress(e.target.value)}
                    placeholder="לדוגמא: הרצל 10, תל אביב, דירה 5, קומה 2"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">תיאור התקלה וסוג הכלי</label>
                  <textarea
                    rows={3}
                    required
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    placeholder="לדוגמא: פנצ'ר גלגל אחורי בקורקינט שיאומי"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] resize-none"
                  />
                </div>

                {!selectedCustId && (
                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="saveToDatabase"
                      checked={saveToDatabase}
                      onChange={(e) => setSaveToDatabase(e.target.checked)}
                      className="w-4 h-4 rounded border-[#002C3E]/15 text-[#78BCC4] focus:ring-[#78BCC4] cursor-pointer"
                    />
                    <label htmlFor="saveToDatabase" className="text-xs font-bold text-[#002C3E]/70 select-none cursor-pointer">
                      💾 שמור לקוח זה במאגר הלקוחות (אם מוזן ידנית)
                    </label>
                  </div>
                )}

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#002C3E] py-3.5 rounded-xl font-bold text-sm transition-all"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#F7444E] hover:bg-[#de3d46] text-white py-3.5 rounded-xl font-black text-sm transition-all shadow-md shadow-[#F7444E]/20"
                  >
                    שמור ופתח קריאה 🚀
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: Add New Customer Dialog --- */}
        {showAddCustomerModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#002C3E]/10 p-6 md:p-8 max-w-lg w-full text-right shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-[#002C3E]/5 pb-3">
                <button
                  onClick={() => setShowAddCustomerModal(false)}
                  className="text-[#002C3E]/40 hover:text-[#002C3E] text-lg font-bold"
                >✕</button>
                <h3 className="text-xl font-extrabold text-[#002C3E]">👥 הוספת לקוח חדש למאגר</h3>
              </div>

              <form onSubmit={handleCreateCustomer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם חנות / בית עסק</label>
                  <input
                    type="text"
                    required
                    value={custShopName}
                    onChange={(e) => setCustShopName(e.target.value)}
                    placeholder="לדוגמא: אופני דניאל"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם בעל העסק</label>
                  <input
                    type="text"
                    required
                    value={custOwnerName}
                    onChange={(e) => setCustOwnerName(e.target.value)}
                    placeholder="לדוגמא: דניאל כהן"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">מספר טלפון</label>
                  <input
                    type="tel"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="לדוגמא: 0521234567"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">כתובת מלאה</label>
                  <input
                    type="text"
                    required
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    placeholder="לדוגמא: הרצל 40, ראשון לציון"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomerModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#002C3E] py-3.5 rounded-xl font-bold text-sm transition-all"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#F7444E] hover:bg-[#de3d46] text-white py-3.5 rounded-xl font-black text-sm transition-all shadow-md shadow-[#F7444E]/20"
                  >
                    שמור לקוח 💾
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: Edit Customer Dialog --- */}
        {editingCustomer !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#002C3E]/10 p-6 md:p-8 max-w-lg w-full text-right shadow-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-[#002C3E]/5 pb-3">
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="text-[#002C3E]/40 hover:text-[#002C3E] text-lg font-bold"
                >✕</button>
                <h3 className="text-xl font-extrabold text-[#002C3E]">✏️ עריכת פרטי לקוח</h3>
              </div>

              <form onSubmit={handleUpdateCustomer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם חנות / בית עסק</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.shop_name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, shop_name: e.target.value })}
                    placeholder="שם החנות"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם בעל העסק</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.owner_name}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, owner_name: e.target.value })}
                    placeholder="שם בעל העסק"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">מספר טלפון</label>
                  <input
                    type="tel"
                    required
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    placeholder="מספר טלפון"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">כתובת מלאה</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.address}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                    placeholder="כתובת"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#002C3E] py-3.5 rounded-xl font-bold text-sm transition-all"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#002C3E] hover:bg-[#F7444E] text-white py-3.5 rounded-xl font-black text-sm transition-all shadow-md shadow-[#002C3E]/20"
                  >
                    עדכן לקוח 💾
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: SQL Guide for Administrator --- */}
        {showSqlGuide && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#002C3E]/10 p-6 md:p-8 max-w-xl w-full text-right shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#002C3E]/5 pb-3">
                <button
                  onClick={() => setShowSqlGuide(false)}
                  className="text-[#002C3E]/40 hover:text-[#002C3E] text-lg font-bold"
                >✕</button>
                <h3 className="text-xl font-extrabold text-[#002C3E]">⚙️ חיבור ל-Supabase SQL Editor</h3>
              </div>
              
              <p className="text-xs text-[#002C3E]/70 leading-relaxed">
                על מנת לסנכרן את קריאות השירות ישירות ל-Supabase בענן, העתק את הקוד הבא, כנס ל-<strong>Supabase Dashboard ➡️ SQL Editor</strong> שלך, הדבק והרץ (Run):
              </p>

              <textarea
                readOnly
                rows={10}
                value={sqlCommand}
                onClick={(e) => {
                  e.target.select();
                  navigator.clipboard.writeText(sqlCommand);
                  alert('הקוד הועתק ללוח!');
                }}
                className="w-full bg-[#002C3E] text-[#78BCC4] font-mono text-[10px] p-4 rounded-xl border border-white/10 outline-none select-all"
                dir="ltr"
              />
              
              <div className="text-[10px] text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-semibold">
                💡 לחץ בתוך התיבה השחורה כדי להעתיק את הקוד אוטומטית. לאחר שתריץ אותו ב-Supabase, העמוד יסתנכרן אוטומטית בזמן אמת!
              </div>

              <button
                onClick={() => setShowSqlGuide(false)}
                className="w-full bg-[#002C3E] hover:bg-[#78BCC4] hover:text-[#002C3E] text-white py-3 rounded-xl font-bold text-sm transition-all"
              >
                סגור מדריך
              </button>
            </div>
          </div>
        )}

        {/* --- Footer --- */}
        <footer className="border-t border-[#002C3E]/10 py-6 text-center text-xs text-[#002C3E]/30 font-medium">
          &copy; {new Date().getFullYear()} israelfix · ניהול קריאות שירות וסדר לטכנאי
        </footer>
      </div>
    </>
  );
}

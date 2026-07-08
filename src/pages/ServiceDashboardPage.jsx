import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageSeo from '../components/PageSeo.jsx';
import AccessibilityMenu from '../components/AccessibilityMenu.jsx';
import { supabase } from '../lib/supabase.js';
import { FaWaze, FaWhatsapp } from 'react-icons/fa';
import CatalogAdminPanel from '../components/CatalogAdminPanel.jsx';
import { FiShoppingBag, FiUnlock, FiMenu, FiTrash2, FiPlus, FiSettings, FiTool, FiCalendar, FiBriefcase, FiUser, FiClock, FiAlertCircle, FiSave, FiDollarSign, FiClipboard, FiUsers, FiWifi, FiHome, FiLogOut, FiLock, FiDatabase, FiInfo, FiSearch, FiPhone, FiMapPin, FiCheckCircle, FiEdit2, FiActivity, FiShield } from 'react-icons/fi';


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

const BICYCLE_MODELS = ['Teverun Fighter', 'Cyber', 'Extreme 48V', 'אופני שטח חשמליים'];
const SCOOTER_MODELS = ['Nami Burn-e 2', 'Xiaomi M365', 'Inokim OX', 'Kaabo Mantis'];

const MOCK_REPAIRS = [
  {
    id: 201,
    customer_id: 1,
    customer_name: 'אופני דניאל',
    customer_phone: '0521234567',
    vehicle_type: 'bicycle',
    vehicle_model: 'Teverun Fighter',
    what_was_done: 'החלפת רפידות בלם קדמי ואחורי, כיוון בלמים הידראוליים.',
    notes: 'בוצע לבקשת דניאל במעבדה',
    price: '250',
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 202,
    customer_id: 2,
    customer_name: 'בייק סנטר',
    customer_phone: '0549876543',
    vehicle_type: 'scooter',
    vehicle_model: 'Nami Burn-e 2',
    what_was_done: 'תיקון פנצ׳ר גלגל אחורי, החלפת פנימית וצמיג שטח חדש.',
    notes: 'לקוח קבוע, הנחה של 10%',
    price: '380',
    status: 'completed',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const MOCK_WARRANTIES = [
  {
    id: 301,
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    customer_name: 'יוסי כהן',
    customer_phone: '0521234567',
    vehicle_description: 'Teverun Fighter - החלפת מנוע ושיפוץ בקר',
    duration_months: 6,
    start_date: new Date(Date.now() - 3600000 * 24 * 10).toISOString().split('T')[0],
    end_date: new Date(new Date(Date.now() - 3600000 * 24 * 10).setMonth(new Date(Date.now() - 3600000 * 24 * 10).getMonth() + 6)).toISOString().split('T')[0],
    notes: 'האחריות מכסה את המנוע והבקר בלבד.'
  },
  {
    id: 302,
    uuid: 'd3b07384-d113-4956-a5cc-96e0821d3f57',
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    customer_name: 'שירה לוי',
    customer_phone: '0549876543',
    vehicle_description: 'Nami Burn-e 2 - סוללה חדשה 72V',
    duration_months: 12,
    start_date: new Date(Date.now() - 3600000 * 24 * 5).toISOString().split('T')[0],
    end_date: new Date(new Date(Date.now() - 3600000 * 24 * 5).setMonth(new Date(Date.now() - 3600000 * 24 * 5).getMonth() + 12)).toISOString().split('T')[0],
    notes: 'אחריות על קיבולת הסוללה והתאים.'
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
    <div className="max-w-md mx-auto my-12 glass-card-light rounded-3xl p-8 shadow-xl text-right hover-tilt smooth-interactive">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-[#002C3E]/5 rounded-2xl flex items-center justify-center text-[#78BCC4] mx-auto mb-4 border border-[#78BCC4]/20 shadow-inner">
          <FiUnlock className="w-8 h-8" strokeWidth={2.5} />
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
            className="w-full bg-white/60 px-4 py-3.5 rounded-xl border border-[#002C3E]/20 outline-none focus:border-[#78BCC4] focus:ring-2 focus:ring-[#78BCC4]/20 transition-all text-[#002C3E] text-right text-sm placeholder:text-[#002C3E]/35"
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
          className="w-full bg-[#002C3E] hover:bg-[#F7444E] text-white px-6 py-4 rounded-xl font-bold text-sm shadow-md shadow-[#002C3E]/10 disabled:opacity-50 smooth-interactive active-click hover-tilt"
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

  // ניהול תעודות אחריות
  const [warranties, setWarranties] = useState([]);
  const [warrantySearchQuery, setWarrantySearchQuery] = useState('');
  const [showAddWarrantyModal, setShowAddWarrantyModal] = useState(false);
  const [warrantyCustomerName, setWarrantyCustomerName] = useState('');
  const [warrantyCustomerPhone, setWarrantyCustomerPhone] = useState('');
  const [warrantyVehicleDesc, setWarrantyVehicleDesc] = useState('');
  const [warrantyDuration, setWarrantyDuration] = useState(3); // 3, 6, 12
  const [warrantyStartDate, setWarrantyStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [warrantyNotes, setWarrantyNotes] = useState('');
  const [warrantyCustId, setWarrantyCustId] = useState('');
  const [showWarrantyInlineAddCust, setShowWarrantyInlineAddCust] = useState(false);
  const [warrInlineShopName, setWarrInlineShopName] = useState('');
  const [warrInlineOwnerName, setWarrInlineOwnerName] = useState('');
  const [warrInlinePhone, setWarrInlinePhone] = useState('');
  const [warrInlineAddress, setWarrInlineAddress] = useState('');

  // סיידבאר והגדרות
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  // ניהול תיקונים
  const [repairs, setRepairs] = useState([]);
  const [bicycleModels, setBicycleModels] = useState(BICYCLE_MODELS);
  const [scooterModels, setScooterModels] = useState(SCOOTER_MODELS);
  const [repairSearchQuery, setRepairSearchQuery] = useState('');
  const [repairFilterType, setRepairFilterType] = useState('all'); // all, bicycle, scooter
  const [repairFilterStatus, setRepairFilterStatus] = useState('all'); // all, pending, in_progress, completed
  const [repairDateFilter, setRepairDateFilter] = useState('all'); // all, today, yesterday, week, month
  
  // מודל הוספת תיקון
  const [showAddRepairModal, setShowAddRepairModal] = useState(false);
  const [repairCustId, setRepairCustId] = useState('');
  const [repairCustName, setRepairCustName] = useState('');
  const [repairCustPhone, setRepairCustPhone] = useState('');
  const [repairCustAddress, setRepairCustAddress] = useState('');
  const [showRepairInlineAddCust, setShowRepairInlineAddCust] = useState(false);
  
  // שדות תיקון חדש
  const [repairVehicleType, setRepairVehicleType] = useState('bicycle'); // bicycle, scooter
  const [repairVehicleModel, setRepairVehicleModel] = useState(BICYCLE_MODELS[0]);
  const [repairCustomModel, setRepairCustomModel] = useState('');
  const [repairWhatWasDone, setRepairWhatWasDone] = useState('');
  const [repairNotes, setRepairNotes] = useState('');
  const [repairPrice, setRepairPrice] = useState('');
  const [repairStatus, setRepairStatus] = useState('completed'); // completed, in_progress, pending

  // מודל עריכת תיקון
  const [editingRepair, setEditingRepair] = useState(null);

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

        // טעינת תיקונים מ-Supabase
        try {
          const { data: repData, error: repError } = await supabase
            .from('repairs')
            .select('*')
            .order('created_at', { ascending: false });
          if (!repError && repData) {
            setRepairs(repData);
          } else {
            loadRepairsFromLocalStorage();
          }
        } catch {
          loadRepairsFromLocalStorage();
        }
        
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

        // טעינת תעודות אחריות מ-Supabase
        try {
          const { data: warrData, error: warrError } = await supabase
            .from('warranties')
            .select('*')
            .order('created_at', { ascending: false });
          if (!warrError && warrData) {
            setWarranties(warrData);
          } else {
            loadWarrantiesFromLocalStorage();
          }
        } catch {
          loadWarrantiesFromLocalStorage();
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
      loadRepairsFromLocalStorage();
      loadCustomersFromLocalStorage();
      loadWarrantiesFromLocalStorage();
    };

    const loadRepairsFromLocalStorage = () => {
      const localReps = localStorage.getItem('israelfix_repairs');
      if (localReps) {
        setRepairs(JSON.parse(localReps));
      } else {
        localStorage.setItem('israelfix_repairs', JSON.stringify(MOCK_REPAIRS));
        setRepairs(MOCK_REPAIRS);
      }
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

    const loadWarrantiesFromLocalStorage = () => {
      const localWarr = localStorage.getItem('israelfix_warranties');
      if (localWarr) {
        setWarranties(JSON.parse(localWarr));
      } else {
        localStorage.setItem('israelfix_warranties', JSON.stringify(MOCK_WARRANTIES));
        setWarranties(MOCK_WARRANTIES);
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

  // שמירה ועדכון תעודות אחריות
  const saveWarrantiesState = async (updatedWarranties) => {
    setWarranties(updatedWarranties);
    localStorage.setItem('israelfix_warranties', JSON.stringify(updatedWarranties));
  };

  // שמירה ועדכון תיקונים
  const saveRepairsState = async (updatedRepairs) => {
    setRepairs(updatedRepairs);
    localStorage.setItem('israelfix_repairs', JSON.stringify(updatedRepairs));
  };

  // הוספת דגם חדש לרשימת הבחירה
  const handleAddNewModel = () => {
    const newModel = prompt('הכנס שם דגם חדש להוספה לרשימה:');
    if (newModel && newModel.trim()) {
      const trimmed = newModel.trim();
      if (repairVehicleType === 'bicycle') {
        if (!bicycleModels.includes(trimmed)) {
          setBicycleModels([...bicycleModels, trimmed]);
        }
        setRepairVehicleModel(trimmed);
      } else {
        if (!scooterModels.includes(trimmed)) {
          setScooterModels([...scooterModels, trimmed]);
        }
        setRepairVehicleModel(trimmed);
      }
    }
  };

  // הוספת דגם חדש בעריכת תיקון
  const handleAddNewModelEdit = () => {
    const newModel = prompt('הכנס שם דגם חדש להוספה לרשימה:');
    if (newModel && newModel.trim() && editingRepair) {
      const trimmed = newModel.trim();
      if (editingRepair.vehicle_type === 'bicycle') {
        if (!bicycleModels.includes(trimmed)) {
          setBicycleModels([...bicycleModels, trimmed]);
        }
        setEditingRepair({ ...editingRepair, vehicle_model: trimmed });
      } else {
        if (!scooterModels.includes(trimmed)) {
          setScooterModels([...scooterModels, trimmed]);
        }
        setEditingRepair({ ...editingRepair, vehicle_model: trimmed });
      }
    }
  };

  // יצירת תיקון חדש
  const handleCreateRepair = async (e) => {
    e.preventDefault();
    if (!repairCustName || !repairCustPhone) return;

    const finalModel = repairVehicleModel === 'custom' ? repairCustomModel : repairVehicleModel;
    if (!finalModel) return;

    const newRepair = {
      customer_id: repairCustId ? parseInt(repairCustId) : null,
      customer_name: repairCustName,
      customer_phone: repairCustPhone,
      vehicle_type: repairVehicleType,
      vehicle_model: finalModel,
      what_was_done: repairWhatWasDone,
      notes: repairNotes,
      price: repairPrice,
      status: repairStatus,
      created_at: new Date().toISOString()
    };

    let updatedRepairs = [];

    if (isUsingSupabase) {
      try {
        const { data, error } = await supabase
          .from('repairs')
          .insert([newRepair])
          .select();

        if (error) throw error;
        updatedRepairs = [data[0], ...repairs];
      } catch (err) {
        console.error('Supabase repair insert failed, adding to local instead:', err.message);
        const localRepair = { id: Date.now(), ...newRepair };
        updatedRepairs = [localRepair, ...repairs];
      }
    } else {
      const localRepair = { id: Date.now(), ...newRepair };
      updatedRepairs = [localRepair, ...repairs];
    }

    saveRepairsState(updatedRepairs);

    // איפוס שדות וסגירה
    setRepairCustId('');
    setRepairCustName('');
    setRepairCustPhone('');
    setRepairCustAddress('');
    setRepairWhatWasDone('');
    setRepairNotes('');
    setRepairPrice('');
    setRepairStatus('completed');
    setRepairCustomModel('');
    setShowAddRepairModal(false);
  };

  // יצירת לקוח מהיר מתוך תיקון
  const handleCreateCustomerInlineRepair = async (e) => {
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

    // מילוי אוטומטי בטופס התיקון
    setRepairCustId(createdCust.id);
    setRepairCustName(`${createdCust.shop_name} (${createdCust.owner_name})`);
    setRepairCustPhone(createdCust.phone);
    setRepairCustAddress(createdCust.address);

    // איפוס שדות
    setInlineShopName('');
    setInlineOwnerName('');
    setInlinePhone('');
    setInlineAddress('');
    setShowRepairInlineAddCust(false);
  };

  // הוספת לקוח פרטי מהיר (שם + טלפון בלבד) ישירות מטופס התיקון
  const handleQuickAddPrivateCustomer = async () => {
    const name = repairCustName.trim();
    const phone = repairCustPhone.trim();
    if (!name || !phone) return;

    // אם כבר קיים לקוח עם אותו טלפון במאגר - נקשר את התיקון אליו במקום ליצור כפילות
    const existing = customers.find((c) => c.phone === phone);
    if (existing) {
      setRepairCustId(existing.id);
      setRepairCustName(`${existing.shop_name} (${existing.owner_name})`);
      setRepairCustPhone(existing.phone);
      setRepairCustAddress(existing.address);
      return;
    }

    const newCustomer = {
      shop_name: name,
      owner_name: name,
      phone,
      address: '',
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
        console.error('Supabase private customer insert failed:', err.message);
        createdCust = { id: Date.now(), ...newCustomer };
        updatedCustList = [...customers, createdCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
      }
    } else {
      createdCust = { id: Date.now(), ...newCustomer };
      updatedCustList = [...customers, createdCust].sort((a, b) => a.shop_name.localeCompare(b.shop_name));
    }

    saveCustomersState(updatedCustList);
    setRepairCustId(createdCust.id);
  };

  // שינוי בחירת לקוח בתיקון
  const handleSelectCustomerChangeRepair = (id) => {
    setRepairCustId(id);
    if (!id) {
      setRepairCustName('');
      setRepairCustPhone('');
      setRepairCustAddress('');
      return;
    }
    const found = customers.find(c => String(c.id) === String(id));
    if (found) {
      setRepairCustName(`${found.shop_name} (${found.owner_name})`);
      setRepairCustPhone(found.phone);
      setRepairCustAddress(found.address);
    }
  };

  // מחיקת תיקון
  const handleDeleteRepair = async (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את התיקון הזה מהמערכת?')) return;

    let updatedRepairs = repairs.filter(r => r.id !== id);
    saveRepairsState(updatedRepairs);

    if (isUsingSupabase) {
      try {
        await supabase
          .from('repairs')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Supabase repair delete error:', err.message);
      }
    }
  };

  // עדכון תיקון קיים
  const handleUpdateRepair = async (e) => {
    e.preventDefault();
    if (!editingRepair || !editingRepair.customer_name || !editingRepair.customer_phone) return;

    let updatedRepairs = repairs.map(r => r.id === editingRepair.id ? editingRepair : r);
    saveRepairsState(updatedRepairs);

    if (isUsingSupabase) {
      try {
        await supabase
          .from('repairs')
          .update({
            customer_name: editingRepair.customer_name,
            customer_phone: editingRepair.customer_phone,
            vehicle_type: editingRepair.vehicle_type,
            vehicle_model: editingRepair.vehicle_model,
            what_was_done: editingRepair.what_was_done,
            notes: editingRepair.notes,
            price: editingRepair.price,
            status: editingRepair.status
          })
          .eq('id', editingRepair.id);
      } catch (err) {
        console.error('Supabase repair update error:', err.message);
      }
    }

    setEditingRepair(null);
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

  // שינוי בחירת לקוח בתעודת אחריות
  const handleSelectCustomerChangeWarranty = (id) => {
    setWarrantyCustId(id);
    if (!id) {
      setWarrantyCustomerName('');
      setWarrantyCustomerPhone('');
      return;
    }
    const found = customers.find(c => String(c.id) === String(id));
    if (found) {
      setWarrantyCustomerName(found.owner_name ? `${found.shop_name} (${found.owner_name})` : found.shop_name);
      setWarrantyCustomerPhone(found.phone);
    }
  };

  // יצירת לקוח מהיר מתוך תעודת אחריות
  const handleCreateCustomerInlineWarranty = async (e) => {
    e.preventDefault();
    if (!warrInlineShopName || !warrInlineOwnerName || !warrInlinePhone || !warrInlineAddress) {
      alert('אנא מלא את כל השדות להוספת לקוח');
      return;
    }

    const newCustomer = {
      shop_name: warrInlineShopName,
      owner_name: warrInlineOwnerName,
      phone: warrInlinePhone,
      address: warrInlineAddress,
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

    // מילוי אוטומטי בטופס תעודת האחריות
    setWarrantyCustId(createdCust.id);
    setWarrantyCustomerName(createdCust.owner_name ? `${createdCust.shop_name} (${createdCust.owner_name})` : createdCust.shop_name);
    setWarrantyCustomerPhone(createdCust.phone);

    // איפוס שדות
    setWarrInlineShopName('');
    setWarrInlineOwnerName('');
    setWarrInlinePhone('');
    setWarrInlineAddress('');
    setShowWarrantyInlineAddCust(false);
  };

  // הוספת לקוח פרטי מהיר (שם + טלפון בלבד) ישירות מטופס תעודת האחריות
  const handleQuickAddPrivateCustomerWarranty = async () => {
    const name = warrantyCustomerName.trim();
    const phone = warrantyCustomerPhone.trim();
    if (!name || !phone) return;

    // אם כבר קיים לקוח עם אותו טלפון במאגר - נקשר את התעודה אליו במקום ליצור כפילות
    const existing = customers.find((c) => c.phone === phone);
    if (existing) {
      setWarrantyCustId(existing.id);
      setWarrantyCustomerName(existing.owner_name ? `${existing.shop_name} (${existing.owner_name})` : existing.shop_name);
      setWarrantyCustomerPhone(existing.phone);
      return;
    }

    const newCustomer = {
      shop_name: name,
      owner_name: name,
      phone,
      address: '',
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

    setWarrantyCustId(createdCust.id);
    setWarrantyCustomerName(createdCust.owner_name ? `${createdCust.shop_name} (${createdCust.owner_name})` : createdCust.shop_name);
    setWarrantyCustomerPhone(createdCust.phone);
  };

  // הוספת תעודת אחריות חדשה
  const handleAddWarranty = async (e) => {
    e.preventDefault();
    if (!warrantyCustomerName.trim()) {
      alert('אנא הזן שם לקוח');
      return;
    }
    if (!warrantyVehicleDesc.trim()) {
      alert('אנא הזן תיאור מוצר / תיקון');
      return;
    }

    // Calculate end date based on start date + duration months
    const start = new Date(warrantyStartDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + parseInt(warrantyDuration, 10));
    const endDateStr = end.toISOString().split('T')[0];

    const tempUuid = crypto.randomUUID();

    const newWarranty = {
      customer_id: warrantyCustId ? parseInt(warrantyCustId, 10) : null,
      customer_name: warrantyCustomerName,
      customer_phone: warrantyCustomerPhone,
      vehicle_description: warrantyVehicleDesc,
      duration_months: parseInt(warrantyDuration, 10),
      start_date: warrantyStartDate,
      end_date: endDateStr,
      notes: warrantyNotes,
      uuid: tempUuid
    };

    let updatedWarranties = [];

    if (isUsingSupabase) {
      try {
        const { data, error } = await supabase
          .from('warranties')
          .insert([newWarranty])
          .select();

        if (error) throw error;
        updatedWarranties = [data[0], ...warranties];
      } catch (err) {
        console.error('Supabase warranty insert failed, adding to local instead:', err.message);
        const localWarr = { id: Date.now(), created_at: new Date().toISOString(), ...newWarranty };
        updatedWarranties = [localWarr, ...warranties];
      }
    } else {
      const localWarr = { id: Date.now(), created_at: new Date().toISOString(), ...newWarranty };
      updatedWarranties = [localWarr, ...warranties];
    }

    saveWarrantiesState(updatedWarranties);

    // Reset form states
    setWarrantyCustId('');
    setWarrantyCustomerName('');
    setWarrantyCustomerPhone('');
    setWarrantyVehicleDesc('');
    setWarrantyDuration(3);
    setWarrantyStartDate(new Date().toISOString().split('T')[0]);
    setWarrantyNotes('');
    setShowAddWarrantyModal(false);

    alert('תעודת האחריות נוצרה בהצלחה!');
  };

  // מחיקת תעודת אחריות
  const handleDeleteWarranty = async (id, uuid) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק תעודת אחריות זו?')) return;

    let updatedWarranties = warranties.filter(w => w.id !== id && w.uuid !== uuid);
    saveWarrantiesState(updatedWarranties);

    if (isUsingSupabase) {
      try {
        await supabase
          .from('warranties')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Supabase warranty delete error:', err.message);
      }
    }
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

-- 3. טבלת תיקונים במעבדה
CREATE TABLE IF NOT EXISTS public.repairs (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_id bigint REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    vehicle_type text NOT NULL, -- 'bicycle', 'scooter'
    vehicle_model text NOT NULL,
    what_was_done text NOT NULL,
    notes text,
    price text DEFAULT ''::text,
    status text DEFAULT 'completed'::text NOT NULL
);

ALTER TABLE public.repairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read and write" ON public.repairs 
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- 4. טבלת תעודות אחריות
CREATE TABLE IF NOT EXISTS public.warranties (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    uuid uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    customer_id bigint REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name text NOT NULL,
    customer_phone text,
    vehicle_description text NOT NULL,
    duration_months integer NOT NULL,
    start_date date DEFAULT CURRENT_DATE NOT NULL,
    end_date date NOT NULL,
    notes text
);

ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous read and write" ON public.warranties 
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
              <FiTool className="w-6 h-6" strokeWidth={2.5} />
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
                <FiTool className="w-6 h-6" strokeWidth={2.5} />
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
                  <FiClipboard className="text-lg" />
                  <span>קריאות שירות</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('repairs')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'repairs'
                    ? 'bg-[#78BCC4] text-[#002C3E] shadow-lg shadow-[#78BCC4]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiTool className="text-lg" />
                  <span>ניהול תיקונים</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('warranties')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'warranties'
                    ? 'bg-[#78BCC4] text-[#002C3E] shadow-lg shadow-[#78BCC4]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiShield className="text-lg" />
                  <span>תעודות אחריות</span>
                </div>
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
                  <FiUsers className="text-lg" />
                  <span>מאגר לקוחות</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'catalog'
                    ? 'bg-[#78BCC4] text-[#002C3E] shadow-lg shadow-[#78BCC4]/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiShoppingBag className="text-lg" />
                  <span>ניהול קטלוג</span>
                </div>
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
                  <FiSettings className="text-lg" />
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
                <FiHome className="text-lg" /><span>חזרה לאתר</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-xs font-black text-white bg-[#F7444E]/90 hover:bg-[#F7444E] border border-white/10 py-3 rounded-xl transition-all shadow-md shadow-[#F7444E]/10"
              >
                <span className="flex items-center justify-center gap-2">התנתק <FiLogOut /></span>
              </button>
            </div>
          </div>
        </aside>

        {/* --- MOBILE HEADER & DRAWER --- */}
        <div className="md:hidden w-full bg-[#002C3E] text-white border-b border-[#78BCC4]/20 py-3.5 px-4 sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-[#78BCC4]">
              <FiTool className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-md font-black tracking-tight text-white">
              israelfix<span className="text-[#F7444E]">.</span>
            </span>
          </div>

          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            <FiMenu className="w-6 h-6" strokeWidth={2.5} />
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
                  <FiTool className="w-5 h-5" strokeWidth={2.5} />
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
                  <FiClipboard className="text-xl" />
                  <span>קריאות שירות</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('repairs');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'repairs'
                    ? 'bg-[#78BCC4] text-[#002C3E]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiTool className="text-xl" />
                  <span>ניהול תיקונים</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('warranties');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'warranties'
                    ? 'bg-[#78BCC4] text-[#002C3E]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiShield className="text-xl" />
                  <span>תעודות אחריות</span>
                </div>
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
                  <FiUsers className="text-xl" />
                  <span>מאגר לקוחות</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('catalog');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
                  activeTab === 'catalog'
                    ? 'bg-[#78BCC4] text-[#002C3E]'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FiShoppingBag className="text-xl" />
                  <span>ניהול קטלוג</span>
                </div>
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
                  <FiSettings className="text-xl" />
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
                <FiHome className="text-lg" /><span>חזרה לאתר</span>
              </Link>

              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full text-xs font-black text-white bg-[#F7444E]/90 hover:bg-[#F7444E] border border-white/10 py-2.5 rounded-xl transition-all shadow-md shadow-[#F7444E]/10"
              >
                <span className="flex items-center justify-center gap-2">התנתק <FiLogOut /></span>
              </button>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT PANEL --- */}
        <main className="flex-1 min-h-screen p-4 md:p-8 text-right overflow-y-auto max-w-full">
          <div className="space-y-6">
            
            {/* --- 0. CATALOG WORKSPACE --- */}
            {activeTab === 'catalog' && (
              <div className="space-y-6 animate-fade-in" data-aos="fade-up">
                <div className="flex flex-col gap-1 mb-4">
                  <h2 className="text-2xl font-black text-[#002C3E]">🛍️ ניהול קטלוג מוצרים</h2>
                  <p className="text-[#002C3E]/50 text-xs">הוספה, עריכה ומחיקה של מוצרים המוצגים בדף הבית</p>
                </div>
                <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm">
                  <CatalogAdminPanel />
                </div>
              </div>
            )}

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
                        <FiLock className="text-xl" />
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
                            <span className="flex items-center gap-1.5"><FiSave /> שמור סיסמה חדשה</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* SQL Setup Script Card */}
                    <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-[#002C3E]/5 pb-3">
                        <div className="flex items-center gap-3">
                          <FiDatabase className="text-xl" />
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
                        <span className="flex items-center gap-1.5"><FiInfo className="text-amber-500" /> הסקריפט כולל יצירה של שתי טבלאות (service_calls ו-customers) עם הגדרות הרשאות Row Level Security (RLS) המאפשרות כתיבה וקריאה אנונימית לצורך חיבור מהיר ללא צורך במנגנוני Auth מורכבים.</span>
                      </div>
                    </div>

                  </div>

                  {/* Column 3: Database Connection Status & System Metadata */}
                  <div className="space-y-6">
                    
                    {/* Connection Stats Card */}
                    <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-3 border-b border-[#002C3E]/5 pb-3">
                        <FiWifi className="text-xl" />
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
                        <FiInfo className="text-xl" />
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
                    <span className="flex items-center justify-center gap-2"><FiPlus className="text-xl"/> הוספת לקוח חדש במאגר</span>
                  </button>

                  <div className="w-full sm:max-w-md relative">
                    <input
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      placeholder="חפש לפי שם חנות, בעל עסק או טלפון..."
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
                                <span className="flex items-center gap-1"><FiUser /> בעל עסק:</span> {cust.owner_name}
                              </span>
                            </div>
                            
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setEditingCustomer(cust)}
                                className="text-xs font-bold text-[#2a8fa0] bg-[#78BCC4]/15 hover:bg-[#78BCC4]/30 px-2.5 py-1.5 rounded-xl transition-all"
                              >
                                <span className="flex items-center justify-center gap-1"><FiEdit2 /> ערוך</span>
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(cust.id)}
                                className="text-xs font-bold text-[#F7444E] bg-[#FEF2F2] hover:bg-[#F7444E]/20 px-2.5 py-1.5 rounded-xl transition-all"
                              >
                                <span className="flex items-center justify-center gap-1"><FiTrash2 /> מחק</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-[#002C3E]/5 pt-3 text-xs">
                            <div className="flex items-start gap-2 text-[#002C3E]/80">
                              <span className="text-[#002C3E]/45 block shrink-0"><span className="flex items-center gap-1"><FiMapPin /> כתובת:</span></span>
                              <span className="font-bold">{cust.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#002C3E]/80">
                              <span className="text-[#002C3E]/45 block shrink-0"><span className="flex items-center gap-1"><FiPhone /> טלפון:</span></span>
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
                            <span className="flex items-center justify-center gap-2"><FiPlus /> פתח קריאת שירות ללקוח זה</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white rounded-3xl border border-[#002C3E]/5 py-12 text-center text-[#002C3E]/30 text-sm font-semibold">
                      לא נמצאו לקוחות במאגר העונים לחיפוש
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- 2.2 WARRANTIES WORKSPACE --- */}
            {activeTab === 'warranties' && (
              <div className="space-y-6 animate-fade-in" data-aos="fade-up">
                {/* --- Warranties Action Panel --- */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-[#002C3E]/5 rounded-3xl p-5 shadow-sm">
                  <button
                    onClick={() => setShowAddWarrantyModal(true)}
                    className="w-full sm:w-auto bg-[#F7444E] hover:bg-[#de3d46] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-[#F7444E]/25 transition-all flex items-center justify-center gap-2 smooth-interactive hover-tilt active-click"
                  >
                    <span className="flex items-center justify-center gap-2"><FiPlus className="text-xl"/> תעודת אחריות חדשה</span>
                  </button>

                  <div className="w-full sm:max-w-md relative">
                    <input
                      type="text"
                      value={warrantySearchQuery}
                      onChange={(e) => setWarrantySearchQuery(e.target.value)}
                      placeholder="חפש לפי שם לקוח, טלפון או תיאור תיקון..."
                      className="w-full bg-[#F4F9FA] px-12 py-3.5 rounded-2xl border border-[#002C3E]/5 outline-none focus:border-[#78BCC4] transition-all text-[#002C3E] text-right font-medium text-sm"
                    />
                    <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#002C3E]/40 text-lg" />
                  </div>
                </div>

                {/* --- Warranties Grid/List --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {warranties.filter(w => {
                    const query = warrantySearchQuery.trim().toLowerCase();
                    if (!query) return true;
                    return (
                      (w.customer_name && w.customer_name.toLowerCase().includes(query)) ||
                      (w.customer_phone && w.customer_phone.toLowerCase().includes(query)) ||
                      (w.vehicle_description && w.vehicle_description.toLowerCase().includes(query))
                    );
                  }).length > 0 ? (
                    warranties.filter(w => {
                      const query = warrantySearchQuery.trim().toLowerCase();
                      if (!query) return true;
                      return (
                        (w.customer_name && w.customer_name.toLowerCase().includes(query)) ||
                        (w.customer_phone && w.customer_phone.toLowerCase().includes(query)) ||
                        (w.vehicle_description && w.vehicle_description.toLowerCase().includes(query))
                      );
                    }).map((w) => {
                      const isWarrActive = new Date(w.end_date) >= new Date(new Date().setHours(0, 0, 0, 0));
                      const shareLink = window.location.origin + '/warranty/' + (w.uuid || w.id);
                      const whatsappText = `היי ${w.customer_name}, מצורפת תעודת האחריות הדיגיטלית שלך ממעבדת israelfix עבור: ${w.vehicle_description}. קישור לתעודה: ${shareLink}`;
                      
                      return (
                        <div
                          key={w.id}
                          className="bg-white rounded-3xl border border-[#002C3E]/5 p-6 shadow-sm space-y-4 hover-tilt smooth-interactive hover:shadow-md relative overflow-hidden"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-black text-[#002C3E]">{w.customer_name}</h3>
                              <p className="text-xs text-[#002C3E]/50 font-bold">{w.customer_phone || 'אין טלפון'}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                              isWarrActive
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : 'bg-[#FEF2F2] text-[#F7444E] border border-[#F7444E]/10'
                            }`}>
                              {isWarrActive ? 'בתוקף' : 'פג תוקף'}
                            </span>
                          </div>

                          <div className="text-sm font-semibold text-[#002C3E]/80 border-t border-b border-[#002C3E]/5 py-3 space-y-1">
                            <p><span className="text-xs text-[#002C3E]/40 font-medium">תיאור:</span> {w.vehicle_description}</p>
                            <p><span className="text-xs text-[#002C3E]/40 font-medium">תקופה:</span> {w.duration_months} חודשים</p>
                            <p><span className="text-xs text-[#002C3E]/40 font-medium">סיום:</span> {new Date(w.end_date).toLocaleDateString('he-IL')}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {/* פתיחת תעודה */}
                            <a
                              href={`/warranty/${w.uuid || w.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-[#002C3E]/5 hover:bg-[#002C3E]/10 text-[#002C3E] text-xs font-black px-3 py-2 rounded-xl transition-all flex-1 text-center"
                            >
                              הצג תעודה
                            </a>
                            
                            {/* העתקת קישור */}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(shareLink);
                                alert('הקישור לתעודת האחריות הועתק ללוח!');
                              }}
                              className="bg-[#78BCC4]/10 hover:bg-[#78BCC4]/20 text-[#2a8fa0] text-xs font-black px-3 py-2 rounded-xl transition-all"
                              title="העתק קישור"
                            >
                              העתק קישור
                            </button>

                            {/* שליחה בווטסאפ */}
                            {w.customer_phone && (
                              <a
                                href={`https://wa.me/972${w.customer_phone.replace(/^0/, '')}?text=${encodeURIComponent(whatsappText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-black px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                                title="שלח ב-WhatsApp"
                              >
                                <FaWhatsapp className="text-sm" />
                                <span>שתף</span>
                              </a>
                            )}

                            {/* מחיקה */}
                            <button
                              onClick={() => handleDeleteWarranty(w.id, w.uuid)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-xl transition-all mr-auto"
                              title="מחק תעודה"
                            >
                              <FiTrash2 className="text-base" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full bg-white rounded-3xl border border-[#002C3E]/5 py-12 text-center text-[#002C3E]/30 text-sm font-semibold">
                      לא נמצאו תעודות אחריות העונות לחיפוש
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- 2.5 REPAIRS WORKSPACE --- */}
            {activeTab === 'repairs' && (
              <div className="space-y-6 animate-fade-in" data-aos="fade-up">
                {/* --- Top Metrics Banner --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-[#002C3E]/5 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black text-[#F7444E]">
                      {repairs.filter(r => r.status === 'pending').length}
                    </span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">תיקונים בממתין</span>
                  </div>
                  <div className="bg-white border border-[#002C3E]/5 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black text-amber-500">
                      {repairs.filter(r => r.status === 'in_progress').length}
                    </span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">תיקונים בטיפול</span>
                  </div>
                  <div className="bg-white border border-[#002C3E]/5 rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-2xl md:text-3xl font-black text-emerald-500">
                      {repairs.filter(r => r.status === 'completed').length}
                    </span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">תיקונים שהושלמו</span>
                  </div>
                  <div className="bg-[#002C3E] rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-white">
                    <span className="text-2xl md:text-3xl font-black text-[#78BCC4]">
                      ₪{repairs.filter(r => r.status === 'completed' && r.price).reduce((sum, r) => sum + parseFloat(r.price || 0), 0)}
                    </span>
                    <span className="text-xs font-bold text-white/50 mt-1">סך הכל הכנסות</span>
                  </div>
                </div>

                {/* --- Advanced Filters Panel --- */}
                <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <button
                      onClick={() => {
                        setRepairCustId('');
                        setRepairCustName('');
                        setRepairCustPhone('');
                        setRepairCustAddress('');
                        setRepairWhatWasDone('');
                        setRepairNotes('');
                        setRepairPrice('');
                        setRepairStatus('completed');
                        setRepairVehicleType('bicycle');
                        setRepairVehicleModel(BICYCLE_MODELS[0]);
                        setRepairCustomModel('');
                        setShowRepairInlineAddCust(false);
                        setShowAddRepairModal(true);
                      }}
                      className="w-full sm:w-auto bg-[#F7444E] hover:bg-[#de3d46] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-[#F7444E]/25 transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      <FiPlus className="w-5 h-5" strokeWidth={3} />
                      הוספת תיקון חדש
                    </button>

                    <div className="w-full sm:max-w-md relative">
                      <input
                        type="text"
                        value={repairSearchQuery}
                        onChange={(e) => setRepairSearchQuery(e.target.value)}
                        placeholder="חפש לפי שם לקוח, טלפון, דגם, מה שבוצע..."
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-2xl px-4 py-3.5 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-medium"
                      />
                      {repairSearchQuery && (
                        <button
                          onClick={() => setRepairSearchQuery('')}
                          className="absolute left-3 top-3.5 text-xs text-[#002C3E]/30 hover:text-[#002C3E] font-bold"
                        >
                          ✕ נקה
                        </button>
                      )}
                    </div>
                  </div>

                  {/* filters line */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#002C3E]/5">
                    <div>
                      <label className="block text-xs font-bold text-[#002C3E]/55 mb-1.5"><span className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-[#002C3E]/55"><FiCalendar /> סינון לפי ימים</span></label>
                      <select
                        value={repairDateFilter}
                        onChange={(e) => setRepairDateFilter(e.target.value)}
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#78BCC4] text-xs font-bold text-[#002C3E] cursor-pointer"
                      >
                        <option value="all">כל הזמן</option>
                        <option value="today">היום האחרון</option>
                        <option value="yesterday">אתמול</option>
                        <option value="week">7 הימים האחרונים</option>
                        <option value="month">החודש הנוכחי</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#002C3E]/55 mb-1.5"><span className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-[#002C3E]/55">🚲 סוג הכלי</span></label>
                      <select
                        value={repairFilterType}
                        onChange={(e) => setRepairFilterType(e.target.value)}
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#78BCC4] text-xs font-bold text-[#002C3E] cursor-pointer"
                      >
                        <option value="all">כל סוגי הכלים</option>
                        <option value="bicycle">אופניים חשמליים</option>
                        <option value="scooter">קורקינטים חשמליים</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#002C3E]/55 mb-1.5"><span className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-[#002C3E]/55"><FiActivity /> סטטוס התיקון</span></label>
                      <select
                        value={repairFilterStatus}
                        onChange={(e) => setRepairFilterStatus(e.target.value)}
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#78BCC4] text-xs font-bold text-[#002C3E] cursor-pointer"
                      >
                        <option value="all">כל הסטטוסים</option>
                        <option value="pending">ממתין</option>
                        <option value="in_progress">בטיפול במעבדה</option>
                        <option value="completed">הושלם בהצלחה</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* --- Repairs List --- */}
                <div className="space-y-4">
                  {/* Filter repairs list */}
                  {(() => {
                    const filtered = repairs.filter(r => {
                      if (repairSearchQuery) {
                        const q = repairSearchQuery.toLowerCase();
                        const nameMatch = r.customer_name?.toLowerCase().includes(q);
                        const phoneMatch = r.customer_phone?.includes(q);
                        const modelMatch = r.vehicle_model?.toLowerCase().includes(q);
                        const actionMatch = r.what_was_done?.toLowerCase().includes(q);
                        const notesMatch = r.notes?.toLowerCase().includes(q);
                        if (!nameMatch && !phoneMatch && !modelMatch && !actionMatch && !notesMatch) return false;
                      }
                      if (repairFilterType !== 'all' && r.vehicle_type !== repairFilterType) return false;
                      if (repairFilterStatus !== 'all' && r.status !== repairFilterStatus) return false;
                      if (repairDateFilter !== 'all') {
                        const date = new Date(r.created_at);
                        const now = new Date();
                        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
                        const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
                        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

                        if (repairDateFilter === 'today' && date < todayStart) return false;
                        if (repairDateFilter === 'yesterday' && (date < yesterdayStart || date >= todayStart)) return false;
                        if (repairDateFilter === 'week' && date < weekStart) return false;
                        if (repairDateFilter === 'month' && date < monthStart) return false;
                      }
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="bg-white rounded-3xl border border-[#002C3E]/5 py-12 text-center text-[#002C3E]/30 text-sm font-semibold">
                          אין תיקונים העונים לסינון שבחרת
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* --- Mobile View (block md:hidden) --- */}
                        <div className="block md:hidden space-y-4">
                          {filtered.map(r => (
                            <div
                              key={r.id}
                              className="bg-white border border-[#002C3E]/5 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden text-right"
                            >
                              <div className={`absolute top-0 right-0 left-0 h-1.5 ${
                                r.status === 'pending' ? 'bg-[#F7444E]' :
                                r.status === 'in_progress' ? 'bg-amber-400' : 'bg-emerald-500'
                              }`} />

                              <div className="flex justify-between items-start gap-2 mb-3">
                                <div>
                                  <h3 className="text-lg font-extrabold text-[#002C3E]">
                                    {r.customer_name}
                                  </h3>
                                  <a href={`tel:${r.customer_phone}`} className="text-xs text-[#78BCC4] font-bold block mt-1" dir="ltr">
                                    {r.customer_phone}
                                  </a>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  r.status === 'pending' ? 'bg-[#F7444E]/10 text-[#F7444E]' :
                                  r.status === 'in_progress' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                  {r.status === 'pending' ? 'ממתין' :
                                   r.status === 'in_progress' ? 'בטיפול' : 'הושלם'}
                                </span>
                              </div>

                              <div className="space-y-2 border-t border-[#002C3E]/5 pt-3 text-xs">
                                <div>
                                  <span className="text-[#002C3E]/50 block">סוג כלי ודגם:</span>
                                  <span className="font-bold">{r.vehicle_type === 'bicycle' ? '🚲 אופניים' : '🛴 קורקינט'} - {r.vehicle_model}</span>
                                </div>
                                <div>
                                  <span className="text-[#002C3E]/50 block">מה תוקן:</span>
                                  <span className="font-bold text-[#002C3E]/90">{r.what_was_done}</span>
                                </div>
                                {r.notes && (
                                  <div>
                                    <span className="text-[#002C3E]/50 block">הערות:</span>
                                    <span className="italic text-[#002C3E]/70">{r.notes}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center border-t border-[#002C3E]/5 pt-2 mt-2 font-black text-sm">
                                  <span>מחיר:</span>
                                  <span className="text-[#78BCC4]">₪{r.price || '0'}</span>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-[#002C3E]/5 flex justify-end gap-2">
                                <a
                                  href={`https://wa.me/972${r.customer_phone.replace(/^0/, '')}?text=${encodeURIComponent(`היי ${r.customer_name}, להלן סיכום הטיפול שבוצע בכלי שלך במעבדה:\n\n🛠️ *כלי:* ${r.vehicle_model}\n⚙️ *מה בוצע:* ${r.what_was_done}\n💰 *סך הכל שולם:* ₪${r.price || '0'}\n\nתודה רבה! 🚀`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-[#25D366] hover:bg-[#128C7E] text-white p-2 rounded-xl transition-all"
                                  title="שלח סיכום בוואטסאפ"
                                >
                                  <FaWhatsapp className="text-base" />
                                </a>
                                <button
                                  onClick={() => setEditingRepair(r)}
                                  className="text-xs font-bold text-[#2a8fa0] bg-[#78BCC4]/15 hover:bg-[#78BCC4]/30 px-3 py-2 rounded-xl transition-all"
                                >
                                  ערוך
                                </button>
                                <button
                                  onClick={() => handleDeleteRepair(r.id)}
                                  className="text-xs font-bold text-[#F7444E] bg-[#FEF2F2] hover:bg-[#F7444E]/20 px-3 py-2 rounded-xl transition-all"
                                >
                                  מחק
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* --- Desktop View (hidden md:block) --- */}
                        <div className="hidden md:block bg-white border border-[#002C3E]/5 rounded-3xl shadow-sm overflow-hidden text-right">
                          <div className="overflow-x-auto">
                            <table className="w-full text-right border-collapse text-[#002C3E]">
                              <thead>
                                <tr className="bg-[#002C3E] text-white text-xs font-bold border-b border-[#002C3E]/10">
                                  <th className="py-4 px-4 font-black">תאריך</th>
                                  <th className="py-4 px-4 font-black">לקוח</th>
                                  <th className="py-4 px-4 font-black">פרטי הכלי</th>
                                  <th className="py-4 px-4 font-black w-1/3">מה נעשה בכלי</th>
                                  <th className="py-4 px-4 font-black text-center">מחיר</th>
                                  <th className="py-4 px-4 font-black text-center">סטטוס</th>
                                  <th className="py-4 px-4 font-black text-left">פעולות</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#002C3E]/5 text-xs">
                                {filtered.map(r => {
                                  const formattedDate = new Date(r.created_at).toLocaleDateString('he-IL', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  });
                                  return (
                                    <tr key={r.id} className="hover:bg-[#78BCC4]/5 transition-colors">
                                      <td className="py-4 px-4 font-medium text-[#002C3E]/60 whitespace-nowrap" dir="ltr">{formattedDate}</td>
                                      <td className="py-4 px-4">
                                        <div className="font-extrabold text-[#002C3E] text-sm">{r.customer_name}</div>
                                        <a href={`tel:${r.customer_phone}`} className="text-[#78BCC4] hover:underline font-semibold" dir="ltr">{r.customer_phone}</a>
                                      </td>
                                      <td className="py-4 px-4 whitespace-nowrap font-bold">
                                        {r.vehicle_type === 'bicycle' ? '🚲 אופניים' : '🛴 קורקינט'}
                                        <div className="text-xs text-[#002C3E]/60 font-medium">{r.vehicle_model}</div>
                                      </td>
                                      <td className="py-4 px-4 leading-relaxed font-semibold">
                                        <div>{r.what_was_done}</div>
                                        {r.notes && (
                                          <div className="text-[10px] text-[#002C3E]/50 font-normal mt-0.5">הערות: {r.notes}</div>
                                        )}
                                      </td>
                                      <td className="py-4 px-4 text-center font-black text-sm text-[#002C3E]">₪{r.price || '0'}</td>
                                      <td className="py-4 px-4 text-center whitespace-nowrap">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold inline-block ${
                                          r.status === 'pending' ? 'bg-[#F7444E]/10 text-[#F7444E]' :
                                          r.status === 'in_progress' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                          {r.status === 'pending' ? 'ממתין' :
                                           r.status === 'in_progress' ? 'בטיפול' : 'הושלם'}
                                        </span>
                                      </td>
                                      <td className="py-4 px-4 text-left">
                                        <div className="flex items-center justify-end gap-2">
                                          <a
                                            href={`https://wa.me/972${r.customer_phone.replace(/^0/, '')}?text=${encodeURIComponent(`היי ${r.customer_name}, להלן סיכום הטיפול שבוצע בכלי שלך במעבדה:\n\n🛠️ *כלי:* ${r.vehicle_model}\n⚙️ *מה בוצע:* ${r.what_was_done}\n💰 *סך הכל שולם:* ₪${r.price || '0'}\n\nתודה רבה! 🚀`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-[#EEF6F8] hover:bg-[#25D366]/10 text-[#002C3E] hover:text-[#128C7E] rounded-xl transition-all"
                                            title="שלח סיכום בוואטסאפ"
                                          >
                                            <FaWhatsapp className="text-lg" />
                                          </a>
                                          <button
                                            onClick={() => setEditingRepair(r)}
                                            className="text-xs font-bold text-[#2a8fa0] bg-[#78BCC4]/15 hover:bg-[#78BCC4]/30 px-3 py-2 rounded-xl transition-all"
                                          >
                                            ערוך
                                          </button>
                                          <button
                                            onClick={() => handleDeleteRepair(r.id)}
                                            className="text-xs font-bold text-[#F7444E] bg-[#FEF2F2] hover:bg-[#F7444E]/20 px-3 py-2 rounded-xl transition-all"
                                          >
                                            מחק
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* --- 3. SERVICE CALLS WORKSPACE --- */}
            {activeTab === 'calls' && (
              <div className="space-y-6 animate-fade-in" data-aos="fade-up">
                {/* --- Top Metrics Banner --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-card-light rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center hover-tilt active-click smooth-interactive hover:shadow-md border border-white/50">
                    <span className="text-2xl md:text-3xl font-black text-[#F7444E]">{countPending}</span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">קריאות בממתין</span>
                  </div>
                  <div className="glass-card-light rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center hover-tilt active-click smooth-interactive hover:shadow-md border border-white/50">
                    <span className="text-2xl md:text-3xl font-black text-amber-500">{countInProgress}</span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">קריאות בטיפול</span>
                  </div>
                  <div className="glass-card-light rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center hover-tilt active-click smooth-interactive hover:shadow-md border border-white/50">
                    <span className="text-2xl md:text-3xl font-black text-emerald-500">{countCompleted}</span>
                    <span className="text-xs font-bold text-[#002C3E]/40 mt-1">משימות שהושלמו</span>
                  </div>
                  <div className="bg-[#002C3E] rounded-2xl p-4 shadow-md flex flex-col items-center justify-center text-white hover-tilt active-click smooth-interactive hover:shadow-lg">
                    <span className="text-2xl md:text-3xl font-black text-[#78BCC4]">₪{totalRevenue}</span>
                    <span className="text-xs font-bold text-white/50 mt-1">סך הכל הכנסות</span>
                  </div>
                </div>

                {/* --- Advanced Filters Panel --- */}
                <div className="bg-white border border-[#002C3E]/5 rounded-3xl p-5 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="w-full sm:w-auto bg-[#F7444E] hover:bg-[#de3d46] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg shadow-[#F7444E]/25 transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      <FiPlus className="w-5 h-5" strokeWidth={3} />
                      פתיחת קריאה חדשה
                    </button>

                    <div className="w-full sm:max-w-md relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="חפש לפי שם לקוח, טלפון, כתובת, תקלה..."
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
                      <label className="block text-xs font-bold text-[#002C3E]/55 mb-1.5"><span className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-[#002C3E]/55"><FiCalendar /> סינון לפי ימים</span></label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#78BCC4] text-xs font-bold text-[#002C3E] cursor-pointer"
                      >
                        <option value="all">כל הזמן (ללא הגבלה)</option>
                        <option value="today">היום האחרון</option>
                        <option value="yesterday">אתמול</option>
                        <option value="week">7 הימים האחרונים</option>
                        <option value="month">החודש הנוכחי</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#002C3E]/55 mb-1.5"><span className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-[#002C3E]/55"><FiBriefcase /> סינון לפי חנות / עסק</span></label>
                      <select
                        value={shopFilter}
                        onChange={(e) => setShopFilter(e.target.value)}
                        className="w-full bg-[#F4F9FA] border border-[#002C3E]/10 rounded-xl px-3 py-2.5 outline-none focus:border-[#78BCC4] text-xs font-bold text-[#002C3E] cursor-pointer"
                      >
                        <option value="">כל החנויות והעסקים</option>
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
                    { id: 'all', label: 'הכל', icon: <FiClipboard /> },
                    { id: 'pending', label: 'ממתין', icon: <FiAlertCircle />, count: countPending },
                    { id: 'in_progress', label: 'בטיפול', icon: <FiClock />, count: countInProgress },
                    { id: 'completed', label: 'בוצע', icon: <FiCheckCircle />, count: countCompleted }
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
                      <span className="flex items-center gap-1.5">{tab.icon && <span className="text-lg">{tab.icon}</span>} {tab.label}</span>
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
                                        {c.status === 'pending' ? <span className="flex items-center gap-1"><FiAlertCircle /> ממתין</span> :
                                         c.status === 'in_progress' ? <span className="flex items-center gap-1"><FiClock /> בטיפול</span> : <span className="flex items-center gap-1"><FiCheckCircle /> הושלם</span>}
                                      </span>
                                    </h3>
                                    {/* Action for Deleting */}
                                    <button
                                      onClick={() => handleDeleteCall(c.id)}
                                      className="text-[#002C3E]/20 hover:text-[#F7444E] transition-all p-1 hover:bg-[#FEF2F2] rounded-lg"
                                      title="מחק קריאה"
                                    >
                                      <FiTrash2 className="w-5 h-5" strokeWidth={2} />
                                    </button>
                                  </div>
                                  <a
                                    href={`tel:${c.customer_phone}`}
                                    className="text-sm font-semibold text-[#78BCC4] hover:underline flex items-center gap-1.5 mt-1 inline-block"
                                    dir="ltr"
                                  >
                                    <span className="flex items-center gap-1.5"><FiPhone /> {c.customer_phone}</span>
                                  </a>
                                </div>
                              </div>

                              {/* Call Details */}
                              <div className="space-y-3 border-t border-[#002C3E]/5 pt-4 pb-2">
                                <div>
                                  <span className="text-xs font-bold text-[#002C3E]/45 block mb-1"><span className="flex items-center gap-1"><FiMapPin /> כתובת להגעה:</span></span>
                                  <p className="text-sm font-bold text-[#002C3E]/85 leading-relaxed">{c.customer_address}</p>
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-[#002C3E]/45 block mb-1"><span className="flex items-center gap-1"><FiTool /> תיאור התקלה והכלי:</span></span>
                                  <p className="text-sm text-[#002C3E] leading-relaxed bg-[#F4F9FA] p-3.5 rounded-xl border border-[#002C3E]/5 font-semibold">
                                    {c.symptom}
                                  </p>
                                </div>
                              </div>

                              {/* Completed Info Section (If closed) */}
                              {c.status === 'completed' && (
                                <div className="mt-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 space-y-2">
                                  <span className="text-xs font-bold text-emerald-800 block"><span className="flex items-center gap-1"><FiCheckCircle /> תיעוד טיפול סגור:</span></span>
                                  <p className="text-sm font-semibold text-emerald-900"><strong className="text-xs block text-emerald-700">מה תוקן:</strong> {c.tech_notes || 'לא נרשמו הערות.'}</p>
                                  <div className="flex justify-between items-center border-t border-emerald-100/50 pt-2 mt-2">
                                    <span className="text-sm font-black text-emerald-900"><span className="flex items-center gap-1.5"><FiDollarSign /> שולם סך הכל:</span> ₪{c.total_price || '0'}</span>
                                    
                                    {/* WhatsApp Share Invoice */}
                                    <a
                                      href={`https://wa.me/972${c.customer_phone.replace(/^0/, '')}?text=${encodeURIComponent(`היי ${c.customer_name}, להלן סיכום הטיפול שבוצע בכלי שלך:\n\n🛠️ *מה תוקן:* ${c.tech_notes || 'טיפול שוטף ומקצועי'}\n💰 *סך הכל שולם:* ₪${c.total_price || '0'}\n\nתודה רבה שבחרת ב-israelfix! 🚀`)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm shadow-[#25D366]/20"
                                    >
                                      <FaWhatsapp className="w-4 h-4 fill-current" />
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
                                    <span className="flex items-center gap-1.5"><FaWaze className="text-lg" /> סע ב-Waze</span>
                                  </a>
                                  <a
                                    href={`https://wa.me/972${c.customer_phone.replace(/^0/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 bg-[#EEF6F8] hover:bg-[#25D366]/10 hover:text-[#128C7E] text-[#002C3E] text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
                                  >
                                    <span className="flex items-center gap-1.5"><FaWhatsapp /> צור קשר</span>
                                  </a>
                                </div>

                                {/* Right quick-status buttons */}
                                <div className="flex gap-2">
                                  {c.status === 'pending' && (
                                    <button
                                      onClick={() => handleUpdateStatus(c.id, 'in_progress')}
                                      className="bg-[#002C3E] hover:bg-amber-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                                    >
                                      <span className="flex items-center gap-1.5"><FiClock /> התחל לעבוד</span>
                                    </button>
                                  )}

                                  {c.status === 'in_progress' && !isCallClosing && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleUpdateStatus(c.id, 'pending')}
                                        className="bg-slate-200 hover:bg-slate-300 text-[#002C3E] text-xs font-bold px-3 py-2.5 rounded-xl transition-all"
                                      >
                                        <span className="flex items-center gap-1.5"><FiAlertCircle /> החזר לממתין</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setClosingCallId(c.id);
                                          setTechNotes('');
                                          setTotalPrice('');
                                        }}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10"
                                      >
                                        <span className="flex items-center gap-1.5"><FiCheckCircle /> סמן כהושלם</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Inline Closing Call Form */}
                              {isCallClosing && (
                                <form onSubmit={handleCompleteCall} className="mt-4 bg-[#F4F9FA] border border-[#002C3E]/10 rounded-2xl p-5 space-y-4 text-right">
                                  <h4 className="text-sm font-black text-[#002C3E] flex items-center gap-1.5"><FiEdit2 /> סגירת קריאה וסיכום טיפול</h4>
                                  
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
                                <th className="py-4 px-4 font-black"><span className="flex items-center gap-1.5"><FiCalendar /> תאריך פתיחה</span></th>
                                <th className="py-4 px-4 font-black"><span className="flex items-center gap-1.5"><FiBriefcase /> בית העסק / לקוח</span></th>
                                <th className="py-4 px-4 font-black"><span className="flex items-center gap-1.5"><FiPhone /> יצירת קשר</span></th>
                                <th className="py-4 px-4 font-black w-1/4"><span className="flex items-center gap-1.5"><FiMapPin /> כתובת להגעה</span></th>
                                <th className="py-4 px-4 font-black w-1/4"><span className="flex items-center gap-1.5"><FiTool /> תיאור התקלה והכלי</span></th>
                                <th className="py-4 px-4 font-black text-center"><span className="flex items-center justify-center gap-1.5"><FiActivity /> סטטוס</span></th>
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
                                    <tr className={`table-row-hover transition-colors ${c.status === 'completed' ? 'bg-emerald-50/20' : ''}`}>
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
                                          <span className="flex items-center gap-1.5"><FiPhone /> {c.customer_phone}</span>
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
                                          {c.status === 'pending' ? <span className="flex items-center gap-1"><FiAlertCircle /> ממתין</span> :
                                           c.status === 'in_progress' ? <span className="flex items-center gap-1"><FiClock /> בטיפול</span> : <span className="flex items-center gap-1"><FiCheckCircle /> הושלם</span>}
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
                                            <FaWaze className="text-lg" />
                                          </a>
                                          <a
                                            href={`https://wa.me/972${c.customer_phone.replace(/^0/, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-[#EEF6F8] hover:bg-[#25D366]/10 text-[#002C3E] hover:text-[#128C7E] rounded-xl transition-all"
                                            title="צור קשר בוואטסאפ"
                                          >
                                            <FaWhatsapp className="text-lg" />
                                          </a>

                                          {/* Quick status transitions */}
                                          {c.status === 'pending' && (
                                            <button
                                              onClick={() => handleUpdateStatus(c.id, 'in_progress')}
                                              className="bg-[#002C3E] hover:bg-amber-500 hover:text-white text-white text-xs font-bold px-3 py-2 rounded-xl transition-all whitespace-nowrap"
                                            >
                                              <span className="flex items-center gap-1.5"><FiClock /> התחל עבודה</span>
                                            </button>
                                          )}

                                          {c.status === 'in_progress' && !isCallClosing && (
                                            <div className="flex gap-1.5">
                                              <button
                                                onClick={() => handleUpdateStatus(c.id, 'pending')}
                                                className="bg-slate-200 hover:bg-slate-300 text-[#002C3E] text-xs font-bold px-2 py-2 rounded-xl transition-all"
                                                title="החזר לממתין"
                                              >
                                                <FiAlertCircle className="text-lg" />
                                              </button>
                                              <button
                                                onClick={() => {
                                                  setClosingCallId(c.id);
                                                  setTechNotes('');
                                                  setTotalPrice('');
                                                }}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 whitespace-nowrap"
                                              >
                                                <span className="flex items-center gap-1.5"><FiCheckCircle /> סגור קריאה</span>
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
                                              שלח סיכום <FaWhatsapp className="inline text-lg ml-1" />
                                            </a>
                                          )}

                                          {/* Delete Call */}
                                          <button
                                            onClick={() => handleDeleteCall(c.id)}
                                            className="text-[#002C3E]/20 hover:text-[#F7444E] transition-all p-2 hover:bg-[#FEF2F2] rounded-xl"
                                            title="מחק קריאה"
                                          >
                                            <FiTrash2 className="w-4 h-4" strokeWidth={2} />
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
                                              <FiEdit2 className="text-base" />
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
                      אין קריאות שירות העונות לסינון או לחיפוש שבחרת
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

            {/* --- Footer --- */}
            <footer className="border-t border-[#002C3E]/10 mt-8 py-6 text-center text-xs text-[#002C3E]/30 font-medium">
              &copy; {new Date().getFullYear()} israelfix · ניהול קריאות שירות וסדר לטכנאי
            </footer>

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
                <h3 className="text-xl font-extrabold text-[#002C3E] flex items-center gap-2"><FiPlus /> פתיחת קריאת שירות חדשה</h3>
              </div>

              <form onSubmit={handleCreateCall} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#002C3E]/60 flex items-center gap-1.5"><FiUser /> בחירת לקוח קיים מהמאגר (אופציונלי)</label>
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
                            {c.shop_name} (<span className="flex items-center gap-1"><FiUser /> בעל עסק:</span> {c.owner_name})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[#002C3E]/40 mt-1 font-medium">בחירה בלקוח מהמאגר תמלא את שאר השדות באופן אוטומטי.</p>
                    </>
                  ) : (
                    <div className="bg-[#EEF6F8] p-4 rounded-2xl border border-[#78BCC4]/20 space-y-3 mt-1">
                      <div className="text-xs font-bold text-[#002C3E] border-b border-[#002C3E]/10 pb-1.5 flex items-center gap-1">
                        <span className="flex items-center gap-1.5"><FiUser /> הוספת לקוח מהירה למאגר</span>
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
                          <span className="flex items-center justify-center gap-1.5"><FiSave /> שמור לקוח והמשך לקריאה</span>
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
                      <span className="flex items-center gap-1.5"><FiSave /> שמור לקוח זה במאגר הלקוחות (אם מוזן ידנית)</span>
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
                    <span className="flex items-center justify-center gap-1.5"><FiCheckCircle /> שמור ופתח קריאה</span>
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
                <h3 className="text-xl font-extrabold text-[#002C3E] flex items-center gap-2"><FiUser /> הוספת לקוח חדש למאגר</h3>
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
                    <span className="flex items-center justify-center gap-1.5"><FiSave /> שמור לקוח</span>
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
                    <span className="flex items-center justify-center gap-1.5"><FiSave /> עדכן לקוח</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: Add New Warranty Dialog --- */}
        {showAddWarrantyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#002C3E]/10 p-6 md:p-8 max-w-lg w-full text-right shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]" dir="rtl">
              <div className="flex justify-between items-center border-b border-[#002C3E]/5 pb-3">
                <button
                  onClick={() => setShowAddWarrantyModal(false)}
                  className="text-[#002C3E]/40 hover:text-[#002C3E] text-lg font-bold"
                >✕</button>
                <h3 className="text-xl font-extrabold text-[#002C3E] flex items-center gap-2"><FiShield /> יצירת תעודת אחריות חדשה</h3>
              </div>

              <form onSubmit={handleAddWarranty} className="space-y-4">
                {/* בחירת לקוח מהמאגר או הוספה מהירה */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#002C3E]/60 flex items-center gap-1.5"><FiUser /> בחירת לקוח מהמאגר (אופציונלי)</label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowWarrantyInlineAddCust(!showWarrantyInlineAddCust);
                        if (!showWarrantyInlineAddCust) {
                          setWarrantyCustId('');
                          setWarrantyCustomerName('');
                          setWarrantyCustomerPhone('');
                        }
                      }}
                      className="text-xs font-bold text-[#78BCC4] hover:text-[#2a8fa0] transition-colors"
                    >
                      {showWarrantyInlineAddCust ? '✕ ביטול הוספה מהירה' : '➕ הוסף לקוח חדש למאגר'}
                    </button>
                  </div>

                  {!showWarrantyInlineAddCust ? (
                    <div className="space-y-4">
                      <select
                        value={warrantyCustId}
                        onChange={(e) => handleSelectCustomerChangeWarranty(e.target.value)}
                        className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-bold"
                      >
                        <option value="">-- הזן פרטים ידנית או בחר מהמאגר --</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.shop_name} ({c.owner_name})
                          </option>
                        ))}
                      </select>

                      {/* שם לקוח (שדה פתוח - טקסט חופשי) */}
                      <div>
                        <label className="block text-xs font-bold text-[#002C3E]/60 mb-1.5">שם לקוח *</label>
                        <input
                          type="text"
                          required
                          value={warrantyCustomerName}
                          onChange={(e) => {
                            setWarrantyCustomerName(e.target.value);
                            if (warrantyCustId) setWarrantyCustId('');
                          }}
                          placeholder="הקלד שם לקוח מלא..."
                          className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/10 outline-none focus:border-[#78BCC4] transition-all text-sm font-medium text-[#002C3E]"
                        />
                      </div>

                      {/* טלפון לקוח */}
                      <div>
                        <label className="block text-xs font-bold text-[#002C3E]/60 mb-1.5">מספר טלפון (עבור שיתוף קישור ב-WhatsApp)</label>
                        <input
                          type="tel"
                          value={warrantyCustomerPhone}
                          onChange={(e) => {
                            setWarrantyCustomerPhone(e.target.value);
                            if (warrantyCustId) setWarrantyCustId('');
                          }}
                          placeholder="לדוגמה: 0545050609"
                          className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/10 outline-none focus:border-[#78BCC4] transition-all text-sm font-medium text-[#002C3E] ltr:text-right"
                        />
                      </div>

                      {/* הוספת לקוח פרטי מהירה למאגר */}
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                        <p className="text-[11px] font-semibold text-[#002C3E]/50">
                          {warrantyCustId
                            ? '✓ הלקוח מקושר למאגר הלקוחות'
                            : 'לקוח פרטי? שמור אותו במאגר כדי לשייך אליו תעודות בעתיד'}
                        </p>
                        <button
                          type="button"
                          onClick={handleQuickAddPrivateCustomerWarranty}
                          disabled={!warrantyCustomerName.trim() || !warrantyCustomerPhone.trim() || !!warrantyCustId}
                          className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/30 disabled:cursor-not-allowed text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <FiPlus className="text-sm" /> {warrantyCustId ? 'לקוח מקושר ✓' : 'הוסף לקוח'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#EEF6F8] p-4 rounded-2xl border border-[#78BCC4]/20 space-y-3 mt-1">
                      <div className="text-xs font-bold text-[#002C3E] border-b border-[#002C3E]/10 pb-1.5 flex items-center gap-1">
                        <span className="flex items-center gap-1.5"><FiUser /> הוספת לקוח מהירה למאגר</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-[#002C3E]/60 mb-0.5">שם חנות / בית עסק</label>
                          <input
                            type="text"
                            value={warrInlineShopName}
                            onChange={(e) => setWarrInlineShopName(e.target.value)}
                            placeholder="לדוגמא: אופני דניאל"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#002C3E]/60 mb-0.5">שם בעל העסק</label>
                          <input
                            type="text"
                            value={warrInlineOwnerName}
                            onChange={(e) => setWarrInlineOwnerName(e.target.value)}
                            placeholder="דניאל כהן"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#002C3E]/60 mb-0.5">מספר טלפון</label>
                          <input
                            type="text"
                            value={warrInlinePhone}
                            onChange={(e) => setWarrInlinePhone(e.target.value)}
                            placeholder="0521234567"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#002C3E]/60 mb-0.5">כתובת</label>
                          <input
                            type="text"
                            value={warrInlineAddress}
                            onChange={(e) => setWarrInlineAddress(e.target.value)}
                            placeholder="הרצל 40, ראשון לציון"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] text-xs text-[#002C3E]"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t border-[#002C3E]/10">
                        <button
                          type="button"
                          onClick={handleCreateCustomerInlineWarranty}
                          className="bg-[#002C3E] hover:bg-[#F7444E] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
                        >
                          שמור לקוח
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* תיאור התיקון / מוצר */}
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1.5">תיאור התיקון / פריטים המכוסים באחריות *</label>
                  <input
                    type="text"
                    required
                    value={warrantyVehicleDesc}
                    onChange={(e) => setWarrantyVehicleDesc(e.target.value)}
                    placeholder="לדוגמה: החלפת סוללת סמסונג 48V ואיטום רטיבות"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/10 outline-none focus:border-[#78BCC4] transition-all text-sm font-medium text-[#002C3E]"
                  />
                </div>

                {/* משך אחריות */}
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1.5">תקופת אחריות *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[3, 6, 12].map((months) => (
                      <label
                        key={months}
                        className={`flex items-center justify-center py-3 rounded-xl border font-bold text-sm cursor-pointer transition-all ${
                          parseInt(warrantyDuration, 10) === months
                            ? 'bg-[#002C3E] border-[#002C3E] text-white'
                            : 'bg-[#F4F9FA] border-[#002C3E]/10 text-[#002C3E]/70 hover:bg-[#002C3E]/5'
                        }`}
                      >
                        <input
                          type="radio"
                          name="warrantyDuration"
                          value={months}
                          checked={parseInt(warrantyDuration, 10) === months}
                          onChange={(e) => setWarrantyDuration(parseInt(e.target.value, 10))}
                          className="sr-only"
                        />
                        <span>{months} חודשים</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* תאריך התחלה */}
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1.5">תאריך תחילת אחריות</label>
                  <input
                    type="date"
                    required
                    value={warrantyStartDate}
                    onChange={(e) => setWarrantyStartDate(e.target.value)}
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/10 outline-none focus:border-[#78BCC4] transition-all text-sm font-medium text-[#002C3E]"
                  />
                </div>

                {/* הערות */}
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1.5">הערות ותנאים נוספים (אופציונלי)</label>
                  <textarea
                    rows={2}
                    value={warrantyNotes}
                    onChange={(e) => setWarrantyNotes(e.target.value)}
                    placeholder="מגבלות אחריות, תנאים וכד׳..."
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/10 outline-none focus:border-[#78BCC4] transition-all text-sm font-medium text-[#002C3E] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddWarrantyModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#002C3E] py-3.5 rounded-xl font-bold text-sm transition-all"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#F7444E] hover:bg-[#de3d46] text-white py-3.5 rounded-xl font-black text-sm transition-all shadow-md shadow-[#F7444E]/20"
                  >
                    <span className="flex items-center justify-center gap-1.5"><FiSave /> הנפק תעודה</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: Add New Repair Dialog --- */}
        {showAddRepairModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#002C3E]/10 p-6 md:p-8 max-w-lg w-full text-right shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center border-b border-[#002C3E]/5 pb-3">
                <button
                  onClick={() => setShowAddRepairModal(false)}
                  className="text-[#002C3E]/40 hover:text-[#002C3E] text-lg font-bold"
                >✕</button>
                <h3 className="text-xl font-extrabold text-[#002C3E] flex items-center gap-2"><FiTool /> הוספת תיקון חדש במעבדה</h3>
              </div>

              <form onSubmit={handleCreateRepair} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#002C3E]/60 flex items-center gap-1.5"><FiUser /> בחירת לקוח מהמאגר (אופציונלי)</label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRepairInlineAddCust(!showRepairInlineAddCust);
                        if (!showRepairInlineAddCust) {
                          setRepairCustId('');
                          setRepairCustName('');
                          setRepairCustPhone('');
                          setRepairCustAddress('');
                        }
                      }}
                      className="text-xs font-bold text-[#78BCC4] hover:text-[#2a8fa0] transition-colors"
                    >
                      {showRepairInlineAddCust ? '✕ ביטול הוספה מהירה' : '➕ הוסף לקוח חדש למאגר'}
                    </button>
                  </div>

                  {!showRepairInlineAddCust ? (
                    <>
                      <select
                        value={repairCustId}
                        onChange={(e) => handleSelectCustomerChangeRepair(e.target.value)}
                        className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-bold"
                      >
                        <option value="">-- הזן פרטים ידנית או בחר מהמאגר --</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.shop_name} ({c.owner_name})
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <div className="bg-[#EEF6F8] p-4 rounded-2xl border border-[#78BCC4]/20 space-y-3 mt-1">
                      <div className="text-xs font-bold text-[#002C3E] border-b border-[#002C3E]/10 pb-1.5 flex items-center gap-1">
                        <span className="flex items-center gap-1.5"><FiUser /> הוספת לקוח מהירה למאגר</span>
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
                            setShowRepairInlineAddCust(false);
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
                          onClick={handleCreateCustomerInlineRepair}
                          className="bg-[#002C3E] hover:bg-[#F7444E] text-white font-black text-[11px] px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
                        >
                          <span className="flex items-center justify-center gap-1.5"><FiSave /> שמור לקוח והמשך לתיקון</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם הלקוח / בית העסק</label>
                    <input
                      type="text"
                      required
                      value={repairCustName}
                      onChange={(e) => {
                        setRepairCustName(e.target.value);
                        if (repairCustId) setRepairCustId('');
                      }}
                      placeholder="הזן שם מלא"
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">מספר טלפון</label>
                    <input
                      type="tel"
                      required
                      value={repairCustPhone}
                      onChange={(e) => {
                        setRepairCustPhone(e.target.value);
                        if (repairCustId) setRepairCustId('');
                      }}
                      placeholder="לדוגמא: 0521234567"
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-[11px] font-semibold text-[#002C3E]/50">
                    {repairCustId
                      ? '✓ הלקוח מקושר למאגר הלקוחות'
                      : 'לקוח פרטי? שמרו אותו למאגר כדי לשייך אליו תיקונים נוספים בעתיד'}
                  </p>
                  <button
                    type="button"
                    onClick={handleQuickAddPrivateCustomer}
                    disabled={!repairCustName.trim() || !repairCustPhone.trim() || !!repairCustId}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/30 disabled:cursor-not-allowed text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <FiPlus className="text-sm" /> {repairCustId ? 'לקוח מקושר ✓' : 'הוסף לקוח'}
                  </button>
                </div>

                {/* סוג הכלי - כפתורי בחירה מהירה */}
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-2">סוג הכלי</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setRepairVehicleType('bicycle');
                        setRepairVehicleModel(BICYCLE_MODELS[0]);
                      }}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all text-center flex items-center justify-center gap-2 ${
                        repairVehicleType === 'bicycle'
                          ? 'bg-[#002C3E] text-white shadow-md border-transparent'
                          : 'bg-[#F4F9FA] text-[#002C3E]/70 border-[#002C3E]/10 hover:bg-[#E8F2F3]'
                      }`}
                    >
                      🚲 אופניים חשמליים
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRepairVehicleType('scooter');
                        setRepairVehicleModel(SCOOTER_MODELS[0]);
                      }}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all text-center flex items-center justify-center gap-2 ${
                        repairVehicleType === 'scooter'
                          ? 'bg-[#002C3E] text-white shadow-md border-transparent'
                          : 'bg-[#F4F9FA] text-[#002C3E]/70 border-[#002C3E]/10 hover:bg-[#E8F2F3]'
                      }`}
                    >
                      🛴 קורקינט חשמלי
                    </button>
                  </div>
                </div>

                {/* דגם הכלי - דרופדאון דינמי */}
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">דגם הכלי</label>
                  <div className="flex gap-2">
                    <select
                      value={repairVehicleModel}
                      onChange={(e) => setRepairVehicleModel(e.target.value)}
                      className="flex-1 bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-bold"
                    >
                      {(repairVehicleType === 'bicycle' ? bicycleModels : scooterModels).map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                      <option value="custom">-- דגם מותאם אישית (הקלד ידנית) --</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddNewModel}
                      className="bg-[#002C3E] hover:bg-[#F7444E] text-white font-bold text-xs px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap animate-fade-in"
                    >
                      <FiPlus className="text-sm" /> הוסף דגם
                    </button>
                  </div>
                </div>

                {repairVehicleModel === 'custom' && (
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם דגם מותאם אישית</label>
                    <input
                      type="text"
                      required
                      value={repairCustomModel}
                      onChange={(e) => setRepairCustomModel(e.target.value)}
                      placeholder="הקלד את דגם הכלי"
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">מה בוצע בכלי (תיאור העבודה)</label>
                  <textarea
                    rows={3}
                    required
                    value={repairWhatWasDone}
                    onChange={(e) => setRepairWhatWasDone(e.target.value)}
                    placeholder="לדוגמא: הוחלפו רפידות בלם, כיוון ידיות הידראוליות וטעינת סוללה"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">הערות נוספות</label>
                  <input
                    type="text"
                    value={repairNotes}
                    onChange={(e) => setRepairNotes(e.target.value)}
                    placeholder="הערות לגבי הלקוח, הכלי או התשלום"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">עלות התיקון (₪)</label>
                    <input
                      type="number"
                      value={repairPrice}
                      onChange={(e) => setRepairPrice(e.target.value)}
                      placeholder="₪ סכום"
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">סטטוס תיקון במעבדה</label>
                    <select
                      value={repairStatus}
                      onChange={(e) => setRepairStatus(e.target.value)}
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-bold"
                    >
                      <option value="completed">הושלם (מוכן לאיסוף)</option>
                      <option value="in_progress">בטיפול במעבדה</option>
                      <option value="pending">בממתין לטיפול</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRepairModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#002C3E] py-3.5 rounded-xl font-bold text-sm transition-all"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#F7444E] hover:bg-[#de3d46] text-white py-3.5 rounded-xl font-black text-sm transition-all shadow-md shadow-[#F7444E]/20"
                  >
                    <span className="flex items-center justify-center gap-1.5"><FiSave /> שמור תיקון מעבדה</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- MODAL: Edit Repair Dialog --- */}
        {editingRepair !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-[#002C3E]/10 p-6 md:p-8 max-w-lg w-full text-right shadow-2xl space-y-5 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center border-b border-[#002C3E]/5 pb-3">
                <button
                  onClick={() => setEditingRepair(null)}
                  className="text-[#002C3E]/40 hover:text-[#002C3E] text-lg font-bold"
                >✕</button>
                <h3 className="text-xl font-extrabold text-[#002C3E]">✏️ עריכת פרטי תיקון מעבדה</h3>
              </div>

              <form onSubmit={handleUpdateRepair} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם הלקוח / בית העסק</label>
                    <input
                      type="text"
                      required
                      value={editingRepair.customer_name}
                      onChange={(e) => setEditingRepair({ ...editingRepair, customer_name: e.target.value })}
                      placeholder="הזן שם מלא"
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">מספר טלפון</label>
                    <input
                      type="tel"
                      required
                      value={editingRepair.customer_phone}
                      onChange={(e) => setEditingRepair({ ...editingRepair, customer_phone: e.target.value })}
                      placeholder="מספר טלפון"
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* סוג הכלי - עריכה */}
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-2">סוג הכלי</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const defaultModel = BICYCLE_MODELS.includes(editingRepair.vehicle_model) ? editingRepair.vehicle_model : BICYCLE_MODELS[0];
                        setEditingRepair({ ...editingRepair, vehicle_type: 'bicycle', vehicle_model: defaultModel });
                      }}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all text-center flex items-center justify-center gap-2 ${
                        editingRepair.vehicle_type === 'bicycle'
                          ? 'bg-[#002C3E] text-white shadow-md border-transparent'
                          : 'bg-[#F4F9FA] text-[#002C3E]/70 border-[#002C3E]/10 hover:bg-[#E8F2F3]'
                      }`}
                    >
                      🚲 אופניים חשמליים
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultModel = SCOOTER_MODELS.includes(editingRepair.vehicle_model) ? editingRepair.vehicle_model : SCOOTER_MODELS[0];
                        setEditingRepair({ ...editingRepair, vehicle_type: 'scooter', vehicle_model: defaultModel });
                      }}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all text-center flex items-center justify-center gap-2 ${
                        editingRepair.vehicle_type === 'scooter'
                          ? 'bg-[#002C3E] text-white shadow-md border-transparent'
                          : 'bg-[#F4F9FA] text-[#002C3E]/70 border-[#002C3E]/10 hover:bg-[#E8F2F3]'
                      }`}
                    >
                      🛴 קורקינט חשמלי
                    </button>
                  </div>
                </div>

                {/* דגם הכלי - עריכה */}
                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">דגם הכלי</label>
                  <div className="flex gap-2">
                    <select
                      value={
                        (editingRepair.vehicle_type === 'bicycle' ? bicycleModels : scooterModels).includes(editingRepair.vehicle_model)
                          ? editingRepair.vehicle_model
                          : 'custom'
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom') {
                          setEditingRepair({ ...editingRepair, vehicle_model: '' });
                        } else {
                          setEditingRepair({ ...editingRepair, vehicle_model: val });
                        }
                      }}
                      className="flex-1 bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-bold"
                    >
                      {(editingRepair.vehicle_type === 'bicycle' ? bicycleModels : scooterModels).map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                      <option value="custom">-- דגם אחר / מותאם אישית --</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddNewModelEdit}
                      className="bg-[#002C3E] hover:bg-[#F7444E] text-white font-bold text-xs px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap animate-fade-in"
                    >
                      <FiPlus className="text-sm" /> הוסף דגם
                    </button>
                  </div>
                </div>

                {!(editingRepair.vehicle_type === 'bicycle' ? bicycleModels : scooterModels).includes(editingRepair.vehicle_model) && (
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">שם דגם מותאם אישית</label>
                    <input
                      type="text"
                      required
                      value={editingRepair.vehicle_model}
                      onChange={(e) => setEditingRepair({ ...editingRepair, vehicle_model: e.target.value })}
                      placeholder="הקלד את דגם הכלי"
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">מה בוצע בכלי (תיאור העבודה)</label>
                  <textarea
                    rows={3}
                    required
                    value={editingRepair.what_was_done}
                    onChange={(e) => setEditingRepair({ ...editingRepair, what_was_done: e.target.value })}
                    placeholder="תיאור העבודה שבוצעה בפועל"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">הערות נוספות</label>
                  <input
                    type="text"
                    value={editingRepair.notes || ''}
                    onChange={(e) => setEditingRepair({ ...editingRepair, notes: e.target.value })}
                    placeholder="הערות לגבי הלקוח, הכלי או התשלום"
                    className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">עלות התיקון (₪)</label>
                    <input
                      type="number"
                      value={editingRepair.price || ''}
                      onChange={(e) => setEditingRepair({ ...editingRepair, price: e.target.value })}
                      placeholder="₪ סכום"
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#002C3E]/60 mb-1">סטטוס תיקון במעבדה</label>
                    <select
                      value={editingRepair.status}
                      onChange={(e) => setEditingRepair({ ...editingRepair, status: e.target.value })}
                      className="w-full bg-[#F4F9FA] px-4 py-3 rounded-xl border border-[#002C3E]/15 outline-none focus:border-[#78BCC4] focus:bg-white text-sm text-[#002C3E] font-bold"
                    >
                      <option value="completed">הושלם (מוכן לאיסוף)</option>
                      <option value="in_progress">בטיפול במעבדה</option>
                      <option value="pending">בממתין לטיפול</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingRepair(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-[#002C3E] py-3.5 rounded-xl font-bold text-sm transition-all"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#002C3E] hover:bg-[#F7444E] text-white py-3.5 rounded-xl font-black text-sm transition-all shadow-md shadow-[#002C3E]/20"
                  >
                    <span className="flex items-center justify-center gap-1.5"><FiSave /> עדכן תיקון</span>
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
                <span className="flex items-center gap-1.5"><FiInfo className="text-amber-500" /> לחץ בתוך התיבה השחורה כדי להעתיק את הקוד אוטומטית. לאחר שתריץ אותו ב-Supabase, העמוד יסתנכרן אוטומטית בזמן אמת!</span>
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

      </div>
    </>
  );
}

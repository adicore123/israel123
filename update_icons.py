import re

def update_file():
    with open('c:/Users/PC/OneDrive/Desktop/israel/src/pages/ServiceDashboardPage.jsx', 'r', encoding='utf-8') as f:
        content = f.read()

    if "import { Fi" not in content:
        content = content.replace(
            "import { supabase } from '../lib/supabase.js';",
            "import { supabase } from '../lib/supabase.js';\nimport { FiClipboard, FiUsers, FiSettings, FiWifi, FiHome, FiLogOut, FiLock, FiDatabase, FiInfo, FiSearch, FiPhone, FiMapPin, FiTool, FiCheckCircle, FiPlus, FiEdit2, FiTrash2, FiActivity } from 'react-icons/fi';"
        )

    replacements = {
        '<span>📋</span>': '<FiClipboard className="text-xl" />',
        '<span>👥</span>': '<FiUsers className="text-xl" />',
        '<span>⚙️</span>': '<FiSettings className="text-xl" />',
        '<span className="text-lg">📋</span>': '<FiClipboard className="text-lg" />',
        '<span className="text-lg">👥</span>': '<FiUsers className="text-lg" />',
        '<span className="text-lg">⚙️</span>': '<FiSettings className="text-lg" />',
        '<span className="text-xl">📡</span>': '<FiWifi className="text-xl" />',
        '<span className="text-xl">🔒</span>': '<FiLock className="text-xl" />',
        '<span className="text-xl">🗄️</span>': '<FiDatabase className="text-xl" />',
        '<span className="text-xl">ℹ️</span>': '<FiInfo className="text-xl" />',
        '<span>🏠 חזרה לאתר</span>': '<FiHome className="text-lg" /><span>חזרה לאתר</span>',
        'התנתק ✕': '<span className="flex items-center justify-center gap-2">התנתק <FiLogOut /></span>',
        '🔍 חפש לפי': 'חפש לפי',
        '<span>{tab.icon || \'\'} {tab.label}</span>': '<span className="flex items-center gap-1.5">{tab.icon && <span className="text-lg">{tab.icon}</span>} {tab.label}</span>',
        '➕ הוספת לקוח חדש במאגר': '<span className="flex items-center justify-center gap-2"><FiPlus className="text-xl"/> הוספת לקוח חדש במאגר</span>',
        '📞 פתח קריאת שירות ללקוח זה': '<span className="flex items-center justify-center gap-2"><FiPlus /> פתח קריאת שירות ללקוח זה</span>',
        '✏️ ערוך': '<span className="flex items-center justify-center gap-1"><FiEdit2 /> ערוך</span>',
        '✕ מחק': '<span className="flex items-center justify-center gap-1"><FiTrash2 /> מחק</span>',
        '📍 כתובת:': '<span className="flex items-center gap-1"><FiMapPin /> כתובת:</span>',
        '📞 טלפון:': '<span className="flex items-center gap-1"><FiPhone /> טלפון:</span>',
        '📍 כתובת להגעה:': '<span className="flex items-center gap-1"><FiMapPin /> כתובת להגעה:</span>',
        '🔧 תיאור התקלה והכלי:': '<span className="flex items-center gap-1"><FiTool /> תיאור התקלה והכלי:</span>',
        '✅ תיעוד טיפול סגור:': '<span className="flex items-center gap-1"><FiCheckCircle /> תיעוד טיפול סגור:</span>',
        '🔴 קריאות בממתין': 'קריאות בממתין',
        '🟡 קריאות בטיפול': 'קריאות בטיפול',
        '🟢 משימות שהושלמו': 'משימות שהושלמו',
        '💰 סך הכל הכנסות': 'סך הכל הכנסות',
    }

    for old, new_val in replacements.items():
        content = content.replace(old, new_val)

    with open('c:/Users/PC/OneDrive/Desktop/israel/src/pages/ServiceDashboardPage.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

update_file()

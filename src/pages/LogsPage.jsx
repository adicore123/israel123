import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

function StatCard({ label, value, color, sub }) {
  return (
    <div className={`rounded-2xl p-6 flex flex-col gap-2 shadow-md ${color}`}>
      <div className="text-5xl font-black tabular-nums">{value ?? '...'}</div>
      <div className="text-sm font-bold opacity-75">{label}</div>
      {sub && <div className="text-xs opacity-50 font-medium">{sub}</div>}
    </div>
  );
}

function pct(clicks, views) {
  if (!views) return '0%';
  return ((clicks / views) * 100).toFixed(1) + '%';
}

export default function LogsPage() {
  const [stats, setStats] = useState(null);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function load() {
    const { data } = await supabase
      .from('page_events')
      .select('event_type, created_at')
      .order('created_at', { ascending: false });

    if (!data) return;

    const counts = { page_view: 0, whatsapp_click: 0, phone_click: 0 };
    const dailyMap = {};

    data.forEach(row => {
      if (row.event_type in counts) counts[row.event_type]++;
      const day = row.created_at.slice(0, 10);
      if (!dailyMap[day]) dailyMap[day] = { page_view: 0, whatsapp_click: 0, phone_click: 0 };
      if (row.event_type in dailyMap[day]) dailyMap[day][row.event_type]++;
    });

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, ...(dailyMap[key] || { page_view: 0, whatsapp_click: 0, phone_click: 0 }) });
    }

    setStats(counts);
    setDaily(days);
    setLastUpdated(new Date().toLocaleTimeString('he-IL'));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-[#F7F8F3] p-6 md:p-10" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#002C3E] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#78BCC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#002C3E]">israelfix — ניתוח תנועה</h1>
              <p className="text-xs text-[#002C3E]/40 font-medium">{lastUpdated ? `עודכן ב-${lastUpdated}` : 'טוען...'}</p>
            </div>
          </div>
          <button
            onClick={load}
            className="bg-white border border-[#002C3E]/10 text-[#002C3E] px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-[#002C3E] hover:text-white transition-colors"
          >
            רענן
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24 text-[#002C3E]/30 text-lg font-bold">טוען נתונים...</div>
        ) : (
          <>
            {/* Main KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard
                label="כניסות לדף"
                value={stats.page_view.toLocaleString('he-IL')}
                color="bg-[#002C3E] text-white"
              />
              <StatCard
                label="לחיצות וואטסאפ"
                value={stats.whatsapp_click.toLocaleString('he-IL')}
                color="bg-[#06d6a0] text-white"
                sub={`המרה: ${pct(stats.whatsapp_click, stats.page_view)}`}
              />
              <StatCard
                label="לחיצות טלפון"
                value={stats.phone_click.toLocaleString('he-IL')}
                color="bg-[#F7444E] text-white"
                sub={`המרה: ${pct(stats.phone_click, stats.page_view)}`}
              />
            </div>

            {/* Conversion summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#002C3E]/5">
                <div className="text-xs font-bold text-[#002C3E]/40 mb-1 uppercase tracking-wide">סה&quot;כ פניות (WA + טל&apos;)</div>
                <div className="text-4xl font-black text-[#002C3E]">
                  {(stats.whatsapp_click + stats.phone_click).toLocaleString('he-IL')}
                </div>
                <div className="text-sm text-[#002C3E]/40 mt-1 font-medium">
                  המרה כוללת: {pct(stats.whatsapp_click + stats.phone_click, stats.page_view)}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#002C3E]/5">
                <div className="text-xs font-bold text-[#002C3E]/40 mb-2 uppercase tracking-wide">פיצול ערוץ פנייה</div>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#06d6a0]">וואטסאפ</span>
                      <span>{stats.whatsapp_click}</span>
                    </div>
                    <div className="h-2 bg-[#F7F8F3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#06d6a0] rounded-full transition-all"
                        style={{ width: stats.whatsapp_click + stats.phone_click > 0 ? `${(stats.whatsapp_click / (stats.whatsapp_click + stats.phone_click)) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 items-center mt-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#F7444E]">טלפון</span>
                      <span>{stats.phone_click}</span>
                    </div>
                    <div className="h-2 bg-[#F7F8F3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F7444E] rounded-full transition-all"
                        style={{ width: stats.whatsapp_click + stats.phone_click > 0 ? `${(stats.phone_click / (stats.whatsapp_click + stats.phone_click)) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-day table */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#002C3E]/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#002C3E]/5">
                <h2 className="font-black text-[#002C3E] text-lg">7 ימים אחרונים</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F8F3]">
                    <tr>
                      <th className="text-right px-6 py-3 font-bold text-[#002C3E]/50">תאריך</th>
                      <th className="text-center px-4 py-3 font-bold text-[#002C3E]/50">כניסות</th>
                      <th className="text-center px-4 py-3 font-bold text-[#06d6a0]">וואטסאפ</th>
                      <th className="text-center px-4 py-3 font-bold text-[#F7444E]">טלפון</th>
                      <th className="text-center px-4 py-3 font-bold text-[#002C3E]/50">המרה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daily.map((row, i) => (
                      <tr key={row.date} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F7F8F3]/40'}>
                        <td className="px-6 py-3 font-semibold text-[#002C3E]">{row.date}</td>
                        <td className="px-4 py-3 font-bold text-center text-[#002C3E]">{row.page_view}</td>
                        <td className="px-4 py-3 font-bold text-center text-[#06d6a0]">{row.whatsapp_click}</td>
                        <td className="px-4 py-3 font-bold text-center text-[#F7444E]">{row.phone_click}</td>
                        <td className="px-4 py-3 text-center text-[#002C3E]/50 font-medium">
                          {pct(row.whatsapp_click + row.phone_click, row.page_view)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { trackEvent } from '../lib/analytics.js';

const VEHICLES = ['אופניים חשמליים', 'קורקינט', 'טרקטורון', 'קלנועית'];
const AREAS = ['מרכז', 'צפון', 'דרום', 'ירושלים'];

const ContactForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    area: '',
    vehicle: '',
    problem: '',
  });

  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'נא להזין שם מלא';
    if (!form.area) errs.area = 'נא לבחור אזור מגורים';
    if (!form.vehicle) errs.vehicle = 'נא לבחור סוג כלי';
    if (!form.problem.trim()) errs.problem = 'נא לתאר את הבעיה';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Track WhatsApp form submission
    trackEvent('whatsapp_click');

    const text =
      `היי ישראל, אני מעוניין בשירות תיקונים.\n\n` +
      `*שם מלא:* ${form.fullName.trim()}\n` +
      `*אזור מגורים:* ${form.area}\n` +
      `*סוג כלי:* ${form.vehicle}\n` +
      `*תיאור הבעיה:* ${form.problem.trim()}`;

    const url = `https://wa.me/972545050609?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="py-4 text-center">
        <div className="w-14 h-14 bg-[#06d6a0] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-md">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">ההודעה נשלחה ✅</h3>
        <p className="text-white/60 text-sm">וואטסאפ נפתח עם הפרטים שמילאת. לחץ על שלח בוואטסאפ.</p>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full bg-white/5 focus:bg-white/10 px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 text-sm md:text-base font-medium text-right text-white placeholder:text-white/30 ${
      errors[field]
        ? 'border-[#F7444E] ring-2 ring-[#F7444E]/30'
        : 'border-white/10 focus:border-[#78BCC4] focus:ring-2 focus:ring-[#78BCC4]/20'
    }`;

  const selectClass = (field) =>
    `${inputClass(field)} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378BCC4' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")] bg-[length:14px] bg-[left_14px_center] bg-no-repeat`;

  const labelClass = 'block text-sm font-bold text-[#78BCC4] mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="text-right space-y-4">
      <div>
        <label className={labelClass}>שם מלא *</label>
        <input
          required
          type="text"
          placeholder=""
          value={form.fullName}
          onChange={set('fullName')}
          className={inputClass('fullName')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>אזור מגורים *</label>
          <select
            required
            value={form.area}
            onChange={set('area')}
            className={selectClass('area')}
          >
            <option value="" disabled>בחר אזור</option>
            {AREAS.map((a) => <option key={a} value={a} className="bg-[#002C3E] text-white">{a}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>סוג הכלי *</label>
          <select
            required
            value={form.vehicle}
            onChange={set('vehicle')}
            className={selectClass('vehicle')}
          >
            <option value="" disabled>בחר כלי</option>
            {VEHICLES.map((v) => <option key={v} value={v} className="bg-[#002C3E] text-white">{v}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>תיאור הבעיה *</label>
        <textarea
          required
          rows={4}
          placeholder="תאר/י בקצרה מה התקלה..."
          value={form.problem}
          onChange={set('problem')}
          className={inputClass('problem') + ' resize-none'}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#F7444E] hover:bg-[#de3d46] text-white px-6 py-4 rounded-xl font-bold text-base shadow-md flex items-center justify-center gap-2 smooth-interactive active-click hover-tilt"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        שלח לוואטסאפ
      </button>
    </form>
  );
};

export default ContactForm;

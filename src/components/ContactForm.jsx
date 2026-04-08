import { useState } from 'react';
import { Icons } from './Icons.jsx';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setIsSent(true);
  };

  if (isSent) {
    return (
      <div className="py-4">
        <div className="w-12 h-12 bg-[#F7444E] rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-md">
          <Icons.Check className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#002C3E] mb-1">פנייתך התקבלה!</h3>
        <p className="text-[#002C3E]/80 text-sm">אנו ניצור קשר בהקדם האפשרי.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
      <input
        required
        type="text"
        placeholder="שם מלא"
        aria-label="שם מלא"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="flex-1 bg-white px-4 py-3.5 md:py-4 rounded-xl border border-[#002C3E]/10 outline-none focus:border-[#78BCC4] font-medium text-[#002C3E] transition-all text-sm md:text-base"
      />
      <input
        required
        type="tel"
        placeholder="מספר טלפון"
        aria-label="מספר טלפון"
        dir="ltr"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="flex-1 bg-white px-4 py-3.5 md:py-4 rounded-xl border border-[#002C3E]/10 outline-none focus:border-[#78BCC4] font-medium text-[#002C3E] text-right transition-all text-sm md:text-base"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#F7444E] hover:bg-[#de3d46] text-white px-6 py-3.5 md:py-4 rounded-xl font-bold text-sm md:text-base disabled:opacity-50 flex items-center justify-center shrink-0 transition-colors shadow-md coral-glow"
      >
        {isSubmitting ? 'שולח...' : 'שליחה'}
      </button>
    </form>
  );
};

export default ContactForm;

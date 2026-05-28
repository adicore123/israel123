import { supabase } from './supabase.js';

export async function trackEvent(type, source = 'floating_button') {
  const event = {
    type,
    source,
    user_agent: navigator.userAgent,
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase.from('click_logs').insert([event]);
    if (!error) return;
  } catch (_) {
    // fall through to localStorage
  }

  const existing = JSON.parse(localStorage.getItem('israelfix_click_logs') || '[]');
  existing.unshift({ ...event, id: Date.now() });
  localStorage.setItem('israelfix_click_logs', JSON.stringify(existing.slice(0, 1000)));
}

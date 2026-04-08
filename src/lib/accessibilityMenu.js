/**
 * לוגיקת תפריט נגישות — מודול ES מקומי (ללא CDN).
 * מחלקות ויזואליות על #site-content בלבד; גודל גופן על documentElement (rem/em).
 */

export const A11Y_CONTENT_ID = 'site-content';

export const a11yClasses = {
  grayscale: 'a11y-grayscale',
  highContrast: 'a11y-high-contrast',
  readableFont: 'a11y-readable-font',
  linksHighlight: 'a11y-links-highlight',
};

export const FONT_SCALE_PERCENTS = [100, 112.5, 125, 137.5, 150];

export function getContentRoot() {
  return document.getElementById(A11Y_CONTENT_ID);
}

export function setClassOnContent(className, enabled) {
  const el = getContentRoot();
  if (!el) return;
  el.classList.toggle(className, Boolean(enabled));
}

export function isClassActive(className) {
  const el = getContentRoot();
  return Boolean(el?.classList.contains(className));
}

export function setRootFontPercent(percent) {
  if (!Number.isFinite(percent) || percent <= 100) {
    document.documentElement.style.fontSize = '';
    return;
  }
  document.documentElement.style.fontSize = `${percent}%`;
}

export function resetAllAccessibility() {
  const el = getContentRoot();
  if (el) {
    Object.values(a11yClasses).forEach((c) => el.classList.remove(c));
  }
  document.documentElement.style.fontSize = '';
}

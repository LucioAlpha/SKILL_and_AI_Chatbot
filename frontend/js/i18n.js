/**
 * @module i18n
 * @description 多語言服務（繁體中文 / English）
 */

const LANG_KEY = 'fortune_lang';
let _translations = {};
let _lang = localStorage.getItem(LANG_KEY) || 'zh';

/**
 * 初始化 i18n，載入語言包
 * @param {string} [lang] - 初始語言，預設讀取 localStorage
 */
export async function initI18n(lang) {
  if (lang) _lang = lang;
  try {
    const res = await fetch(`/locales/${_lang}.json`);
    _translations = await res.json();
  } catch {
    console.error('[i18n] 語言包載入失敗，使用空翻譯');
    _translations = {};
  }
  applyTranslations();
}

/**
 * 取得翻譯文字
 * @param {string} key - 以點號分隔的路徑，如 'home.title'
 * @returns {string}
 */
export function t(key) {
  const parts = key.split('.');
  let cur = _translations;
  for (const p of parts) {
    if (cur == null) return key;
    cur = cur[p];
  }
  return cur ?? key;
}

/** 切換語言並重新套用翻譯 */
export async function setLang(lang) {
  _lang = lang;
  localStorage.setItem(LANG_KEY, lang);
  await initI18n(lang);
}

export function getLang() { return _lang; }

/** 將 data-i18n 屬性的元素套用翻譯 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  // 更新語言按鈕顯示
  const btn = document.getElementById('btn-lang');
  if (btn) btn.textContent = _lang === 'zh' ? 'EN' : '中';
}

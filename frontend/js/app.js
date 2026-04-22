/**
 * @module app
 * @description 主程式進入點，整合所有模組並初始化頁面邏輯
 */
import { initRouter, navigate } from './router.js';
import { initI18n, setLang, getLang, t } from './i18n.js';
import { drawFortune, fetchHistory, saveHistory, clearHistory } from './api.js';
import { shareToLine, shareToFacebook, copyLink } from './share.js';

// ── 全域狀態 ────────────────────────────────────────────
let _currentFortune = null;
let _currentCategory = null;
const SHAKE_DURATION_MS = 2800;

// ── 工具函式 ────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function showError(msg) {
  showToast(`⚠️ ${msg}`);
}

// ── 頁面處理器 ──────────────────────────────────────────

/** 首頁 */
function onHome() {
  document.getElementById('btn-start')?.addEventListener('click', () => navigate('category'), { once: true });
}

/** 類別選擇頁 */
function onCategory() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      _currentCategory = card.dataset.category;
      navigate('shake');
    }, { once: true });
  });
}

/** 搖籤頁 */
function onShake() {
  const stick = document.querySelector('.fortune-stick');
  const btn   = document.getElementById('btn-do-shake');
  const hint  = document.querySelector('.shake-hint');

  // ✅ 每次進入頁面都重置狀態（修正：回首頁再次抽籤時按鈕仍 disabled 的 Bug）
  btn?.removeAttribute('disabled');
  stick?.classList.remove('shaking', 'glow-pulse', 'fly-out');
  if (hint) hint.setAttribute('data-i18n', 'shake.hint');
  if (hint) hint.textContent = t('shake.hint');

  async function doShake() {
    if (!stick) return;
    btn?.setAttribute('disabled', true);
    if (hint) hint.textContent = t('shake.shaking');

    stick.classList.add('shaking', 'glow-pulse');

    // 搖動期間呼叫 API
    const [fortune] = await Promise.all([
      drawFortune().catch(e => { showError('籤詩載入失敗，請重試'); btn?.removeAttribute('disabled'); throw e; }),
      new Promise(r => setTimeout(r, SHAKE_DURATION_MS)),
    ]);

    stick.classList.remove('shaking', 'glow-pulse');
    stick.classList.add('fly-out');

    _currentFortune = fortune;

    // 儲存紀錄（fire-and-forget，不阻塞流程）
    saveHistory(fortune.id, _currentCategory || '一般').catch(e => console.error('[saveHistory]', e));

    setTimeout(() => navigate('result', { fortune }), 500);
  }

  btn?.addEventListener('click', doShake, { once: true });
  // 手機晃動觸發
  if (typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent.requestPermission) {
    DeviceMotionEvent.requestPermission()
      .then(perm => { if (perm === 'granted') listenMotion(doShake); })
      .catch(() => {});
  } else {
    listenMotion(doShake);
  }
}


function listenMotion(cb) {
  let called = false;
  window.addEventListener('devicemotion', (e) => {
    const acc = e.acceleration;
    if (!acc) return;
    const total = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
    if (total > 25 && !called) { called = true; cb(); }
  }, { once: true });
}

/** 籤詩結果頁 */
function onResult({ fortune } = {}) {
  const f = fortune || _currentFortune;
  if (!f) { navigate('home'); return; }

  // 填入內容
  const gradeEl = document.getElementById('result-grade');
  if (gradeEl) {
    gradeEl.textContent = f.grade;
    gradeEl.className = `result-grade grade-${f.grade} animate`;
  }
  const poemEl = document.getElementById('result-poem');
  if (poemEl) poemEl.textContent = f.poem_zh;

  const meaningEl = document.getElementById('result-meaning');
  if (meaningEl) meaningEl.textContent = f.meaning_zh;

  // 依類別顯示對應 result 欄位
  const cat = _currentCategory;
  const catResult = cat && f.result?.[cat];
  const catSection = document.getElementById('result-category-section');
  const catLabel   = document.getElementById('result-category-label');
  const catText    = document.getElementById('result-category-text');
  if (catSection && catResult) {
    catSection.classList.remove('hidden');
    if (catLabel) catLabel.textContent = cat;
    if (catText) catText.textContent = catResult;
  }

  const noteEl = document.getElementById('result-note');
  if (noteEl) {
    if (f.note) { noteEl.textContent = f.note; noteEl.classList.remove('hidden'); }
    else noteEl.classList.add('hidden');
  }

  // 卡片揭示動畫
  document.querySelector('.result-card')?.classList.add('reveal');

  // 分享按鈕
  document.getElementById('btn-share-line')?.addEventListener('click', () => shareToLine(f), { once: true });
  document.getElementById('btn-share-fb')?.addEventListener('click', () => shareToFacebook(f), { once: true });
  document.getElementById('btn-copy-link')?.addEventListener('click', async () => {
    await copyLink();
    showToast(t('result.copied'));
  }, { once: true });
  document.getElementById('btn-draw-again')?.addEventListener('click', () => navigate('category'), { once: true });
}

/** 歷史紀錄頁 */
async function onHistory() {
  const list = document.getElementById('history-list');
  const emptyEl = document.getElementById('history-empty');
  if (!list) return;

  list.innerHTML = '';
  try {
    const records = await fetchHistory();
    if (!records || records.length === 0) {
      emptyEl?.classList.remove('hidden');
      return;
    }
    emptyEl?.classList.add('hidden');
    records.forEach(r => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.innerHTML = `
        <span class="history-grade result-grade grade-${r.fortune_grade}">${r.fortune_grade}</span>
        <div class="history-content">
          <div class="history-poem">${r.fortune_poem}</div>
          <div class="history-meta">${r.category} · ${new Date(r.created_at).toLocaleString('zh-TW')}</div>
        </div>`;
      list.appendChild(item);
    });
  } catch (e) {
    showError('紀錄載入失敗');
  }

  document.getElementById('btn-clear-history')?.addEventListener('click', async () => {
    if (!confirm(t('history.confirm_clear'))) return;
    try {
      await clearHistory();
      showToast(t('history.cleared'));
      onHistory();
    } catch { showError('清除失敗'); }
  }, { once: true });
}

// ── 初始化 ───────────────────────────────────────────────
async function init() {
  await initI18n();

  // 語言切換
  document.getElementById('btn-lang')?.addEventListener('click', async () => {
    await setLang(getLang() === 'zh' ? 'en' : 'zh');
  });

  // 導航連結
  document.getElementById('nav-home')?.addEventListener('click',    () => navigate('home'));
  document.getElementById('nav-history')?.addEventListener('click', () => navigate('history'));

  initRouter({ home: onHome, category: onCategory, shake: onShake, result: onResult, history: onHistory });
}

document.addEventListener('DOMContentLoaded', init);

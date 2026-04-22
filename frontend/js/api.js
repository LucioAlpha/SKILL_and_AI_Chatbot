/**
 * @module api
 * @description FastAPI 後端呼叫封裝，自動帶入 visitor_id Header
 */

const API_BASE = '';   // 同源部署，相對路徑即可
const VISITOR_KEY = 'fortune_visitor_id';

/** 取得或初始化訪客 UUID */
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/**
 * 帶有 visitor_id Header 的 fetch 封裝
 * @param {string} path - API 路徑（如 /api/fortunes/draw）
 * @param {RequestInit} [options] - fetch 選項
 * @returns {Promise<any>} 解析後的 JSON data
 */
async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Visitor-Id': getVisitorId(),
    ...(options.headers || {}),
  };
  const res = await fetch(API_BASE + path, { ...options, headers });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.detail || json.error?.message || `HTTP ${res.status}`);
  }
  return json.data;
}

/** 隨機抽取一支籤詩 */
export async function drawFortune() {
  return apiFetch('/api/fortunes/draw');
}

/** 取得歷史紀錄（最近 10 筆） */
export async function fetchHistory() {
  return apiFetch('/api/history');
}

/**
 * 新增抽籤紀錄
 * @param {string} fortuneId
 * @param {string} category - 使用者選擇的問事項目
 */
export async function saveHistory(fortuneId, category) {
  return apiFetch('/api/history', {
    method: 'POST',
    body: JSON.stringify({ fortune_id: fortuneId, category }),
  });
}

/** 清除所有歷史紀錄 */
export async function clearHistory() {
  return apiFetch('/api/history', { method: 'DELETE' });
}

/**
 * @module router
 * @description Hash-based SPA 路由，管理頁面切換
 */

const PAGES = ['home', 'category', 'shake', 'result', 'history'];

/**
 * 導航至指定頁面
 * @param {string} page - 頁面 ID（home/category/shake/result/history）
 * @param {object} [state] - 傳遞給頁面的狀態資料
 */
export function navigate(page, state = {}) {
  if (!PAGES.includes(page)) {
    console.warn(`[Router] 未知頁面：${page}`);
    return;
  }
  window._routerState = state;
  location.hash = page;
}

/**
 * 初始化路由，監聽 hashchange 並執行頁面處理器
 * @param {Record<string, function>} handlers - 頁面處理器 map
 */
export function initRouter(handlers) {
  function render() {
    const page = location.hash.replace('#', '') || 'home';
    // 顯示對應頁面，隱藏其他
    PAGES.forEach(p => {
      const el = document.getElementById(`page-${p}`);
      if (!el) return;
      el.classList.toggle('active', p === page);
    });
    // 執行頁面處理器
    const handler = handlers[page];
    if (handler) handler(window._routerState || {});
    window._routerState = {};
  }

  window.addEventListener('hashchange', render);
  render(); // 初始化
}

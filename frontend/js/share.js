/**
 * @module share
 * @description 社群分享服務（LINE / Facebook / 複製連結）
 */

/**
 * 分享至 LINE
 * @param {object} fortune - 籤詩物件
 */
export function shareToLine(fortune) {
  const text = encodeURIComponent(
    `【公廟運勢籤】我抽到了「${fortune.grade}」\n${fortune.poem_zh}\n${fortune.meaning_zh.slice(0, 40)}…`
  );
  const url = encodeURIComponent(location.href);
  window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank');
}

/**
 * 分享至 Facebook
 * @param {object} fortune - 籤詩物件
 */
export function shareToFacebook(fortune) {
  const url = encodeURIComponent(location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

/**
 * 複製分享連結至剪貼簿
 * @returns {Promise<void>}
 */
export async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    return true;
  } catch {
    // 降級：建立暫時 input 複製
    const input = document.createElement('input');
    input.value = location.href;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    return true;
  }
}

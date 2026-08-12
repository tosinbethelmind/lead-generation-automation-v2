/**
 * Universal robust copy to clipboard function with fallbacks.
 * Works on HTTPS, HTTP, non-secure contexts, webviews, and legacy browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // Method 1: Modern navigator.clipboard API (requires secure context HTTPS or localhost)
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('navigator.clipboard.writeText failed, attempting execCommand fallback', err);
  }

  // Method 2: Document execCommand fallback (works on HTTP and older/embedded browsers)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Hide off-screen
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    
    // Selection for iOS & standard browsers
    textArea.focus();
    textArea.select();
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, 999999);
    }
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) return true;
  } catch (err) {
    console.error('execCommand copy fallback failed', err);
  }

  return false;
}

export function toCopyJson(value: unknown): string {
  const payload = value === undefined ? null : value;
  try {
    return JSON.stringify(payload, null, 2) ?? 'null';
  } catch {
    return String(payload);
  }
}

export async function copyText(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // iframe / permission fallback
    }
  }
  copyWithTextarea(text);
}

function copyWithTextarea(text: string): void {
  if (typeof document === 'undefined') {
    throw new Error('clipboard unavailable');
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) throw new Error('clipboard unavailable');
}

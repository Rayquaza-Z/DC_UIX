// Utility helpers shared across modules
export const getJSON = async (url, opt = {}, ms = 25000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { ...opt, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    throw new Error(e.name === "AbortError" ? "timed out" : e.message);
  } finally {
    clearTimeout(timeout);
  }
};

export const firstSuccessful = async (fns) => {
  let last;
  for (const fn of fns) {
    try {
      return await fn();
    } catch (e) {
      last = e;
    }
  }
  throw last;
};

export const HINT = window.self !== window.top
  ? " This page is inside a preview frame, which blocks outside requests. Open the file directly in your browser."
  : " If this keeps happening, open the browser console (F12) for details.";

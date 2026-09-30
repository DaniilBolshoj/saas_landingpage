/* Apply the configured theme before stylesheets paint, with system preference fallback. */
(() => {
  const key = window.siteConfig?.themeStorageKey;
  let savedTheme = null;

  try {
    savedTheme = key ? localStorage.getItem(key) : null;
  } catch {
    savedTheme = null;
  }

  const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  document.documentElement.dataset.theme = savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : systemPrefersDark ? 'dark' : 'light';
})();

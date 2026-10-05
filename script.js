/* Keep page interactions in one deferred script; no inline handlers are required. */
const root = document.documentElement;
const config = window.siteConfig || {};
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-navigation');
const siteHeader = document.querySelector('.site-header');
const themeButtons = document.querySelectorAll('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeStorageKey = config.themeStorageKey;
const brandName = config.brandName?.trim() || 'Pavyzdys';
const brandDomain = config.domain?.trim() || 'pavyzdys.example';
const cleanBrandDomain = brandDomain.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
const brandEmail = config.email?.trim() || 'labas@pavyzdys.example';
const configuredEndpoint = config.formEndpoint?.trim();
const contactForm = document.querySelector('#contact-form');
const accessForm = document.querySelector('#access-form');
const toast = document.querySelector('#form-toast');
const demoDialog = document.querySelector('.demo-dialog');
const contactEndpoint = configuredEndpoint || '';

document.querySelectorAll('[data-brand-name]').forEach((element) => {
  element.textContent = brandName;
});
document.querySelectorAll('[data-brand-domain]').forEach((element) => {
  element.textContent = cleanBrandDomain;
});
document.querySelectorAll('[data-contact-email]').forEach((element) => {
  element.textContent = brandEmail;
});
document.querySelectorAll('[data-contact-link]').forEach((link) => {
  link.href = `mailto:${brandEmail}`;
});
document.querySelectorAll('[data-brand-home]').forEach((link) => {
  link.setAttribute('aria-label', `${brandName}: pradžia`);
});
document.querySelector('[data-dashboard-label]')?.setAttribute('aria-label', `Dekoratyvus ${brandName} projektų valdymo skydelio pavyzdys`);
document.title = document.title.replace('Pavyzdys', brandName);
document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', document.title);
['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'].forEach((selector) => {
  const meta = document.querySelector(selector);
  if (meta) meta.content = meta.content.replaceAll('Pavyzdys', brandName);
});
const canonicalUrl = `https://${cleanBrandDomain}/`;
document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
document.querySelector('meta[property="og:image"]')?.setAttribute('content', `${canonicalUrl}assets/og-cover.svg`);
document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', `${canonicalUrl}assets/og-cover.svg`);

/* Theme preference is remembered when storage is available and otherwise remains usable. */
function readStoredTheme() {
  try {
    return themeStorageKey ? localStorage.getItem(themeStorageKey) : null;
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    if (themeStorageKey) localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The toggle still works in private contexts where storage is disabled.
  }
}

function updateTheme(theme) {
  const isDark = theme === 'dark';
  root.dataset.theme = isDark ? 'dark' : 'light';
  const primaryColor = getComputedStyle(document.body).getPropertyValue('--color-primary').trim();
  if (primaryColor) themeMeta?.setAttribute('content', primaryColor);

  themeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(isDark));
    button.setAttribute('aria-label', `Įjungti ${isDark ? 'šviesią' : 'tamsią'} temą`);
    const icon = button.querySelector('.icon');
    icon?.classList.toggle('icon-moon', !isDark);
    icon?.classList.toggle('icon-sun', isDark);
    const text = button.querySelector('.theme-toggle-label');
    if (text) text.textContent = `${isDark ? 'Šviesi' : 'Tamsi'} tema`;
  });
}

const storedTheme = readStoredTheme();
let hasManualThemeChoice = storedTheme === 'dark' || storedTheme === 'light';
updateTheme(storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : root.dataset.theme || 'light');

const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)');
systemTheme?.addEventListener?.('change', (event) => {
  if (!hasManualThemeChoice) updateTheme(event.matches ? 'dark' : 'light');
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    hasManualThemeChoice = true;
    updateTheme(nextTheme);
    storeTheme(nextTheme);
  });
});

/* The mobile menu closes after selection, Escape, or moving back to desktop width. */
function setMenuOpen(isOpen) {
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
  menuToggle?.setAttribute('aria-label', isOpen ? 'Uždaryti navigacijos meniu' : 'Atidaryti navigacijos meniu');
  navigation?.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

navigation?.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    }
    setMenuOpen(false);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (menuToggle?.getAttribute('aria-expanded') === 'true' && !siteHeader?.contains(event.target)) {
    setMenuOpen(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) setMenuOpen(false);
});

/* The demo uses a native dialog, including its built-in focus and Escape handling. */
document.querySelector('[data-open-demo]')?.addEventListener('click', () => {
  if (typeof demoDialog?.showModal === 'function') demoDialog.showModal();
});

document.querySelector('.dialog-close')?.addEventListener('click', () => demoDialog?.close());

demoDialog?.addEventListener('click', (event) => {
  if (event.target === demoDialog) demoDialog.close();
});

document.querySelector('[data-close-demo]')?.addEventListener('click', () => demoDialog?.close());

const demoTaskInputs = demoDialog?.querySelectorAll('.demo-tasks input') || [];
const demoProgress = demoDialog?.querySelector('[data-demo-progress]');

demoTaskInputs.forEach((input) => {
  input.addEventListener('change', () => {
    const completed = [...demoTaskInputs].filter((task) => task.checked).length;
    if (demoProgress) demoProgress.textContent = `Užbaigta ${completed} iš ${demoTaskInputs.length} užduočių.`;
  });
});

/* Native constraint validation is paired with field-specific, accessible messages. */
const fields = [
  { input: document.querySelector('#contact-name'), error: document.querySelector('#name-error'), label: 'Vardas' },
  { input: document.querySelector('#contact-email'), error: document.querySelector('#email-error'), label: 'El. paštas' },
  { input: document.querySelector('#contact-message'), error: document.querySelector('#message-error'), label: 'Žinutė' },
  { input: document.querySelector('#privacy-ack'), error: document.querySelector('#privacy-error'), label: 'Privatumo patvirtinimas' },
];
const accessFields = [
  { input: document.querySelector('#access-email'), error: document.querySelector('#access-email-error'), label: 'El. paštas' },
  { input: document.querySelector('#access-privacy-ack'), error: document.querySelector('#access-privacy-error'), label: 'Privatumo patvirtinimas' },
];

function getFieldError(input, label) {
  if (input.type === 'checkbox' && input.validity.valueMissing) {
    return 'Patvirtinkite, kad susipažinote su privatumo politikos ruošiniu.';
  }
  if (input.validity.valueMissing) return `Įveskite lauką „${label}“.`;
  if (input.validity.typeMismatch) return 'Įveskite galiojantį el. pašto adresą.';
  if (input.validity.tooShort) return `Lauke „${label}“ įveskite bent ${input.minLength} simbolius.`;
  if (input.validity.tooLong) return `Lauke „${label}“ galima įvesti iki ${input.maxLength} simbolių.`;
  return '';
}

function validateField(field) {
  const message = getFieldError(field.input, field.label);
  field.input.setAttribute('aria-invalid', String(Boolean(message)));
  field.error.textContent = message;
  return !message;
}

fields.concat(accessFields).forEach((field) => {
  field.input?.addEventListener('input', () => {
    if (field.input.getAttribute('aria-invalid') === 'true') validateField(field);
  });
});

let toastTimer;

function showToast(title, message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-message').textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 6000);
}

toast?.querySelector('.toast-close')?.addEventListener('click', () => {
  window.clearTimeout(toastTimer);
  toast.classList.remove('is-visible');
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const honeypot = contactForm.querySelector('#contact-website');
  if (honeypot?.value.trim()) return;

  const invalidFields = fields.filter((field) => !validateField(field));
  if (invalidFields.length > 0) {
    invalidFields[0].input.focus();
    return;
  }

  if (!contactEndpoint) {
    showToast('Demonstracinis režimas', 'Žinutė neišsiųsta. Prijunkite formos endpointą.');
    return;
  }

  const submitButton = contactForm.querySelector('[type="submit"]');
  submitButton.disabled = true;
  contactForm.setAttribute('aria-busy', 'true');

  fetch(contactEndpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new FormData(contactForm),
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Form submission failed (${response.status}).`);
      contactForm.reset();
      fields.forEach(({ input, error }) => {
        input.removeAttribute('aria-invalid');
        error.textContent = '';
      });
      showToast('Žinutė išsiųsta', 'Ačiū, netrukus su jumis susisieksime.');
    })
    .catch(() => {
      showToast('Nepavyko išsiųsti', 'Patikrinkite ryšį arba bandykite dar kartą.');
    })
    .finally(() => {
      submitButton.disabled = false;
      contactForm.removeAttribute('aria-busy');
    });
});

accessForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (accessForm.querySelector('#access-website')?.value.trim()) return;

  const invalidFields = accessFields.filter((field) => !validateField(field));
  if (invalidFields.length > 0) {
    invalidFields[0].input.focus();
    return;
  }

  if (!contactEndpoint) {
    showToast('Demonstracinis režimas', 'Užklausa neišsiųsta. Prijunkite formos endpointą.');
    return;
  }

  const submitButton = accessForm.querySelector('[type="submit"]');
  const formData = new FormData(accessForm);
  formData.set('requestType', 'access');
  submitButton.disabled = true;
  accessForm.setAttribute('aria-busy', 'true');

  fetch(contactEndpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error(`Access request failed (${response.status}).`);
      accessForm.reset();
      showToast('Užklausa išsiųsta', 'Ačiū. Susisieksime nurodytu el. paštu.');
    })
    .catch(() => {
      showToast('Nepavyko išsiųsti', 'Patikrinkite ryšį arba bandykite dar kartą.');
    })
    .finally(() => {
      submitButton.disabled = false;
      accessForm.removeAttribute('aria-busy');
    });
});

/* One-time cleanup of the removed demo auth data; safe to delete in a later release. */
try { localStorage.removeItem('saas-demo-users'); } catch { /* storage unavailable */ }
try { sessionStorage.removeItem('saas-demo-session'); } catch { /* storage unavailable */ }

/* Keep the footer year current without requiring a build step. */
const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());
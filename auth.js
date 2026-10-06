const { supabaseUrl, supabaseAnonKey } = window.siteConfig || {};

export const isConfigured = Boolean(supabaseUrl?.trim() && supabaseAnonKey?.trim());

export const supabase = isConfigured
  ? window.supabase.createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const page = document.body.dataset.authPage;
const form = document.querySelector('[data-auth-form]');
const fieldsContainer = form?.querySelector('fieldset');
const submitButton = form?.querySelector('[type="submit"]');
const statusMessage = document.querySelector('#auth-message');
const configMessage = document.querySelector('#auth-config-message');

function setMessage(message, isError = false) {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.classList.toggle('is-error', isError);
}

function setFormEnabled(enabled) {
  if (fieldsContainer) fieldsContainer.disabled = !enabled;
  if (submitButton) submitButton.disabled = !enabled;
}

if (!isConfigured) {
  setFormEnabled(false);
} else {
  if (configMessage) configMessage.hidden = true;
  if (page !== 'reset-password') setFormEnabled(true);

  const initialStatus = new URLSearchParams(location.search).get('password-updated');
  if (page === 'login' && initialStatus !== null) {
    setMessage('Slaptažodis pakeistas. Prisijunkite nauju slaptažodžiu.');
  }
}

function validateField(input) {
  const error = document.querySelector(`#${input.id}-error`);
  const label = input.dataset.label;
  let message = '';

  if (input.validity.valueMissing) {
    message = input.type === 'checkbox'
      ? 'Patvirtinkite, kad susipažinote su privatumo politikos ruošiniu.'
      : `Įveskite lauką „${label}“.`;
  } else if (input.validity.typeMismatch) {
    message = 'Įveskite galiojantį el. pašto adresą.';
  } else if (input.validity.tooShort) {
    const n = input.minLength;
    message = `Lauke „${label}“ įveskite bent ${n} ${window.ltPlural(n, 'simbolį', 'simbolius', 'simbolių')}.`;
  } else if (input.validity.tooLong) {
    const n = input.maxLength;
    message = `Lauke „${label}“ galima įvesti iki ${n} ${window.ltPlural(n, 'simbolį', 'simbolius', 'simbolių')}.`;
  }

  if (input.type === 'password' && input.name === 'password-confirmation') {
    const password = form.elements.namedItem('password').value;
    if (!message && input.value !== password) message = 'Slaptažodžiai nesutampa.';
  }

  input.setAttribute('aria-invalid', String(Boolean(message)));
  if (error) error.textContent = message;
  return !message;
}

form?.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') validateField(input);
    if (input.name === 'password') {
      const confirmation = form.elements.namedItem('password-confirmation');
      if (confirmation?.getAttribute('aria-invalid') === 'true') validateField(confirmation);
    }
  });
  input.addEventListener('change', () => {
    if (input.getAttribute('aria-invalid') === 'true') validateField(input);
  });
});

function validateForm() {
  const invalidInputs = [...form.querySelectorAll('input')].filter((input) => !validateField(input));
  if (invalidInputs.length) {
    invalidInputs[0].focus();
    return false;
  }
  return true;
}

function responseError(error) {
  const status = Number(error?.status || error?.statusCode);
  return status
    ? `Užklausa nepavyko (HTTP ${status}). Patikrinkite duomenis arba bandykite dar kartą.`
    : 'Patikrinkite ryšį ir bandykite dar kartą.';
}

function setSubmitting(isSubmitting) {
  if (!submitButton) return;
  submitButton.disabled = isSubmitting || !isConfigured;
  submitButton.textContent = isSubmitting ? 'Palaukite…' : submitButton.dataset.label;
}

let submitting = false;

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!isConfigured || submitting || !validateForm()) return;

  const values = new FormData(form);
  const email = String(values.get('email') || '').trim();
  submitting = true;
  setSubmitting(true);
  setMessage('');

  try {
    if (page === 'register') {
      const { error } = await supabase.auth.signUp({
        email,
        password: String(values.get('password')),
        options: { emailRedirectTo: new URL('dashboard.html', location.href).href },
      });
      if (error) throw error;
      setMessage('Jei šis el. paštas dar nenaudojamas, išsiuntėme patvirtinimo laišką. Patvirtinkite el. paštą ir prisijunkite.');
    } else if (page === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: String(values.get('password')),
      });
      if (error) {
        const status = Number(error.status || error.statusCode);
        if (status === 429) throw new Error('Per daug bandymų. Palaukite kelias minutes ir bandykite dar kartą.');
        if (status === 400 || status === 401) throw new Error('Neteisingas el. paštas ar slaptažodis arba el. paštas dar nepatvirtintas.');
        throw new Error('Nepavyko prisijungti. Bandykite vėliau.');
      }
      location.replace('dashboard.html');
    } else if (page === 'forgot-password') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: new URL('reset-password.html', location.href).href,
      });
      if (error) throw error;
      setMessage('Jei toks el. paštas užregistruotas, išsiuntėme slaptažodžio atstatymo nuorodą.');
    } else if (page === 'reset-password') {
      const { error } = await supabase.auth.updateUser({ password: String(values.get('password')) });
      if (error) throw error;
      location.replace('login.html?password-updated=1');
    }
  } catch (error) {
    if (page === 'login') {
      const message = error.message === 'Neteisingas el. paštas ar slaptažodis arba el. paštas dar nepatvirtintas.'
        || error.message === 'Per daug bandymų. Palaukite kelias minutes ir bandykite dar kartą.'
        ? error.message
        : 'Nepavyko prisijungti. Bandykite vėliau.';
      setMessage(message, true);
    } else if (page === 'register') {
      setMessage('Nepavyko sukurti paskyros. Patikrinkite duomenis arba bandykite dar kartą.', true);
    } else if (page === 'forgot-password') {
      setMessage('Nepavyko išsiųsti atstatymo nuorodos. Bandykite vėliau.', true);
    } else if (page === 'reset-password') {
      setMessage('Nepavyko pakeisti slaptažodžio. Patikrinkite nuorodą ir bandykite dar kartą.', true);
    } else {
      setMessage(responseError(error), true);
    }
  } finally {
    setSubmitting(false);
    submitting = false;
  }
});

if (page === 'reset-password') {
  const recoveryMessage = document.querySelector('#recovery-message');
  const resetForm = document.querySelector('#auth-form');
  supabase?.auth.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      resetForm.hidden = false;
      recoveryMessage.hidden = true;
      setFormEnabled(isConfigured);
    }
  });

  if (isConfigured) {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (data.session) {
        resetForm.hidden = false;
        recoveryMessage.hidden = true;
        setFormEnabled(true);
      } else if (resetForm.hidden) {
        recoveryMessage.hidden = false;
      }
    }).catch((error) => {
      recoveryMessage.hidden = false;
      recoveryMessage.textContent = `Nepavyko patikrinti atkūrimo nuorodos. ${responseError(error)}`;
    });
  }
}

if (page === 'dashboard') {
  const dashboardContent = document.querySelector('#dashboard-content');
  const dashboardMessage = document.querySelector('#dashboard-message');
  const accountEmail = document.querySelector('#account-email');
  const signOutButton = document.querySelector('#sign-out');

  if (!isConfigured) {
    dashboardMessage.textContent = 'Paskyros dar nesukonfigūruotos. Užpildykite supabaseUrl ir supabaseAnonKey faile site-config.js.';
  } else {
    let signingOut = false;
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (!data.session) {
        location.replace('login.html');
        return;
      }
      accountEmail.textContent = data.session.user.email || '';
      dashboardContent.hidden = false;
      dashboardMessage.hidden = true;
    }).catch((error) => {
      dashboardMessage.textContent = `Nepavyko patikrinti prisijungimo. ${responseError(error)}`;
    });

    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && !signingOut) location.replace('login.html');
    });

    signOutButton.addEventListener('click', async () => {
      signingOut = true;
      signOutButton.disabled = true;
      signOutButton.textContent = 'Palaukite…';
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        location.replace('index.html');
      } catch (error) {
        dashboardMessage.hidden = false;
        dashboardMessage.textContent = `Nepavyko atsijungti. ${responseError(error)}`;
        signOutButton.disabled = false;
        signOutButton.textContent = 'Atsijungti';
        signingOut = false;
      }
    });
  }
}

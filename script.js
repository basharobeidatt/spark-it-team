const sidebar = document.getElementById('sidebar');
const mobileToggle = document.getElementById('mobileToggle');
const langBtn = document.getElementById('langBtn');

let currentLang = localStorage.getItem('spark-language') || 'en';

if (mobileToggle && sidebar) {
mobileToggle.addEventListener('click', () => {
const isOpen = sidebar.classList.toggle('open');
mobileToggle.setAttribute('aria-expanded', String(isOpen));
});
}

document.querySelectorAll('.navlinks a').forEach(a => {
a.addEventListener('click', () => {
if (sidebar) sidebar.classList.remove('open');
if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
});
});

if (sidebar) {
document.addEventListener('keydown', e => {
if (e.key === 'Escape') {
sidebar.classList.remove('open');
if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
}
});
}

document.addEventListener('click', e => {
if (
sidebar &&
mobileToggle &&
sidebar.classList.contains('open') &&
!sidebar.contains(e.target) &&
!mobileToggle.contains(e.target)
) {
sidebar.classList.remove('open');
mobileToggle.setAttribute('aria-expanded', 'false');
}
});

function setLanguage(lang) {
currentLang = lang;
localStorage.setItem('spark-language', lang);

document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

document.querySelectorAll('[data-en][data-ar]').forEach(el => {
el.innerHTML = el.dataset[lang];
});

if (langBtn) {
langBtn.textContent = lang === 'en' ? 'العربية' : 'English';
}
}

if (langBtn) {
langBtn.addEventListener('click', () => {
setLanguage(currentLang === 'en' ? 'ar' : 'en');
});
}

setLanguage(currentLang);

document.querySelectorAll('[data-year]').forEach(el => {
el.textContent = new Date().getFullYear();
});

/*

* SPARK application submission
*
* The form will submit only when the Supabase client is configured.
* It expects window.supabase to be the Supabase JS library,
* and SPARK_SUPABASE_URL / SPARK_SUPABASE_ANON_KEY to be configured.
  */

document.querySelectorAll('form[data-join-form]').forEach(form => {
form.addEventListener('submit', async e => {
e.preventDefault();

```
const notice = form.querySelector('.notice');
const button = form.querySelector('button[type="submit"]');

const showMessage = (en, ar, isError = false) => {
  if (!notice) return;
  notice.style.display = 'block';
  notice.textContent = currentLang === 'ar' ? ar : en;
  notice.setAttribute('role', isError ? 'alert' : 'status');
};

const config = window.SPARK_SUPABASE_URL && window.SPARK_SUPABASE_ANON_KEY;
const supabaseLibrary = window.supabase;

if (!config || !supabaseLibrary || !supabaseLibrary.createClient) {
  showMessage(
    'The application system is not configured yet. Please try again later.',
    'نظام التقديم غير مفعّل بعد. يرجى المحاولة لاحقًا.',
    true
  );
  return;
}

const get = name => form.elements[name]?.value?.trim() || '';

const application = {
  full_name: get('name'),
  student_id: get('studentId'),
  email: get('email'),
  university_major: get('major'),
  university_year: get('year'),
  phone: get('phone'),
  team_choice: get('team'),
  skills: get('skills'),
  motivation: get('reason')
};

if (
  !application.full_name ||
  !application.student_id ||
  !application.email ||
  !application.university_major ||
  !application.university_year ||
  !application.phone ||
  !application.team_choice ||
  !application.motivation
) {
  showMessage(
    'Please complete all required fields.',
    'يرجى تعبئة جميع الحقول المطلوبة.',
    true
  );
  return;
}

if (button) {
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
}

showMessage('Submitting your application…', 'جارٍ إرسال طلبك…');

try {
  const client = supabaseLibrary.createClient(
    window.SPARK_SUPABASE_URL,
    window.SPARK_SUPABASE_ANON_KEY
  );

  const { error } = await client
    .from('join_requests')
    .insert([application]);

  if (error) throw error;

  form.reset();

  showMessage(
    'Your application was submitted successfully! Thank you for your interest in SPARK.',
    'تم إرسال طلبك بنجاح! شكرًا لاهتمامك بالانضمام إلى SPARK.'
  );
} catch (error) {
  console.error('SPARK application submission failed:', error);

  showMessage(
    'We could not submit your application. Please try again later.',
    'تعذّر إرسال طلبك. يرجى المحاولة مرة أخرى لاحقًا.',
    true
  );
} finally {
  if (button) {
    button.disabled = false;
    button.removeAttribute('aria-busy');
  }
}
```

});
});

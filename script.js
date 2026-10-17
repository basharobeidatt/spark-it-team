```javascript
'use strict';

// ========================================
// SPARK - Navigation and Language
// ========================================

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

document.querySelectorAll('.navlinks a').forEach((link) => {
  link.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');

    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sidebar) {
    sidebar.classList.remove('open');

    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

document.addEventListener('click', (event) => {
  if (
    sidebar &&
    mobileToggle &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(event.target) &&
    !mobileToggle.contains(event.target)
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

  document.querySelectorAll('[data-en][data-ar]').forEach((element) => {
    const translation = element.dataset[lang];

    if (translation !== undefined) {
      element.innerHTML = translation;
    }
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

// ========================================
// SPARK - Join Application Form
// ========================================

const joinForm = document.getElementById('joinForm');

if (joinForm) {
  const notice = joinForm.querySelector('.notice');
  const submitButton = joinForm.querySelector('button[type="submit"]');

  function showJoinMessage(message, success = false) {
    if (!notice) return;

    notice.textContent = message;
    notice.style.display = 'block';
    notice.setAttribute('role', 'status');
    notice.setAttribute('aria-live', 'polite');

    notice.style.color = success ? '#16a34a' : '#dc2626';
  }

  joinForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!joinForm.reportValidity()) return;

    if (
      !window.supabase ||
      !window.SPARK_SUPABASE_URL ||
      !window.SPARK_SUPABASE_ANON_KEY
    ) {
      showJoinMessage(
        currentLang === 'ar'
          ? 'تعذر الاتصال بالخدمة. تأكد من إعدادات Supabase وحاول مجددًا.'
          : 'The service could not be loaded. Please try again later.'
      );
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
    }

    showJoinMessage(
      currentLang === 'ar'
        ? 'جارٍ إرسال طلبك...'
        : 'Submitting your application...'
    );

    try {
      const client = window.supabase.createClient(
        window.SPARK_SUPABASE_URL,
        window.SPARK_SUPABASE_ANON_KEY
      );

      const getValue = (name) => {
        const field = joinForm.elements.namedItem(name);
        return field && typeof field.value === 'string'
          ? field.value.trim()
          : '';
      };

      const application = {
        full_name: getValue('name'),
        student_id: getValue('studentId'),
        university_major: getValue('major'),
        university_year: getValue('year'),
        phone: getValue('phone'),
        team_choice: getValue('team'),
        skills: getValue('skills'),
        motivation: getValue('reason')
      };

      const { error } = await client
        .from('join_requests')
        .insert([application]);

      if (error) {
        console.error('SPARK Supabase submission error:', error);
        throw error;
      }

      showJoinMessage(
        currentLang === 'ar'
          ? 'تم إرسال طلبك بنجاح! شكرًا لاهتمامك بالانضمام إلى SPARK.'
          : 'Your application was submitted successfully. Thank you for your interest in SPARK!',
        true
      );

      joinForm.reset();
    } catch (error) {
      console.error('SPARK application error:', error);

      showJoinMessage(
        currentLang === 'ar'
          ? 'لم نتمكن من إرسال طلبك. تأكد من اتصال الإنترنت وحاول مجددًا.'
          : 'We could not submit your application. Please check your connection and try again.'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
      }
    }
  });
}

// ========================================
// SPARK - Footer Year
// ========================================

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});
```

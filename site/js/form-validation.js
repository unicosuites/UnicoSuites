/* ============================================================
   Unico Suites — Contact form validation
   Vanilla JS. Inline error messages. Submits via Netlify Forms.
   ============================================================ */

(() => {
  'use strict';

  const form = document.querySelector('form[data-validate]');
  if (!form) return;

  const fields = Array.from(form.querySelectorAll('input, textarea, select')).filter(
    el => el.name && !el.disabled && el.type !== 'hidden'
  );

  const errorMsg = (field, type) => {
    const messages = {
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      tel: 'Please enter a valid UK phone number.',
    };
    return messages[type] || messages.required;
  };

  const validateField = (field) => {
    const wrapper = field.closest('.field');
    if (!wrapper) return true;
    const errEl = wrapper.querySelector('.field__error');
    let valid = true;
    let msgKey = 'required';

    if (field.required && !field.value.trim()) {
      valid = false;
    } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      valid = false;
      msgKey = 'email';
    } else if (field.type === 'tel' && field.value && !/^[0-9+()\s\-]{7,}$/.test(field.value)) {
      valid = false;
      msgKey = 'tel';
    }

    wrapper.classList.toggle('is-error', !valid);
    if (errEl) errEl.textContent = valid ? '' : errorMsg(field, msgKey);
    return valid;
  };

  fields.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.field')?.classList.contains('is-error')) validateField(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    let allValid = true;
    fields.forEach(field => {
      if (!validateField(field)) allValid = false;
    });
    if (!allValid) {
      e.preventDefault();
      const first = form.querySelector('.field.is-error input, .field.is-error textarea, .field.is-error select');
      first?.focus();
      return;
    }

    // For Netlify Forms: let the form submit naturally. The redirect on success
    // is handled by the form's action attribute or Netlify's confirmation page.
    // If the form has data-async, intercept and submit via fetch for nicer UX.
    if (form.dataset.async !== 'true') return; // native submit

    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn?.setAttribute('disabled', 'true');
    submitBtn?.setAttribute('aria-busy', 'true');

    try {
      const data = new FormData(form);
      const body = new URLSearchParams(data).toString();
      const res = await fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error('Network error');
      form.classList.add('is-submitted');
      form.classList.remove('is-failed');
      form.reset();
    } catch (err) {
      form.classList.add('is-failed');
    } finally {
      submitBtn?.removeAttribute('disabled');
      submitBtn?.removeAttribute('aria-busy');
    }
  });
})();

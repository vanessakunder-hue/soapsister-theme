// launch: the launch page. With site key and list id set, the address goes straight into the Klaviyo list through Klaviyo's client
// API (public key, no secret); if Klaviyo does not answer with a success, the plain Shopify form is sent instead.
(() => {
  const REVISION = '2024-10-15';
  document.querySelectorAll('[data-launch-form]').forEach((fields) => {
    const form = (fields.closest && fields.closest('form')) || fields;
    const company = fields.dataset.klaviyoCompany;
    const list = fields.dataset.klaviyoList;
    if (!company || !list || !window.fetch) return;
    form.addEventListener('submit', (e) => {
      const email = fields.querySelector('input[type="email"]');
      if (!email || !email.checkValidity()) return;
      e.preventDefault();
      const button = fields.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      const profile = { email: email.value.trim() };
      const body = {
        data: {
          type: 'subscription',
          attributes: {
            custom_source: fields.dataset.launchSource || 'Launch-Seite',
            profile: { data: { type: 'profile', attributes: profile } },
          },
          relationships: { list: { data: { type: 'list', id: list } } },
        },
      };
      return fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${encodeURIComponent(company)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/vnd.api+json', revision: REVISION },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) throw new Error(`Klaviyo ${r.status}`);
        form.hidden = true;
        const done = document.querySelector('[data-launch-done]');
        if (done) { done.hidden = false; done.focus(); }
      }).catch(() => { form.submit(); });
    });
  });

})();

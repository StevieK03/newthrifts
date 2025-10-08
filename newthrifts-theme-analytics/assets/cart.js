document.addEventListener('click', function (e) {
  const el = e.target.closest('.cart-remove');
  if (!el) return;

  // Prevent duplicate requests
  if (el.dataset.busy === '1') { e.preventDefault(); return; }
  el.dataset.busy = '1';

  e.preventDefault();
  const line = Number(el.dataset.line || 0);

  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ line: line, quantity: 0 })
  })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(() => location.reload())
  .catch(() => { window.location.href = el.getAttribute('href'); });
});




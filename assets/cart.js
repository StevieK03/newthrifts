(function(){
  // Progressive enhancement: AJAX remove; falls back to link if it fails
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target) return;
    var el = target.closest ? target.closest('.cart-remove') : null;
    if (!el) return;

    // Prevent duplicate requests
    if (el.dataset && el.dataset.busy === '1') { e.preventDefault(); return; }
    if (el.dataset) el.dataset.busy = '1';

    e.preventDefault();
    var line = Number((el.dataset && el.dataset.line) || 0);

    // Use fixed Shopify endpoint to avoid Liquid in JS
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ line: line, quantity: 0 })
    })
    .then(function(r){ return r.ok ? r.json() : Promise.reject(r); })
    .then(function(){ window.location.reload(); })
    .catch(function(){ window.location.href = el.getAttribute('href'); });
  });
})();

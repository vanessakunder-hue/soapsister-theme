/* Soapsister: Seifenblasen fliegen beim Hinzufuegen vom Button zum Warenkorb-Symbol im Header.
   Aufruf: window.sshBubbleFly(startElement, bildUrl, farbe). Bei reduzierter Bewegung wackelt nur das Symbol kurz. */
(function () {
  function target() {
    var icons = Array.prototype.slice.call(document.querySelectorAll('cart-icon, .header-actions__cart-icon'));
    for (var i = 0; i < icons.length; i++) {
      var r = icons[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return icons[i];
    }
    return null;
  }
  function bump(el) {
    if (!el || !el.animate) return;
    el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.28)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 650, easing: 'cubic-bezier(.3,1.6,.5,1)' });
  }
  window.sshBubbleFly = function (from, src, color) {
    var c = (color || '#751F65').trim();
    var to = target();
    if (!from || !to) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { bump(to); return; }
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    var sx = a.left + a.width / 2, sy = a.top + a.height / 2;
    var ex = b.left + b.width / 2, ey = b.top + b.height / 2;
    var dx = ex - sx, dy = ey - sy;
    var lift = Math.min(220, Math.max(90, Math.abs(dx) * 0.35));
    [62, 24, 44, 14, 34, 18, 52, 26].map(function (s) { return Math.round(s * (0.85 + Math.random() * 0.3)); }).forEach(function (sz, i) {
      var ox = (Math.random() - 0.5) * Math.min(a.width * 0.6, 160), oy = (Math.random() - 0.5) * 10;
      var bx = sx + ox, by = sy + oy, ddx = ex - bx, ddy = ey - by;
      var el = document.createElement('span');
      el.setAttribute('aria-hidden', 'true');
      el.style.cssText = 'position:fixed;z-index:2147483000;opacity:0;left:' + (bx - sz / 2) + 'px;top:' + (by - sz / 2) + 'px;width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;pointer-events:none;will-change:transform,opacity;background:' + (src ? 'url(' + src + ') center/contain no-repeat,' : '') + 'radial-gradient(circle at 32% 28%,rgba(255,255,255,.95) 0 11%,rgba(255,255,255,0) 13%),radial-gradient(circle,color-mix(in srgb,' + c + ' 10%,transparent) 50%,color-mix(in srgb,' + c + ' 38%,transparent) 100%);border:' + (sz > 20 ? 2 : 1.5) + 'px solid rgba(255,255,255,.9);box-sizing:border-box;box-shadow:0 6px 18px color-mix(in srgb,' + c + ' 28%,transparent),inset 0 0 ' + Math.round(sz / 5) + 'px rgba(255,255,255,.65)';
      document.body.appendChild(el);
      var wob = (i % 2 ? 1 : -1) * (14 + Math.random() * 46);
      var kf = [
        { transform: 'translate(0,0) scale(.2)', opacity: 0 },
        { transform: 'translate(' + (ddx * 0.08 + wob * 0.3) + 'px,' + (-lift * 0.35) + 'px) scale(1)', opacity: 1, offset: 0.18 },
        { transform: 'translate(' + (ddx * 0.45 + wob) + 'px,' + (ddy * 0.45 - lift) + 'px) scale(1.05)', opacity: 1, offset: 0.55 },
        { transform: 'translate(' + (ddx * 0.88) + 'px,' + (ddy * 0.9 - lift * 0.25) + 'px) scale(.75)', opacity: 1, offset: 0.86 },
        { transform: 'translate(' + ddx + 'px,' + ddy + 'px) scale(.45)', opacity: 0.9, offset: 0.94 },
        { transform: 'translate(' + ddx + 'px,' + ddy + 'px) scale(1.5)', opacity: 0 }
      ];
      var anim = el.animate(kf, { duration: 2400 + Math.random() * 600, delay: i * 210, easing: 'cubic-bezier(.4,0,.35,1)', fill: 'both' });
      anim.onfinish = function () { el.remove(); if (i === 0) bump(to); };
    });
  };
})();

/* Soapsister: Bubble-Pfad zwischen den Startseiten-Sections.
   Die Blasen sind nur beim Scrollen sichtbar: sie poppen auf, solange gescrollt wird,
   und verschwinden kurz nach dem Stillstand sowie am oberen Bildschirmrand. */
(function () {
  var trails = [], ticking = false, active = false, idle = 0;
  var IDLE_MS = 650;
  function pt(v) { return String(v).split(',').map(Number); }
  function build(el) {
    if (el.dataset.built) return;
    var sec = el.parentElement, H = sec.offsetHeight, W = sec.offsetWidth;
    if (!H) return;
    el.dataset.built = '1';
    var src = el.dataset.src, k = Number(el.dataset.seed || 0);
    var mob = window.matchMedia('(max-width: 749px)').matches;
    var stopPx = mob ? 75 : 105, stopR = mob ? 80 : 108, sp = null;
    var frag = document.createDocumentFragment(), items = [];
    function seg(p, q) {
      var n = Math.max(3, Math.round(((q[1] - p[1]) / 100) * H / (mob ? 70 : 54)));
      var c1y = p[1] + (q[1] - p[1]) * 0.6, c2y = q[1] - (q[1] - p[1]) * 0.6;
      for (var j = 1; j < n; j++) {
        var t = j / n, u = 1 - t;
        var x = u*u*u*p[0] + 3*u*u*t*p[0] + 3*u*t*t*q[0] + t*t*t*q[0] + Math.sin(k * 2.1) * 1.6;
        var y = u*u*u*p[1] + 3*u*u*t*c1y + 3*u*t*t*c2y + t*t*t*q[1];
        if (sp && Math.hypot((x - sp[0]) / 100 * W, (y - sp[1]) / 100 * H) < stopR) { k++; continue; }
        var sz = Math.round((24 + 60 * Math.pow(Math.abs(Math.sin(k * 1.7 + 0.4)), 2)) * (mob ? 0.5 : 1));
        var b = document.createElement('i');
        b.style.cssText = 'background-image:url(' + src + ');left:' + x.toFixed(2) + '%;top:' + y.toFixed(2) + '%;width:' + sz + 'px;height:' + sz + 'px;margin:' + (-sz / 2) + 'px 0 0 ' + (-sz / 2) + 'px;--d:' + (-(k % 7) * 0.9).toFixed(1) + 's;--dur:' + (6 + (k % 4)) + 's;--w:' + (-(5.4 - (k * 0.14) % 5.4)).toFixed(2) + 's;--td:' + ((k % 5) * 0.06).toFixed(2) + 's;--fade:0';
        frag.appendChild(b);
        items.push({ el: b, y: y / 100, f: 0 });
        k++;
      }
    }
    var a = pt(el.dataset.a), e = pt(el.dataset.b);
    if (el.dataset.s) {
      sp = [Number(el.dataset.s), ((H - stopPx) / H) * 100];
      seg(a, sp); seg(sp, e);
    } else seg(a, e);
    el.appendChild(frag);
    trails.push({ el: el, items: items });
  }
  function update() {
    ticking = false;
    var vh = window.innerHeight, start = vh * 0.45, end = vh * 0.08;
    for (var i = 0; i < trails.length; i++) {
      var r = trails[i].el.getBoundingClientRect();
      var list = trails[i].items;
      var near = !(r.bottom < -200 || r.top > vh + 200);
      for (var j = 0; j < list.length; j++) {
        var f = 0;
        if (active && near) {
          var vy = r.top + list[j].y * r.height;
          f = Math.min(1, Math.max(0, (vy - end) / (start - end)));
          if (vy > vh) f = 0;
          f = Math.round(f * 100) / 100;
        }
        if (list[j].f !== f) { list[j].f = f; list[j].el.style.setProperty('--fade', f); }
      }
    }
  }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function onScroll() {
    active = true;
    clearTimeout(idle);
    idle = setTimeout(function () { active = false; schedule(); }, IDLE_MS);
    schedule();
  }
  function init() { document.querySelectorAll('.ssh-trail[data-src]').forEach(build); update(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.addEventListener('load', init);
  document.addEventListener('scroll', onScroll, { passive: true, capture: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('shopify:section:load', init);
})();

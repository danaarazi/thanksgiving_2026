/* Arazi Thanksgiving welcome screen.
 * All artwork is drawn here as SVG, so the display works fully offline. */
(function () {
  "use strict";

  var cfg = window.ARAZI_CONFIG || {};
  var photos = (cfg.showPhotos !== false && Array.isArray(window.ARAZI_PHOTOS)) ? window.ARAZI_PHOTOS : [];
  var captions = cfg.captions || [];
  var seconds = Math.max(3, Number(cfg.secondsPerSlide) || 9);

  setText("familyLine", cfg.familyLine);
  setText("welcomeLine", cfg.welcomeLine);
  setText("footer", cfg.footer);
  if (cfg.familyLine) document.title = cfg.familyLine + " " + (cfg.welcomeLine || "");

  function setText(id, value) {
    if (value) document.getElementById(id).textContent = value;
  }

  /* ---------------- Shapes ---------------- */
  var MAPLE = "M50 2 L57 22 L70 14 L67 36 L88 28 L80 47 L98 55 L77 63 L83 80 L60 72 L53 86 " +
              "L52 100 L48 100 L47 86 L40 72 L17 80 L23 63 L2 55 L20 47 L12 28 L33 36 L30 14 L43 22 Z";
  var OVAL_LEAF = "M50 2 C80 22 88 62 50 98 C12 62 20 22 50 2 Z";
  var LEAF_COLORS = ["#c0392b", "#e0731f", "#f2b632", "#a8461b", "#d35400", "#8e2a17"];

  function leafSvg(path, color, w) {
    return '<path d="' + path + '" fill="' + color + '"/>' +
           '<path d="M50 14 L50 96" stroke="rgba(0,0,0,.25)" stroke-width="' + (w || 2) + '" fill="none"/>';
  }

  function svg(viewBox, body) {
    return '<svg class="art" viewBox="' + viewBox + '" xmlns="http://www.w3.org/2000/svg">' + body + "</svg>";
  }

  function fan(count, step, cx, pivotY, cy, rx, ry, colors) {
    var out = "", start = -step * (count - 1) / 2;
    for (var i = 0; i < count; i++) {
      out += '<ellipse transform="rotate(' + (start + i * step) + " " + cx + " " + pivotY + ')" cx="' + cx +
             '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + colors[i % colors.length] + '"/>';
    }
    return out;
  }

  function pumpkin(cx, cy, w, h, light, dark, stem) {
    var lobes = [-0.34, 0.34, -0.17, 0.17, 0];
    var out = "";
    lobes.forEach(function (o, i) {
      var rx = w * (i < 2 ? 0.3 : i < 4 ? 0.3 : 0.26);
      out += '<ellipse cx="' + (cx + o * w) + '" cy="' + cy + '" rx="' + rx + '" ry="' + (h / 2) +
             '" fill="' + light + '" stroke="' + dark + '" stroke-width="3"/>';
    });
    out += '<path d="M' + (cx - 5) + " " + (cy - h / 2 + 4) + " C" + (cx - 6) + " " + (cy - h / 2 - 18) + " " +
           (cx + 2) + " " + (cy - h / 2 - 26) + " " + (cx + 12) + " " + (cy - h / 2 - 30) + " L" + (cx + 14) + " " +
           (cy - h / 2 - 22) + " C" + (cx + 8) + " " + (cy - h / 2 - 16) + " " + (cx + 6) + " " + (cy - h / 2 - 6) +
           " " + (cx + 6) + " " + (cy - h / 2 + 4) + ' Z" fill="' + (stem || "#5b7a2b") + '"/>';
    return out;
  }

  /* ---------------- Illustrated scenes ---------------- */
  var scenes = [
    // 1. Turkey
    function () {
      var outer = fan(9, 19, 200, 235, 105, 30, 110, ["#b83224", "#e0731f", "#f2b632"]);
      var mid   = fan(8, 20, 200, 235, 135, 26, 82,  ["#e0731f", "#f2b632", "#b83224"]);
      var inner = fan(7, 20, 200, 235, 165, 22, 55,  ["#8e2a17", "#c0392b", "#d35400"]);
      return svg("-50 0 500 370",
        outer + mid + inner +
        '<ellipse cx="200" cy="245" rx="82" ry="92" fill="#7b4a26"/>' +
        '<ellipse cx="200" cy="270" rx="52" ry="60" fill="#a5683a"/>' +
        '<ellipse cx="128" cy="250" rx="22" ry="48" fill="#6a3d1f" transform="rotate(18 128 250)"/>' +
        '<ellipse cx="272" cy="250" rx="22" ry="48" fill="#6a3d1f" transform="rotate(-18 272 250)"/>' +
        '<circle cx="200" cy="152" r="44" fill="#8a5530"/>' +
        '<circle cx="184" cy="140" r="11" fill="#fff"/><circle cx="216" cy="140" r="11" fill="#fff"/>' +
        '<circle cx="186" cy="142" r="5.5" fill="#222"/><circle cx="214" cy="142" r="5.5" fill="#222"/>' +
        '<polygon points="188,160 212,160 200,182" fill="#f2b632"/>' +
        '<path d="M206 170 C222 176 222 200 210 204 C202 200 202 184 206 170 Z" fill="#c0392b"/>' +
        '<path d="M175 330 L175 352 M175 352 L162 362 M175 352 L175 364 M175 352 L188 362" stroke="#f2b632" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M225 330 L225 352 M225 352 L212 362 M225 352 L225 364 M225 352 L238 362" stroke="#f2b632" stroke-width="6" stroke-linecap="round"/>'
      );
    },

    // 2. Pumpkin patch
    function () {
      return svg("0 0 520 340",
        '<ellipse cx="260" cy="300" rx="250" ry="34" fill="rgba(40,15,5,.45)"/>' +
        '<path d="M60 290 C120 240 140 300 200 270 C250 245 300 300 360 268 C410 245 440 290 470 270" stroke="#5b7a2b" stroke-width="5" fill="none"/>' +
        '<g transform="translate(90 230) rotate(-20)">' + leafSvg(OVAL_LEAF, "#6f8f32") + "</g>" +
        pumpkin(400, 240, 150, 110, "#f4ead2", "#cdbf9c", "#6d5a2e") +
        pumpkin(250, 200, 230, 170, "#e8751a", "#b8530c") +
        pumpkin(110, 255, 130, 90, "#f2a23a", "#c47a17") +
        '<ellipse cx="480" cy="292" rx="34" ry="18" fill="#4f7a2a"/>' +
        '<ellipse cx="480" cy="288" rx="26" ry="9" fill="#e7c64a" opacity=".8"/>'
      );
    },

    // 3. Pumpkin pie
    function () {
      var scallops = "";
      for (var i = 0; i < 28; i++) {
        var a = (i / 28) * Math.PI * 2;
        scallops += '<circle cx="' + (220 + Math.cos(a) * 168).toFixed(1) + '" cy="' + (200 + Math.sin(a) * 58).toFixed(1) +
                    '" r="13" fill="#e2a85e" stroke="#c4843d" stroke-width="2"/>';
      }
      return svg("0 0 440 340",
        '<path d="M175 40 C160 60 190 75 175 95 M220 30 C205 52 235 68 220 90 M265 40 C250 60 280 75 265 95" ' +
        'stroke="rgba(255,244,224,.55)" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<ellipse cx="220" cy="262" rx="210" ry="62" fill="#f5efe4"/>' +
        '<ellipse cx="220" cy="256" rx="180" ry="48" fill="#e8dfcf"/>' +
        '<path d="M52 200 L72 250 C110 285 330 285 368 250 L388 200 Z" fill="#c4843d"/>' +
        '<ellipse cx="220" cy="200" rx="168" ry="58" fill="#c8661e"/>' +
        '<ellipse cx="210" cy="195" rx="120" ry="34" fill="#d9772a" opacity=".6"/>' +
        scallops +
        '<circle cx="205" cy="190" r="22" fill="#fffaf2"/><circle cx="232" cy="192" r="19" fill="#fffaf2"/>' +
        '<circle cx="218" cy="174" r="17" fill="#ffffff"/><circle cx="220" cy="160" r="8" fill="#ffffff"/>' +
        '<g transform="translate(250 150) rotate(30) scale(.32)">' + leafSvg(OVAL_LEAF, "#5b7a2b", 4) + "</g>"
      );
    },

    // 4. Cornucopia
    function () {
      var weave = "";
      for (var i = 0; i < 6; i++) {
        weave += '<path d="M' + (185 + i * 42) + " " + (150 - i * 9) + " C" + (200 + i * 40) + " " + (210 - i * 15) +
                 " " + (190 + i * 38) + " " + (260 - i * 25) + " " + (170 + i * 36) + " " + (292 - i * 30) +
                 '" stroke="#9c6526" stroke-width="5" fill="none"/>';
      }
      var grapes = "";
      [[138, 150], [158, 150], [178, 152], [148, 168], [168, 170], [158, 187], [138, 185]].forEach(function (p) {
        grapes += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="12" fill="#6c3483" stroke="#4a235a" stroke-width="2"/>';
      });
      return svg("0 0 500 340",
        '<ellipse cx="250" cy="312" rx="240" ry="22" fill="rgba(40,15,5,.45)"/>' +
        '<path d="M170 140 C280 115 380 140 450 70 C462 58 480 70 468 86 C420 190 300 290 170 300 Z" fill="#c98b3f"/>' +
        weave +
        '<ellipse cx="170" cy="220" rx="46" ry="80" fill="#6b3d16"/>' +
        grapes +
        '<path d="M120 205 L60 150 C70 135 90 140 95 150 Z" fill="#f2c232" stroke="#c99a1a" stroke-width="3"/>' +
        '<path d="M120 205 C95 170 70 160 55 140 M120 205 C108 168 98 150 88 138" stroke="#a7b24a" stroke-width="6" fill="none"/>' +
        pumpkin(95, 270, 80, 60, "#e8751a", "#b8530c") +
        '<circle cx="175" cy="262" r="32" fill="#c0392b"/><ellipse cx="165" cy="250" rx="8" ry="12" fill="rgba(255,255,255,.3)"/>' +
        '<path d="M175 230 L178 216" stroke="#5a3a1a" stroke-width="4"/>' +
        '<path d="M222 215 C240 210 248 250 238 275 C232 295 205 295 200 275 C194 252 205 220 222 215 Z" fill="#c7c544"/>' +
        '<path d="M222 215 L226 200" stroke="#5a3a1a" stroke-width="4"/>' +
        '<g transform="translate(30 270) rotate(-30) scale(.45)">' + leafSvg(MAPLE, "#d35400", 4) + "</g>"
      );
    },

    // 5. Leaf wreath
    function () {
      var ring = "";
      var n = 18;
      for (var i = 0; i < n; i++) {
        var a = (i / n) * 360;
        var rad = (a - 90) * Math.PI / 180;
        var x = 200 + Math.cos(rad) * 125, y = 180 + Math.sin(rad) * 125;
        ring += '<g transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + (a + 20) +
                ') scale(.62) translate(-50 -50)">' +
                leafSvg(i % 3 === 2 ? OVAL_LEAF : MAPLE, LEAF_COLORS[i % LEAF_COLORS.length], 3) + "</g>";
      }
      return svg("0 0 400 360",
        '<circle cx="200" cy="180" r="125" fill="none" stroke="#6b3d16" stroke-width="10"/>' +
        ring +
        '<text x="200" y="160" text-anchor="middle" font-family="Georgia, DejaVu Serif, serif" font-size="30" fill="#f8d58a">Thankful</text>' +
        '<text x="200" y="198" text-anchor="middle" font-family="Georgia, DejaVu Serif, serif" font-size="30" fill="#fff4e0" font-style="italic">Grateful</text>' +
        '<text x="200" y="236" text-anchor="middle" font-family="Georgia, DejaVu Serif, serif" font-size="30" fill="#f3b33d">Blessed</text>'
      );
    }
  ];

  /* ---------------- Build the slide list ---------------- */
  var stage = document.getElementById("stage");
  var slides = [];

  function addScene(i) {
    var el = document.createElement("section");
    el.className = "slide";
    el.innerHTML = scenes[i]() + '<p class="caption"></p>';
    el.querySelector(".caption").textContent = captions[i] || "";
    stage.appendChild(el);
    slides.push(el);
  }

  function addPhoto(src) {
    var el = document.createElement("section");
    el.className = "slide photo";
    el.innerHTML = '<div class="frame"><img alt=""></div>';
    el.dataset.src = src;
    stage.appendChild(el);
    slides.push(el);
  }

  var total = Math.max(scenes.length, photos.length);
  for (var i = 0; i < total; i++) {
    addScene(i % scenes.length);
    if (i < photos.length) addPhoto(photos[i]);
  }

  /* ---------------- Slideshow ---------------- */
  var current = -1, timer = null;

  function prepare(idx) {
    var s = slides[idx];
    if (s && s.dataset.src) {
      var img = s.querySelector("img");
      if (!img.getAttribute("src")) {
        img.onerror = function () { s.dataset.broken = "1"; };
        img.src = s.dataset.src;
      }
    }
  }

  function show(idx) {
    idx = (idx + slides.length) % slides.length;
    // Skip photos that failed to load
    for (var guard = 0; slides[idx].dataset.broken && guard < slides.length; guard++) {
      idx = (idx + 1) % slides.length;
    }
    if (current >= 0) slides[current].classList.remove("active");
    current = idx;
    var img = slides[idx].querySelector(".photo img, img");
    if (img) { img.style.animation = "none"; void img.offsetWidth; img.style.animation = ""; }
    slides[idx].classList.add("active");
    prepare((idx + 1) % slides.length);
    clearTimeout(timer);
    timer = setTimeout(function () { show(current + 1); }, seconds * 1000);
  }

  // Arrow keys / space let you step through by hand if a keyboard is attached.
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " ") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  prepare(0);
  show(0);

  /* ---------------- Falling leaves ---------------- */
  var leafLayer = document.getElementById("leaves");
  var leafCount = Math.min(60, Math.max(0, Number(cfg.fallingLeaves) || 0));
  for (var k = 0; k < leafCount; k++) {
    var size = 2.2 + Math.random() * 3.2;            // in vh
    var leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.left = (Math.random() * 100) + "vw";
    leaf.style.width = leaf.style.height = size + "vh";
    leaf.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);
    leaf.style.animationDuration = (12 + Math.random() * 14).toFixed(1) + "s";
    leaf.style.animationDelay = (-Math.random() * 26).toFixed(1) + "s";
    leaf.style.setProperty("--drift", ((Math.random() - 0.5) * 30).toFixed(1) + "vw");
    leaf.style.setProperty("--spin", ((Math.random() - 0.5) * 720).toFixed(0) + "deg");
    leaf.innerHTML = '<svg viewBox="0 0 100 100" style="animation-delay:' + (-Math.random() * 3.5).toFixed(1) + 's">' +
      leafSvg(Math.random() < 0.65 ? MAPLE : OVAL_LEAF, LEAF_COLORS[k % LEAF_COLORS.length], 3) + "</svg>";
    leafLayer.appendChild(leaf);
  }

  // Reload once a day so the screen stays fresh if it runs for days.
  setTimeout(function () { location.reload(); }, 24 * 60 * 60 * 1000);
})();

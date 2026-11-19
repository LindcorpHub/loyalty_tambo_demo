/* ==========================================================================
   Router y shell de la maqueta.
   - Rutas por hash: #/a1, #/b1, #/c2/pilsen …
   - Cada pantalla se registra con CT.screen({...}) desde js/screens/*.js
   ========================================================================== */
window.CT = window.CT || {};

/* Índice de pantallas (orden del Figma). id = ruta. */
CT.index = [
  { group: "Acceso", items: [
    { id: "a1", code: "A1", title: "Iniciar sesión" },
    { id: "a2", code: "A2", title: "Crear cuenta" },
    { id: "a3", code: "A3", title: "Completar registro (Google / Apple)" },
    { id: "a4", code: "A4", title: "Recuperar contraseña" },
    { id: "a5", code: "A5", title: "Bienvenida" },
  ]},
  { group: "Inicio y tarjeta", items: [
    { id: "b1", code: "B1", title: "Inicio" },
    { id: "b2", code: "B2", title: "Mi tarjeta (iPhone)" },
    { id: "b2-android", code: "B2", title: "Mi tarjeta (Android)" },
    { id: "b2-cupones", code: "B2", title: "Caja: cupones" },
  ]},
  { group: "Visitas", items: [
    { id: "r1", code: "R1", title: "Visitas" },
    { id: "r2", code: "R2", title: "Mis visitas" },
    { id: "r3", code: "R3", title: "Sorpresa desbloqueada" },
  ]},
  { group: "Cupones", items: [
    { id: "c1", code: "C1", title: "Mis cupones" },
    { id: "c2", code: "C2", title: "Detalle del cupón" },
    { id: "c3", code: "C3", title: "Usados y vencidos" },
  ]},
  { group: "Perfil", items: [
    { id: "e1", code: "E1", title: "Mi perfil" },
    { id: "e2", code: "E2", title: "Eliminar cuenta" },
    { id: "e3", code: "E3", title: "Editar mis datos" },
  ]},
  { group: "Estados", items: [
    { id: "s1", code: "S1", title: "Inicio cargando" },
    { id: "s2", code: "S2", title: "Cupones vacío" },
    { id: "s3", code: "S3", title: "Inicio sin conexión" },
    { id: "s4", code: "S4", title: "Registro con errores" },
    { id: "s5", code: "S5", title: "Inicio con resultado" },
    { id: "s6", code: "S6", title: "Aún sin visitas" },
    { id: "s7", code: "S7", title: "Nuevo periodo" },
  ]},
];

CT.screens = {};

/* Registro de pantalla.
   def: {
     id, top: "brand"|"canvas"|"surface"|"yellow", bg (color de fondo del scroll),
     tab: "inicio"|"beneficios"|"tarjeta"|"visitas"|"perfil"|null,
     note: "texto para la nota del presentador",
     render(ctx) -> html del contenido con scroll,
     foot(ctx)  -> html opcional fijo abajo (botones),
     overlay(ctx) -> html opcional por encima (hoja/diálogo ya abiertos),
     mount(root, ctx) -> función opcional de limpieza
   } */
CT.screen = function (def) {
  CT.screens[def.id] = def;
};

(function () {
  var flat = [];
  CT.index.forEach(function (g) {
    g.items.forEach(function (it) {
      it.group = g.group;
      flat.push(it);
    });
  });
  CT.flat = flat;

  var app, current = null, currentId = null, stack = [], navDir = null, cleanup = null;

  function meta(id) {
    for (var i = 0; i < flat.length; i++) if (flat[i].id === id) return flat[i];
    return null;
  }

  function parseHash() {
    var h = (location.hash || "").replace(/^#\/?/, "");
    var parts = h.split("/").filter(Boolean);
    return { id: parts[0] || "a1", params: parts.slice(1) };
  }

  /* ---------------- Contexto para las pantallas ---------------- */
  var ctx = {
    data: CT.data,
    ui: CT.ui,
    go: function (route) { navDir = "push"; location.hash = "#/" + route; },
    tab: function (route) { navDir = "fade"; location.hash = "#/" + route; },
    back: function () { CT.back(); },
    toast: function (msg, icon) { CT.toast(msg, icon); },
    layer: function (html, opts) { return CT.layer(html, opts); },
    closeLayer: function () { CT.closeLayer(); },
  };

  /* ---------------- Construcción de una pantalla ---------------- */
  function build(id, params) {
    var def = CT.screens[id];
    var m = meta(id) || { code: "", title: id };
    var c = Object.assign({}, ctx, { params: params, id: id });
    var el = document.createElement("section");
    el.className = "scr";
    el.setAttribute("data-screen", id);
    el.setAttribute("aria-label", m.code + " · " + m.title);

    if (!def) {
      el.setAttribute("data-top", "canvas");
      el.innerHTML =
        CT.ui.statusBar() +
        '<div class="scr-scroll"><div class="px" style="padding-top:120px;text-align:center">' +
        '<p class="t-xl">' + m.code + "</p><p class=\"t-body c-secondary\">" + m.title + "</p>" +
        '<p class="t-note c-tertiary" style="margin-top:12px">Pantalla en construcción</p></div></div>' +
        CT.ui.homeIndicator();
      return { el: el, def: null, ctx: c };
    }

    el.setAttribute("data-top", def.top || "canvas");
    if (def.bottom) el.setAttribute("data-bottom", def.bottom);
    if (def.bg) el.style.setProperty("--scr-bg", def.bg);
    if (def.cls) el.className += " " + def.cls;

    var body = def.render ? def.render(c) : "";
    var html = CT.ui.statusBar() + '<div class="scr-scroll">' + body + "</div>";
    if (def.foot) html += '<div class="scr-foot">' + def.foot(c) + "</div>";
    if (def.tab !== undefined && def.tab !== null) html += CT.ui.tabbar(def.tab);
    if (def.overlay) html += def.overlay(c);
    html += CT.ui.homeIndicator();
    el.innerHTML = html;
    if (def.tab !== undefined && def.tab !== null) el.classList.add("has-tabbar");
    if (def.foot) el.classList.add("has-foot");
    return { el: el, def: def, ctx: c };
  }

  function themeColor(top) {
    var map = { brand: "#af1380", canvas: "#f7f2f6", surface: "#ffffff", yellow: "#ffee0c" };
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", map[top] || map.canvas);
  }

  function render() {
    var r = parseHash();
    var id = CT.screens[r.id] || meta(r.id) ? r.id : "a1";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // dirección de la transición
    var dir = navDir;
    navDir = null;
    if (!dir) {
      var prevIdx = stack.lastIndexOf(id);
      if (prevIdx > -1 && prevIdx === stack.length - 2) dir = "pop";
      else dir = current ? "fade" : null;
    }
    if (dir === "pop") stack.pop();
    else if (stack[stack.length - 1] !== id) stack.push(id);
    if (stack.length > 40) stack = stack.slice(-40);

    if (typeof cleanup === "function") { try { cleanup(); } catch (e) {} }
    cleanup = null;
    CT.closeLayer(true);

    var built = build(id, r.params);
    var el = built.el;
    var old = current;

    app.appendChild(el);
    if (old && dir && !reduce) {
      el.classList.add("enter-" + dir);
      old.classList.add("leave-" + dir);
      var done = function () {
        if (old.parentNode) old.parentNode.removeChild(old);
        el.classList.remove("enter-" + dir);
      };
      el.addEventListener("animationend", function h(e) {
        if (e.target !== el) return;
        el.removeEventListener("animationend", h);
        done();
      });
      setTimeout(done, 520);
    } else if (old && old.parentNode) {
      old.parentNode.removeChild(old);
    }

    current = el;
    currentId = id;
    themeColor(el.getAttribute("data-top"));

    if (built.def && built.def.mount) {
      try { cleanup = built.def.mount(el, built.ctx) || null; } catch (e) { console.error(e); }
    }

    updateRail(id, built.def);
    document.title = (meta(id) ? meta(id).code + " · " + meta(id).title + " — " : "") + "Club Tambero · Maqueta";
  }

  CT.back = function () {
    if (stack.length > 1) {
      navDir = "pop";
      location.hash = "#/" + stack[stack.length - 2];
    } else {
      navDir = "pop";
      location.hash = "#/b1";
    }
  };

  /* ---------------- Capas ---------------- */
  CT.layer = function (html, opts) {
    opts = opts || {};
    CT.closeLayer(true);
    if (!current) return null;
    var l = document.createElement("div");
    l.className = "layer" + (opts.center ? " layer--center" : "");
    l.setAttribute("data-layer", "");
    l.innerHTML = html;
    l.addEventListener("click", function (e) {
      if (e.target === l && opts.dismiss !== false) CT.closeLayer();
    });
    current.appendChild(l);
    var focusable = l.querySelector("button, a, input");
    if (focusable) setTimeout(function () { focusable.focus({ preventScroll: true }); }, 60);
    return l;
  };

  CT.closeLayer = function (instant) {
    if (!current) return;
    var layers = current.querySelectorAll("[data-layer]");
    layers.forEach(function (l) {
      if (instant) return l.remove();
      l.classList.add("is-closing");
      setTimeout(function () { l.remove(); }, 240);
    });
  };

  var toastTimer;
  CT.toast = function (msg, icon) {
    if (!current) return;
    var old = current.querySelector(".toast");
    if (old) old.remove();
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.innerHTML = CT.icon(icon || "check_circle", 20) + "<span>" + msg + "</span>";
    if (!current.classList.contains("has-tabbar")) t.style.bottom = "calc(var(--home-h) + 24px)";
    current.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.add("is-closing");
      setTimeout(function () { t.remove(); }, 220);
    }, 2400);
  };

  /* ---------------- Delegación de eventos ---------------- */
  function onClick(e) {
    var t = e.target;
    var go = t.closest("[data-go]");
    if (go) {
      e.preventDefault();
      var route = go.getAttribute("data-go");
      var mode = go.getAttribute("data-nav") || "push";
      navDir = mode;
      location.hash = "#/" + route;
      return;
    }
    var back = t.closest("[data-back]");
    if (back) {
      e.preventDefault();
      CT.back();
      return;
    }
    var close = t.closest("[data-close-layer]");
    if (close) {
      e.preventDefault();
      CT.closeLayer();
      return;
    }
    var tg = t.closest("[data-toast]");
    if (tg) {
      e.preventDefault();
      CT.toast(tg.getAttribute("data-toast"), tg.getAttribute("data-toast-icon"));
      return;
    }
    var pass = t.closest("[data-toggle-pass]");
    if (pass) {
      var inp = document.getElementById(pass.getAttribute("data-toggle-pass"));
      if (inp) {
        var show = inp.type === "password";
        inp.type = show ? "text" : "password";
        pass.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
        pass.style.color = show ? "var(--icon-brand)" : "";
      }
      return;
    }
    var sw = t.closest(".switch[role='switch']");
    if (sw) {
      var on = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", on ? "true" : "false");
      sw.dispatchEvent(new CustomEvent("switch", { bubbles: true, detail: { on: on } }));
      return;
    }
    // pestañas de la barra inferior y segmentados: transición suave
    var tab = t.closest(".tab, .seg-item, .rail-link");
    if (tab) navDir = "fade";
  }

  /* ---------------- Riel / nota del presentador ---------------- */
  function buildRail() {
    var nav = document.getElementById("rail-nav");
    var html = "";
    CT.index.forEach(function (g) {
      html += '<div class="rail-group"><p class="rail-group-title">' + g.group + "</p>";
      g.items.forEach(function (it) {
        html += '<a class="rail-link" href="#/' + it.id + '" data-rail="' + it.id + '"><span class="rail-code">' + it.code + "</span><span>" + it.title + "</span></a>";
      });
      html += "</div>";
    });
    nav.innerHTML = html;
  }

  function updateRail(id, def) {
    document.querySelectorAll(".rail-link").forEach(function (a) {
      var on = a.getAttribute("data-rail") === id;
      if (on) {
        a.setAttribute("aria-current", "true");
        var nav = document.getElementById("rail-nav");
        var r = a.getBoundingClientRect(), n = nav.getBoundingClientRect();
        if (r.top < n.top + 8 || r.bottom > n.bottom - 8) a.scrollIntoView({ block: "center", behavior: "smooth" });
      } else a.removeAttribute("aria-current");
    });
    var m = meta(id) || { code: "", title: id, group: "" };
    var notes = document.getElementById("notes");
    if (!notes) return;
    var i = flat.indexOf(m);
    var prev = flat[i - 1], next = flat[i + 1];
    notes.innerHTML =
      '<span class="notes-code">' + m.code + "</span>" +
      '<p class="notes-group">' + (m.group || "") + "</p>" +
      '<h2 class="notes-title">' + m.title + "</h2>" +
      '<p class="notes-text">' + ((def && def.note) || "Toca el teléfono para navegar como lo haría un socio.") + "</p>" +
      '<div class="notes-nav">' +
      (prev ? '<a class="btn btn--secondary" href="#/' + prev.id + '">' + CT.icon("back", 18) + "<span>" + prev.code + "</span></a>" : "") +
      (next ? '<a class="btn btn--primary" href="#/' + next.id + '"><span>' + next.code + " · " + next.title + "</span>" + CT.icon("arrow_r", 18) + "</a>" : "") +
      "</div>" +
      '<p class="notes-hint"><span class="kbd">←</span> <span class="kbd">→</span> para recorrer las pantallas</p>' +
      '<p class="notes-badge">Datos ficticios · sin conexión a servicios</p>';
  }

  /* ---------------- Escala del teléfono y modo nativo ---------------- */
  function isNative() {
    var narrow = Math.min(window.innerWidth, screen.width) <= 520;
    var coarse = window.matchMedia("(pointer: coarse)").matches;
    return narrow && (coarse || window.innerWidth <= 520);
  }

  function fit() {
    if (/[?&]captura\b/.test(location.search)) {
      document.documentElement.classList.add("is-shot");
      return;
    }
    var native = isNative();
    document.documentElement.classList.toggle("is-native", native);
    if (native) return;
    var wrap = document.querySelector(".device-wrap");
    if (!wrap) return;
    var h = wrap.clientHeight, w = wrap.clientWidth;
    var s = Math.min(1, (h - 40) / (844 + 24), (w - 32) / (390 + 24));
    document.documentElement.style.setProperty("--scale", Math.max(0.5, s).toFixed(3));
  }

  /* ---------------- Cajón ---------------- */
  function drawer(open) {
    var rail = document.querySelector(".rail");
    var scrim = document.getElementById("drawer-scrim");
    rail.classList.toggle("is-open", open);
    scrim.hidden = !open;
  }

  function onKey(e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "Escape") { CT.closeLayer(); drawer(false); return; }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var i = flat.indexOf(meta(currentId));
    if (e.key === "ArrowRight" && flat[i + 1]) { navDir = "fade"; location.hash = "#/" + flat[i + 1].id; }
    if (e.key === "ArrowLeft" && flat[i - 1]) { navDir = "fade"; location.hash = "#/" + flat[i - 1].id; }
  }

  /* ---------------- Inicio ---------------- */
  function boot() {
    app = document.getElementById("app");
    buildRail();
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("hashchange", render);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    document.getElementById("drawer-handle").addEventListener("click", function () { drawer(true); });
    document.getElementById("drawer-scrim").addEventListener("click", function () { drawer(false); });
    document.getElementById("rail-nav").addEventListener("click", function (e) {
      if (e.target.closest(".rail-link")) drawer(false);
    });
    // Enter/espacio en formularios: los submits los maneja cada pantalla
    document.addEventListener("submit", function (e) { e.preventDefault(); });
    render();
    document.documentElement.classList.add("is-ready");
  }

  // Arranca cuando todas las pantallas (scripts siguientes) ya se registraron
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else setTimeout(boot, 0);
})();

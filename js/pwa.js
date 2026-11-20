/* ==========================================================================
   PWA de la maqueta: invitación a instalar y notificaciones de ejemplo.

   Instalar
   - Android (Chrome, Edge, Samsung): se instala con un toque gracias al evento
     beforeinstallprompt. Si el navegador no lo ofrece, se muestran los pasos.
   - iPhone: Safari no permite instalar desde un botón; se muestran los pasos
     (Compartir → Agregar a inicio).
   - La invitación aparece una sola vez, en el celular y solo en el navegador:
     instalada (pantalla completa) nunca se muestra.

   Notificaciones
   - Tocar una visita (R1/R2) envía una notificación real al celular. No hay
     backend: la arma el propio teléfono con el service worker, y se ve igual
     que un push enviado desde el servidor.
   - Antes del permiso del sistema se muestra una hoja propia que explica para
     qué sirve. En la computadora (vista de presentador) se simula dentro del
     teléfono.
   ========================================================================== */
window.CT = window.CT || {};

(function () {
  var ua = navigator.userAgent || "";
  var KEY_INVITE = "ct-invitacion-app"; // ya se mostró la invitación automática
  var KEY_HAVE = "ct-app-instalada"; // la socia dijo que ya la tiene (iPhone no lo puede detectar)
  var deferred = null; // beforeinstallprompt guardado para instalar con un toque
  var installed = false; // instalada en este dispositivo (detectado)
  var simGranted = false; // permiso simulado en la vista de presentador

  /* --------------------------- Íconos adicionales ---------------------------
     No están en el set del Figma; mismo lenguaje (24 px, trazo 2, puntas redondas). */
  function svg(paths) {
    return (
      '<svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + "</g></svg>"
    );
  }
  var EXTRA = {
    bell: svg('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
    share: svg('<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>'),
    square_plus: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/>'),
    dots: svg('<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'),
    dots_v: svg('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>'),
    download: svg('<path d="M12 15V3"/><path d="M7 10l5 5 5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>'),
  };
  for (var k in EXTRA) if (!CT.icons[k]) CT.icons[k] = EXTRA[k];

  /* ------------------------------ Entorno ------------------------------ */
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} },
  };

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  function isAndroid() { return /Android/i.test(ua); }
  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }
  function isPhone() { return document.documentElement.classList.contains("is-native"); }
  function isShot() { return document.documentElement.classList.contains("is-shot"); }
  function isWeb() { return /^https?:$/.test(location.protocol); }
  function hasApp() { return isStandalone() || installed || store.get(KEY_HAVE) === "1"; }
  function supportsNotif() { return "Notification" in window && "serviceWorker" in navigator && isWeb(); }

  function refreshEntries() {
    document.documentElement.classList.toggle("has-app", hasApp());
  }

  // Android / escritorio con Chrome: guarda el evento para instalar con un toque
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
  });
  window.addEventListener("appinstalled", function () {
    deferred = null;
    installed = true;
    refreshEntries();
    CT.closeLayer && CT.closeLayer();
    CT.toast && CT.toast("¡Listo! Club Tambero ya está en tu pantalla de inicio", "check_circle");
  });
  // Chrome en Android puede decir si la app ya está instalada (manifest: related_applications)
  if (navigator.getInstalledRelatedApps) {
    navigator.getInstalledRelatedApps().then(function (list) {
      if (list && list.length) { installed = true; refreshEntries(); }
    }).catch(function () {});
  }
  // Al tocar una notificación con la app abierta, el service worker pide ir a la pantalla
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", function (e) {
      if (e.data && e.data.type === "ct-open" && e.data.hash) location.hash = e.data.hash;
    });
  }

  var ui = function () { return CT.ui; };
  function I(n, s) { return CT.icon(n, s); }
  function esc(s) { return CT.ui.esc(s); }

  /* ------------------------------ Piezas ------------------------------ */
  function appRow(sub) {
    return (
      '<div class="pwa-app">' +
      '<img class="pwa-app-icon" src="assets/pwa/icon-192.png" width="56" height="56" alt="">' +
      '<div class="pwa-app-copy"><p class="pwa-app-name">Club Tambero</p><p class="pwa-app-sub">' + sub + "</p></div>" +
      "</div>"
    );
  }

  function key(icon, label) {
    return '<span class="pwa-key">' + I(icon, 16) + (label ? "<span>" + label + "</span>" : "") + "</span>";
  }

  function steps(items) {
    return (
      '<ol class="pwa-steps">' +
      items.map(function (s, i) {
        return (
          '<li><span class="pwa-step-num">' + (i + 1) + "</span>" +
          '<span class="pwa-step-copy"><span class="pwa-step-main">' + s[0] + "</span>" +
          (s[1] ? '<span class="pwa-step-sub">' + s[1] + "</span>" : "") +
          "</span></li>"
        );
      }).join("") +
      "</ol>"
    );
  }

  /* ---------------------------- Hojas de instalar ---------------------------- */
  function sheetInstallTap() {
    return (
      '<section class="sheet pwa-sheet" role="dialog" aria-modal="true" aria-labelledby="pwa-t">' +
      appRow("Se instala desde tu navegador, sin pasar por la tienda de apps") +
      '<h2 class="t-xl pwa-title" id="pwa-t">Lleva el Club en tu celular</h2>' +
      '<ul class="pwa-perks">' +
      '<li><span class="tile tile--yellow">' + I("barcode", 20) + "</span><span>Tu código del Club a un toque</span></li>" +
      '<li><span class="tile">' + I("wifi_off", 20) + "</span><span>Se abre aunque no tengas señal en la tienda</span></li>" +
      '<li><span class="tile">' + I("bell", 20) + "</span><span>Avisos de tus visitas, cupones y premios</span></li>" +
      "</ul>" +
      ui().btn({ text: "Instalar app", block: true, iconHtml: I("download", 20), attrs: { "data-pwa-do": "install" } }) +
      '<button type="button" class="link pwa-later" data-close-layer>Ahora no</button>' +
      "</section>"
    );
  }

  function sheetInstallIOS() {
    return (
      '<section class="sheet pwa-sheet" role="dialog" aria-modal="true" aria-labelledby="pwa-t">' +
      appRow("Agrégala a tu pantalla de inicio desde Safari") +
      '<h2 class="t-xl pwa-title" id="pwa-t">Instala la app en tu iPhone</h2>' +
      '<p class="t-body c-secondary pwa-text">En iPhone se instala desde Safari, en 3 pasos:</p>' +
      steps([
        ["Toca " + key("share", "Compartir"), "Si no lo ves, toca primero " + key("dots") + " junto a la barra de direcciones."],
        ["Desliza hacia abajo y elige " + key("square_plus", "Agregar a inicio")],
        ["Deja activado <b>Abrir como app web</b> y toca <b>Agregar</b>", "Club Tambero aparecerá en tu pantalla de inicio."],
      ]) +
      ui().btn({ text: "Entendido", block: true, attrs: { "data-close-layer": "" } }) +
      '<button type="button" class="link pwa-later" data-pwa-do="have">Ya la tengo instalada</button>' +
      '<p class="pwa-foot">' + I("info", 16) + "<span>¿Abriste el enlace desde WhatsApp u otra app? Ábrelo primero en Safari.</span></p>" +
      "</section>"
    );
  }

  function sheetInstallSteps() {
    return (
      '<section class="sheet pwa-sheet" role="dialog" aria-modal="true" aria-labelledby="pwa-t">' +
      appRow("Se instala desde tu navegador, sin pasar por la tienda de apps") +
      '<h2 class="t-xl pwa-title" id="pwa-t">Instala la app en tu celular</h2>' +
      steps([
        ["Toca el menú " + key("dots_v") + " de tu navegador", "En Chrome está arriba a la derecha."],
        ["Elige <b>Instalar app</b> o <b>Agregar a la pantalla principal</b>"],
        ["Confirma con <b>Instalar</b>", "Club Tambero aparecerá en tu pantalla de inicio."],
      ]) +
      ui().btn({ text: "Entendido", block: true, attrs: { "data-close-layer": "" } }) +
      '<button type="button" class="link pwa-later" data-pwa-do="have">Ya la tengo instalada</button>' +
      '<p class="pwa-foot">' + I("info", 16) + "<span>¿Abriste el enlace desde WhatsApp u otra app? Ábrelo primero en Chrome.</span></p>" +
      "</section>"
    );
  }

  function installSheet() {
    if (isIOS()) return sheetInstallIOS();
    if (deferred || !isPhone()) return sheetInstallTap();
    return sheetInstallSteps();
  }

  function doInstall(btn) {
    if (deferred) {
      var ev = deferred;
      deferred = null; // prompt() solo se puede usar una vez por evento
      btn && btn.classList.add("is-loading");
      ev.prompt();
      ev.userChoice.then(function (c) {
        btn && btn.classList.remove("is-loading");
        if (c && c.outcome === "accepted") {
          installed = true;
          refreshEntries();
          CT.closeLayer();
        } else {
          CT.toast("Puedes instalarla cuando quieras desde tu Perfil", "info");
          CT.closeLayer();
        }
      }).catch(function () { btn && btn.classList.remove("is-loading"); });
      return;
    }
    if (!isPhone()) {
      CT.toast("Abre este enlace en tu celular para instalarla", "phone");
      return;
    }
    // Sin instalación con un toque (Firefox, apps de mensajería…): pasos
    openLayer(isIOS() ? sheetInstallIOS() : sheetInstallSteps());
  }

  /* ------------------------- Notificación de ejemplo ------------------------- */
  // Datos de la notificación a partir de la fila de visita tocada
  function visitNotif(v) {
    var D = CT.data, vis = D.visitas;
    var tienda = String(v.titulo || "").replace(/^(Compra|Devolución) en /, "");
    var monto = (String(v.detalle || "").split("·")[1] || "").trim();
    var avance = "Vas " + vis.acumuladas + " de " + vis.meta + " visitas";
    if (v.tipo === "devolucion") {
      return {
        title: "Se anuló 1 visita",
        body: "La devolución en " + tienda + " anuló una compra. " + avance + ".",
        url: "./#/r2",
      };
    }
    return {
      title: "¡Sumaste 1 visita!",
      body: "Tu compra en " + tienda + (monto ? " (" + monto + ")" : "") + " ya cuenta. " + avance + ": te faltan " + vis.faltan + " para tu premio.",
      url: "./#/r1",
    };
  }

  function notifCard(n, cls) {
    return (
      '<div class="notif' + (cls ? " " + cls : "") + '">' +
      '<img class="notif-icon" src="assets/pwa/icon-192.png" width="38" height="38" alt="">' +
      '<div class="notif-copy">' +
      '<p class="notif-head"><span class="notif-title">' + esc(n.title) + '</span><span class="notif-time">ahora</span></p>' +
      '<p class="notif-body">' + esc(n.body) + "</p>" +
      "</div></div>"
    );
  }

  // Banner dentro del teléfono (presentador o navegador sin notificaciones)
  var bannerTimer;
  function banner(n) {
    var app = document.getElementById("app");
    if (!app) return;
    var old = app.querySelector(".notif-banner");
    if (old) old.remove();
    var b = document.createElement("button");
    b.type = "button";
    b.className = "notif-banner";
    b.setAttribute("aria-label", "Notificación de Club Tambero: " + n.title + ". " + n.body);
    b.innerHTML = notifCard(n);
    function hide() {
      clearTimeout(bannerTimer);
      b.classList.add("is-closing");
      setTimeout(function () { b.remove(); }, 260);
    }
    b.addEventListener("click", function () {
      hide();
      var h = n.url.replace(/^\.\//, "");
      if (location.hash !== h) location.hash = h;
    });
    app.appendChild(b);
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(hide, 6000);
  }

  // Notificación real del sistema (Android / iPhone con la app instalada)
  function send(n) {
    var opts = {
      body: n.body,
      icon: new URL("assets/pwa/icon-192.png", location.href).href,
      badge: new URL("assets/pwa/badge-96.png", location.href).href,
      tag: "ct-visita",
      renotify: true,
      lang: "es-PE",
      timestamp: Date.now(),
      vibrate: [80, 40, 80],
      data: { url: n.url },
    };
    CT.toast("Enviando tu notificación…", "bell");
    setTimeout(function () {
      // Espera al service worker activo (en la primera visita puede tardar un instante)
      Promise.race([
        navigator.serviceWorker.ready,
        new Promise(function (_, no) { setTimeout(function () { no(new Error("sin service worker")); }, 4000); }),
      ]).then(function (reg) {
        return reg.showNotification(n.title, opts);
      }).then(function () {
        CT.toast(
          isIOS() ? "Listo. Si no la ves arriba, desliza hacia abajo desde el borde superior" : "Listo: revisa tu barra de notificaciones",
          "check_circle"
        );
      }).catch(function () {
        banner(n);
      });
    }, 900);
  }

  function askPermission(n) {
    var done = false;
    function result(r) {
      if (done) return;
      done = true;
      if (r === "granted") { CT.closeLayer(); send(n); return; }
      CT.closeLayer();
      if (r === "denied") CT.toast("Entendido: no te enviaremos notificaciones", "bell_off");
    }
    try {
      // Debe llamarse directo en el toque (iPhone lo exige)
      var p = Notification.requestPermission(result);
      if (p && p.then) p.then(result);
    } catch (e) {
      result("default");
    }
  }

  /* Hoja propia antes del permiso del sistema */
  function sheetSoftAsk(n) {
    return (
      '<section class="sheet push-sheet" role="dialog" aria-modal="true" aria-labelledby="push-t" aria-describedby="push-d">' +
      '<div class="push-preview" aria-hidden="true">' + notifCard(n, "notif--static") + "</div>" +
      '<h2 class="t-xl pwa-title" id="push-t">¿Te avisamos al momento?</h2>' +
      '<p class="t-body c-secondary pwa-text" id="push-d">Activa las notificaciones y entérate cuando sumes una visita, cuando un cupón esté por vencer y cuando desbloquees un premio.</p>' +
      ui().btn({ text: "Activar notificaciones", block: true, iconHtml: I("bell", 20), attrs: { "data-pwa-do": "allow" } }) +
      '<button type="button" class="link pwa-later" data-close-layer>Ahora no</button>' +
      '<p class="pwa-foot pwa-foot--center">Puedes desactivarlas cuando quieras desde los ajustes de tu celular.</p>' +
      "</section>"
    );
  }

  /* Permiso bloqueado: cómo reactivarlo */
  function sheetBlocked() {
    var how;
    if (isIOS()) {
      how = steps([
        ["Abre <b>Ajustes</b> en tu iPhone"],
        ["Entra a <b>Notificaciones</b> y elige <b>Club Tambero</b>"],
        ["Activa <b>Permitir notificaciones</b>"],
      ]);
    } else if (isAndroid() && isStandalone()) {
      how = steps([
        ["Mantén presionado el ícono de <b>Club Tambero</b>"],
        ["Toca <b>Información de la app</b> y luego <b>Notificaciones</b>"],
        ["Activa <b>Mostrar notificaciones</b>"],
      ]);
    } else {
      how = steps([
        ["Toca el ícono junto a la dirección de la página", "Es el candado o el de ajustes, a la izquierda del enlace."],
        ["Entra a <b>Permisos</b> y luego a <b>Notificaciones</b>"],
        ["Elige <b>Permitir</b> y vuelve a tocar una visita"],
      ]);
    }
    return (
      '<section class="sheet pwa-sheet" role="dialog" aria-modal="true" aria-labelledby="push-off-t">' +
      '<span class="tile tile--muted tile--lg pwa-sheet-tile">' + I("bell_off", 24) + "</span>" +
      '<h2 class="t-xl pwa-title" id="push-off-t">Tus notificaciones están desactivadas</h2>' +
      '<p class="t-body c-secondary pwa-text">Para recibir nuestros avisos, actívalas desde tu celular:</p>' +
      how +
      ui().btn({ text: "Entendido", block: true, attrs: { "data-close-layer": "" } }) +
      '<button type="button" class="link pwa-later" data-pwa-do="example">Ver un ejemplo aquí</button>' +
      "</section>"
    );
  }

  /* iPhone en Safari: las notificaciones solo llegan a la app instalada */
  function sheetIOSNeedsApp() {
    return (
      '<section class="sheet pwa-sheet" role="dialog" aria-modal="true" aria-labelledby="push-ios-t">' +
      '<span class="tile tile--lg pwa-sheet-tile">' + I("bell", 24) + "</span>" +
      '<h2 class="t-xl pwa-title" id="push-ios-t">Los avisos llegan a la app instalada</h2>' +
      '<p class="t-body c-secondary pwa-text">En iPhone, las notificaciones funcionan cuando Club Tambero está en tu pantalla de inicio. Instálala en 3 pasos, ábrela desde su ícono y vuelve a tocar una visita.</p>' +
      ui().btn({ text: "Ver cómo instalarla", block: true, iconHtml: I("download", 20), attrs: { "data-pwa-do": "ios-steps" } }) +
      '<button type="button" class="link pwa-later" data-pwa-do="example">Ver un ejemplo aquí</button>' +
      "</section>"
    );
  }

  /* --------------------------- Capas y acciones --------------------------- */
  var pending = null; // notificación en curso (para las hojas de permiso)

  function openLayer(html) {
    var l = CT.layer(html);
    if (l) wire(l);
    return l;
  }

  // Acciones de los botones de las hojas (también en las pantallas P1–P3)
  function wire(layer) {
    layer.addEventListener("click", function (e) {
      var b = e.target.closest("[data-pwa-do]");
      if (!b) return;
      var what = b.getAttribute("data-pwa-do");
      if (what === "install") doInstall(b);
      else if (what === "have") {
        store.set(KEY_HAVE, "1");
        refreshEntries();
        CT.closeLayer();
        CT.toast("Perfecto, ya no te lo volveremos a sugerir", "check_circle");
      } else if (what === "ios-steps") openLayer(sheetInstallIOS());
      else if (what === "example") { CT.closeLayer(); banner(pending || sample()); }
      else if (what === "allow") {
        var n = pending || sample();
        if (!isPhone() || !supportsNotif()) {
          // Presentador: el permiso se simula y la notificación aparece en el teléfono
          simGranted = true;
          CT.closeLayer();
          setTimeout(function () { banner(n); }, 450);
          return;
        }
        askPermission(n);
      }
    });
  }

  function sample() {
    return visitNotif(CT.data.movimientos[0]);
  }

  /* Punto de entrada al tocar una visita */
  function pushVisit(v) {
    var n = visitNotif(v);
    pending = n;
    if (!isPhone()) {
      // Computadora: todo se simula dentro del teléfono
      if (simGranted) banner(n);
      else openLayer(sheetSoftAsk(n));
      return;
    }
    if (!supportsNotif()) {
      if (isIOS() && !isStandalone()) { openLayer(sheetIOSNeedsApp()); return; }
      banner(n);
      CT.toast("Tu navegador no muestra notificaciones: así se vería", "info");
      return;
    }
    var p = Notification.permission;
    if (p === "granted") send(n);
    else if (p === "denied") openLayer(sheetBlocked());
    else openLayer(sheetSoftAsk(n));
  }

  /* Invitación automática: una vez, en el celular, en el navegador y sin la app */
  function canInvite() {
    return isWeb() && isPhone() && !isShot() && !hasApp() && !store.get(KEY_INVITE);
  }
  function maybeInvite(delay) {
    var timers = [], stopWait = null, cancelled = false;
    function show() {
      if (cancelled || !canInvite()) return;
      var cur = document.querySelector("#app .scr:last-child");
      if (cur && cur.querySelector("[data-layer]")) return; // no tapar otra hoja
      store.set(KEY_INVITE, String(Date.now()));
      openLayer(installSheet());
    }
    timers.push(setTimeout(function () {
      if (!canInvite()) return;
      // Chrome en Android habilita la instalación con un toque tras unos segundos de uso:
      // se espera ese aviso (hasta 20 s) para ofrecer el botón y no los pasos manuales
      if (isAndroid() && !deferred) {
        var onReady = function () { if (stopWait) stopWait(); timers.push(setTimeout(show, 300)); };
        window.addEventListener("beforeinstallprompt", onReady);
        stopWait = function () { window.removeEventListener("beforeinstallprompt", onReady); stopWait = null; };
        timers.push(setTimeout(function () { if (stopWait) stopWait(); show(); }, 20000));
        return;
      }
      show();
    }, delay == null ? 900 : delay));
    return function () {
      cancelled = true;
      timers.forEach(clearTimeout);
      if (stopWait) stopWait();
    };
  }

  // Botones "Instalar la app" (Perfil) y filas de visita (R1/R2)
  document.addEventListener("click", function (e) {
    var inst = e.target.closest("[data-pwa-install]");
    if (inst) {
      e.preventDefault();
      openLayer(installSheet());
      return;
    }
    var vis = e.target.closest("[data-push-visit]");
    if (vis) {
      e.preventDefault();
      pushVisit({
        tipo: vis.getAttribute("data-tipo"),
        titulo: vis.getAttribute("data-titulo"),
        detalle: vis.getAttribute("data-detalle"),
      });
    }
  });

  document.addEventListener("DOMContentLoaded", refreshEntries);

  CT.pwa = {
    isIOS: isIOS,
    hasApp: hasApp,
    maybeInvite: maybeInvite,
    wire: wire,
    sheets: {
      install: installSheet,
      installTap: sheetInstallTap,
      installIOS: sheetInstallIOS,
      softAsk: function () { pending = sample(); return sheetSoftAsk(pending); },
    },
  };
})();

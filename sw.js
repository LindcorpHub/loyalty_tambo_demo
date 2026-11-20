/* ==========================================================================
   Service worker de la maqueta Club Tambero.
   Red primero (siempre la versión más nueva si hay internet) y, sin conexión,
   la copia guardada: así la demo abre aunque no haya señal en la tienda.
   Sube VERSION cuando quieras forzar que los celulares limpien la copia vieja.
   ========================================================================== */
var VERSION = "ct-maqueta-v6";

var PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/tokens.css",
  "./css/base.css",
  "./css/components.css",
  "./css/shell.css",
  "./css/screens/acceso.css",
  "./css/screens/inicio.css",
  "./css/screens/visitas-cupones.css",
  "./css/screens/perfil.css",
  "./css/pwa.css",
  "./js/icons.js",
  "./js/data.js",
  "./js/ui.js",
  "./js/pwa.js",
  "./js/app.js",
  "./js/screens/acceso.js",
  "./js/screens/inicio.js",
  "./js/screens/visitas-cupones.js",
  "./js/screens/perfil.js",
  "./js/screens/app-instalable.js",
  "./assets/pwa/badge-96.png",
  "./assets/brand/logo-negativo.svg",
  "./assets/brand/logo-positivo.svg",
  "./assets/brand/favicon.svg",
  "./assets/img/barcode.svg",
  "./assets/img/google.svg",
  "./assets/pwa/icon-192.png",
  "./assets/pwa/icon-512.png",
  "./assets/img/acceso/bienvenida.png",
  "./assets/img/cupones/codigo-cupon.svg",
  "./assets/img/cupones/pilsen.png",
  "./assets/img/tarjeta/apple-wallet.svg",
  "./assets/img/tarjeta/google-wallet.svg",
  "./assets/pwa/apple-touch-icon.png",
  "./assets/pwa/icon-maskable-512.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(VERSION).then(function (cache) {
      // Si algún archivo falla no se bloquea la instalación: se guarda al usarse
      return Promise.all(
        PRECACHE.map(function (url) {
          return cache.add(url).catch(function () {});
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!sameOrigin && !isFont) return;

  event.respondWith(
    fetch(req)
      .then(function (res) {
        if (res && (res.ok || res.type === "opaque")) {
          var copy = res.clone();
          caches.open(VERSION).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      })
      .catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (hit) {
          if (hit) return hit;
          if (req.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        });
      })
  );
});

/* --------------------------------------------------------------------------
   Notificaciones.
   - "push": así se recibiría un push real del backend (Web Push con VAPID).
     El backend enviaría un JSON { title, body, url }; la maqueta no tiene
     backend, pero el manejador queda listo.
   - "notificationclick": abre la app (o la trae al frente) en la pantalla
     indicada; también para las notificaciones de ejemplo de las visitas.
   -------------------------------------------------------------------------- */
self.addEventListener("push", function (event) {
  var d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data ? event.data.text() : "" }; }
  event.waitUntil(
    self.registration.showNotification(d.title || "Club Tambero", {
      body: d.body || "",
      icon: "assets/pwa/icon-192.png",
      badge: "assets/pwa/badge-96.png",
      tag: d.tag || "ct-push",
      lang: "es-PE",
      data: { url: d.url || "./#/b1" },
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  var url = (event.notification.data && event.notification.data.url) || "./#/b1";
  var target = new URL(url, self.registration.scope);
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c.url.indexOf(self.registration.scope) === 0) {
          c.postMessage({ type: "ct-open", hash: target.hash });
          return c.focus ? c.focus() : null;
        }
      }
      return self.clients.openWindow ? self.clients.openWindow(target.href) : null;
    })
  );
});

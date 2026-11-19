/* ==========================================================================
   Service worker de la maqueta Club Tambero.
   Red primero (siempre la versión más nueva si hay internet) y, sin conexión,
   la copia guardada: así la demo abre aunque no haya señal en la tienda.
   Sube VERSION cuando quieras forzar que los celulares limpien la copia vieja.
   ========================================================================== */
var VERSION = "ct-maqueta-v1";

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
  "./js/icons.js",
  "./js/data.js",
  "./js/ui.js",
  "./js/app.js",
  "./js/screens/acceso.js",
  "./js/screens/inicio.js",
  "./js/screens/visitas-cupones.js",
  "./js/screens/perfil.js",
  "./assets/brand/logo-negativo.svg",
  "./assets/brand/logo-positivo.svg",
  "./assets/brand/favicon.svg",
  "./assets/img/barcode.svg",
  "./assets/img/google.svg",
  "./assets/pwa/icon-192.png",
  "./assets/pwa/icon-512.png",
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

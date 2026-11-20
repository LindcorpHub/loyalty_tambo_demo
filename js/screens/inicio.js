/* ==========================================================================
   3 · Inicio y tarjeta (B1–B2) y estados del Inicio (S1, S3, S5, S6, S7)
   Figma: sección "3 · Inicio y tarjeta (B1–B2)" · B1 608:2991,
   B2 iPhone 609:2991, B2 Android 610:2991, B2 Caja: cupones 611:2991.
   Sección "7 · Estados": S1 620:2991, S3 622:2991, S5 624:2991,
   S6 625:2991, S7 626:2991.
   ========================================================================== */
(function () {
  var ui = CT.ui, I = ui.I, D = CT.data;

  /* Piezas del Inicio reutilizables por los estados S1, S3, S5, S6, S7 (y A5) */
  CT.inicio = {
    /* Chip "+1 hoy" de los frames de estado (S3, S5) */
    hoyChip: function () {
      return '<span class="chip chip--yellow b1-hoy">' + I("plus", 14) + "+" + D.visitas.hoy + " hoy</span>";
    },

    /* Enlace "Ver mis visitas ›" en blanco sobre morado (S3 y S5 a la derecha; S7 en lugar del chip) */
    visitsLink: function () {
      return '<a class="b1-visits" href="#/r1" data-go="r1">Ver mis visitas' + I("chev_r", 16) + "</a>";
    },

    /* o: { visitas, chip (html|false), link (true = "Ver mis visitas" a la derecha del chip),
           cls (clase extra de la cabecera, p. ej. "b1-head--link" cuando solo va el enlace) } */
    header: function (o) {
      o = o || {};
      var v = o.visitas != null ? o.visitas : D.visitas.acumuladas;
      var chip = o.chip === false ? "" : o.chip || '<span class="chip chip--yellow">¡Sumaste ' + D.visitas.hoy + " visita hoy!</span>";
      return (
        '<header class="b1-head' + (o.cls ? " " + o.cls : "") + '">' +
        '<div class="b1-head-row">' + ui.logo("negativo", 175) +
        '<a class="avatar" href="#/e1" data-go="e1" aria-label="Mi perfil">' + D.socio.iniciales + "</a></div>" +
        '<div class="b1-head-copy">' +
        '<p class="t-m">Hola, ' + D.socio.nombre + "</p>" +
        '<p class="b1-count"><span class="t-display num">' + v + '</span><span class="t-m">visitas acumuladas</span></p>' +
        '<div class="b1-chip-row">' + chip + (o.link ? CT.inicio.visitsLink() : "") + "</div>" +
        "</div></header>"
      );
    },

    /* o: { label, note } · por defecto los textos de B1 */
    barcodeCard: function (o) {
      o = o || {};
      return (
        '<div class="b1-code-wrap px">' +
        '<div class="b1-code">' +
        '<div class="b1-code-top"><span class="t-label-s c-brand">' + (o.label || "Código Club Tambero") + "</span>" +
        '<a class="b1-expand" href="#/b2" data-go="b2">' + I("maximize", 16) + "<span>Ampliar</span></a></div>" +
        '<a class="b1-code-bars" href="#/b2" data-go="b2" aria-label="Ampliar código">' + ui.barcode(300, 60) + "</a>" +
        '<p class="b1-code-num num">' + D.tarjeta.numero + "</p>" +
        '<p class="b1-code-note">' + (o.note || "¡Muéstralo en todas tus compras para sumar visitas y desbloquear beneficios!") + "</p>" +
        "</div></div>"
      );
    },

    /* o: { kicker, title, sub, visitas, meta, go, icon,
             cls (clase extra de la tarjeta, p. ej. "s5-unlock"), bar (false = sin barra) } */
    unlockCard: function (o) {
      o = o || {};
      var v = o.visitas != null ? o.visitas : D.visitas.acumuladas;
      var meta = o.meta || D.visitas.meta;
      var pct = Math.max(0, Math.min(100, Math.round((v / meta) * 100)));
      return (
        '<div class="px b1-unlock-wrap">' +
        '<a class="b1-unlock' + (o.cls ? " " + o.cls : "") + '" href="#/' + (o.go || "r1") + '" data-go="' + (o.go || "r1") + '">' +
        '<span class="tile tile--brand tile--lg b1-unlock-tile">' + I(o.icon || "lock", 24) + "</span>" +
        '<span class="b1-unlock-main">' +
        '<span class="b1-unlock-kicker">' + (o.kicker || "¡Tu premio te espera!") + "</span>" +
        '<span class="t-m c-primary">' + (o.title || "Te faltan solo " + (meta - v) + " visitas") + "</span>" +
        (o.bar === false ? "" : '<span class="progress b1-unlock-bar" style="--p:' + pct + '%"><span></span></span>') +
        '<span class="b1-unlock-sub num">' + (o.sub || v + " de " + meta + " visitas") + "</span>" +
        "</span>" +
        '<span class="b1-unlock-chev">' + I("chev_r", 20) + "</span>" +
        '<span class="b1-plus" aria-hidden="true"></span>' +
        "</a></div>"
      );
    },

    /* o: { title } · "Tus beneficios" (B1) o "Tus cupones" (frames de estado) */
    beneficios: function (n, o) {
      o = o || {};
      var list = D.cupones.slice(0, n || 2);
      return (
        '<div class="sec-head px b1-sec">' +
        '<h2 class="sec-title">' + (o.title || "Tus beneficios") + ' <span class="count">' + D.cupones.length + "</span></h2>" +
        '<a class="link" href="#/c1" data-go="c1" data-nav="fade">Ver todos</a></div>' +
        '<div class="px stack gap-3 b1-cupones">' +
        list.map(function (c) { return ui.cupon(c, { go: "c2/" + c.id }); }).join("") +
        "</div>"
      );
    },
  };

  CT.screen({
    id: "b1",
    top: "brand",
    tab: "inicio",
    note:
      "Todo el Inicio sale de una llamada (<b>GET /customers/{id}/membership</b>): visitas, código, avance al próximo desbloqueo y cupones. " +
      "Toca <b>Ampliar</b> para la tarjeta, la barra amarilla para Visitas o un cupón para su detalle.",
    render: function () {
      var X = CT.inicio;
      return X.header() + X.barcodeCard() + X.unlockCard() + X.beneficios(2) + '<div style="height:24px"></div>';
    },
    // Primera llegada al Inicio desde el navegador del celular: invitación a instalar (una vez)
    mount: function () { return CT.pwa ? CT.pwa.maybeInvite(900) : null; },
  });
})();

/* ==========================================================================
   B2 · Mi tarjeta (iPhone y Android) y B2 · Caja: cupones
   Paso por caja en dos pasos con el segmentado "1 · Tarjeta / 2 · Cupones".
   ========================================================================== */
(function () {
  var ui = CT.ui, I = ui.I, D = CT.data;

  /* Última variante de la tarjeta vista: "1 · Tarjeta" vuelve a ella desde cupones */
  var ultimaTarjeta = "b2";

  /* Código de caja y línea de vigencia de cada cupón (ficticios; el de Pilsen es el del Figma) */
  var CAJA = {
    pilsen: { codigo: "TAMBO-PLS-8942", linea: "S/ 5 de descuento · vence mañana, 23:59" },
    snacks: { codigo: "TAMBO-SNK-5217", linea: "20% de descuento · hasta el 15 nov." },
    cafe: { codigo: "TAMBO-CAF-3306", linea: "Precio S/ 2.90 · hasta el 30 nov." },
    bienvenida: { codigo: "TAMBO-BNV-7781", linea: "S/ 3 de descuento · hasta el 31 oct." },
  };

  /* Pantalla encendida mientras la tarjeta está abierta (Screen Wake Lock, si existe).
     Devuelve la función de limpieza de la pantalla. */
  function pantallaEncendida() {
    var lock = null, fin = false;
    try {
      if (navigator.wakeLock && navigator.wakeLock.request) {
        navigator.wakeLock.request("screen").then(function (l) {
          if (fin) l.release(); else lock = l;
        }).catch(function () {});
      }
    } catch (e) {}
    return function () {
      fin = true;
      try { if (lock) lock.release(); } catch (e) {}
    };
  }

  /* Barra superior: cerrar + segmentado sobre morado. paso: "tarjeta" | "cupones" */
  function barra(paso) {
    function item(id, label, route) {
      return paso === id
        ? '<span class="b2-seg-item" role="tab" aria-selected="true">' + label + "</span>"
        : '<a class="b2-seg-item" role="tab" aria-selected="false" href="#/' + route + '" data-go="' + route + '" data-nav="fade">' + label + "</a>";
    }
    return (
      '<header class="b2-bar">' +
      '<button class="b2-close" type="button" data-back aria-label="Cerrar">' + I("x", 24) + "</button>" +
      '<nav class="b2-seg" role="tablist" aria-label="Paso por caja">' +
      item("tarjeta", "1 · Tarjeta", ultimaTarjeta) +
      item("cupones", "2 · Cupones (" + D.cupones.length + ")", "b2-cupones") +
      "</nav>" +
      '<span class="b2-bar-spacer" aria-hidden="true"></span>' +
      "</header>"
    );
  }

  /* Code 128 (juego B) en SVG: el código de cada cupón es escaneable de verdad.
     El del Figma (TAMBO-PLS-8942) es exactamente este patrón a 302 px. */
  var C128 = ("212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 " +
    "122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 " +
    "212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 " +
    "113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 " +
    "431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 " +
    "241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 " +
    "131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112").split(" ");

  function code128(texto, w, h) {
    var codes = [104], suma = 104, i;
    for (i = 0; i < texto.length; i++) {
      var v = texto.charCodeAt(i) - 32;
      if (v < 0 || v > 94) v = 0;
      codes.push(v);
      suma += v * (i + 1);
    }
    codes.push(suma % 103, 106);
    var x = 0, rects = "", negro = true;
    codes.forEach(function (c) {
      C128[c].split("").forEach(function (d) {
        var m = +d;
        if (negro) rects += '<rect x="' + x + '" width="' + m + '" height="1"/>';
        x += m;
        negro = !negro;
      });
      negro = true;
    });
    return (
      '<svg class="b2-barcode" width="' + w + '" height="' + h + '" viewBox="0 0 ' + x + ' 1" preserveAspectRatio="none" ' +
      'role="img" aria-label="Código de barras ' + ui.esc(texto) + '" xmlns="http://www.w3.org/2000/svg"><g fill="#000">' + rects + "</g></svg>"
    );
  }

  /* Bloque blanco con el código grande (pase y cupón): chip, barras, número y nota.
     barras: html opcional de las barras (cupones); por defecto, la imagen de la tarjeta */
  function codigo(num, nota, cls, barras) {
    return (
      '<div class="b2-code' + (cls ? " " + cls : "") + '">' +
      '<span class="chip chip--barcode">' + I("sun", 14) + "Sube el brillo para escanear</span>" +
      (barras || '<img class="b2-barcode" src="assets/img/barcode.svg" width="302" height="104" alt="Código de barras ' + num + '">') +
      '<p class="b2-code-num">' + num + "</p>" +
      '<p class="b2-code-note">' + nota + "</p>" +
      "</div>"
    );
  }

  /* Botón de Wallet. platform: "ios" | "android" */
  function wallet(platform) {
    var btn = platform === "android"
      ? '<button type="button" class="b2-wallet-btn b2-wallet-btn--google" data-toast="Pase guardado en Google Wallet (demo)" data-toast-icon="wallet">' +
        '<span class="b2-wallet-glyph b2-wallet-glyph--google"><img src="assets/img/tarjeta/google-wallet.svg" width="28" height="24" alt=""></span>' +
        '<span class="b2-wallet-name">Agregar a Google Wallet</span></button>'
      : '<button type="button" class="b2-wallet-btn b2-wallet-btn--apple" data-toast="Pase añadido a tu Wallet (demo)" data-toast-icon="wallet" aria-label="Añadir a Apple Wallet">' +
        '<span class="b2-wallet-glyph b2-wallet-glyph--apple"><img src="assets/img/tarjeta/apple-wallet.svg" width="32" height="24" alt=""></span>' +
        '<span class="b2-wallet-txt"><span class="b2-wallet-pre">Añadir a</span><span class="b2-wallet-name">Apple Wallet</span></span></button>';
    return (
      '<div class="b2-wallet">' + btn +
      '<p class="b2-wallet-note">Llévala en tu Wallet y úsala sin internet.</p></div>'
    );
  }

  /* B2 · Mi tarjeta (iPhone / Android) */
  function tarjeta(platform) {
    return (
      barra("tarjeta") +
      '<section class="b2-pass" aria-label="Tarjeta Club Tambero">' +
      '<div class="b2-pass-top">' +
      '<div class="b2-pass-brand">' + ui.logo("positivo", 175) + '<span class="t-over b2-pass-club">Club Tambero</span></div>' +
      '<p class="t-l b2-pass-name">' + D.socio.nombreCompleto + "</p>" +
      '<p class="b2-pass-since"><span class="t-over">Miembro desde</span><span class="t-m">' + D.socio.miembroDesdeCorto + "</span></p>" +
      "</div>" +
      codigo(D.tarjeta.numero, "¡Presenta este código en todas tus compras de Tambo para sumar visitas!") +
      "</section>" +
      wallet(platform) +
      '<div class="px"><a class="b2-benef" href="#/b2-cupones" data-go="b2-cupones" data-nav="fade">' +
      '<span class="tile tile--yellow b2-benef-tile">' + I("ticket_pct", 20) + "</span>" +
      '<span class="b2-benef-main">' +
      '<span class="b2-benef-title">Tus ' + D.cupones.length + " beneficios disponibles</span>" +
      '<span class="b2-benef-sub">Escanea tu código y presenta el cupón que quieras usar.</span>' +
      "</span>" +
      '<span class="b2-benef-chev">' + I("chev_r", 20) + "</span>" +
      "</a></div>" +
      '<div class="b2-end"></div>'
    );
  }

  CT.screen({
    id: "b2",
    top: "brand",
    bottom: "brand",
    bg: "var(--bg-brand)",
    note:
      "La tarjeta lista para el lector de caja y el botón oficial de <b>Apple Wallet</b>; la pantalla queda encendida mientras está abierta. " +
      "Toca <b>2 · Cupones</b> o la fila de beneficios para el paso de cupones, o la <b>X</b> para volver.",
    render: function () { ultimaTarjeta = "b2"; return tarjeta("ios"); },
    mount: function () { return pantallaEncendida(); },
  });

  CT.screen({
    id: "b2-android",
    top: "brand",
    bottom: "brand",
    bg: "var(--bg-brand)",
    note:
      "La misma tarjeta con el botón oficial de <b>Google Wallet</b>: la web detecta el sistema del celular y, si no lo reconoce, muestra los dos. " +
      "Toca <b>Agregar a Google Wallet</b> o <b>2 · Cupones</b>.",
    render: function () { ultimaTarjeta = "b2-android"; return tarjeta("android"); },
    mount: function () { return pantallaEncendida(); },
  });

  /* B2 · Caja: cupones. Ruta opcional #/b2-cupones/<id> para abrir en ese cupón */
  CT.screen({
    id: "b2-cupones",
    top: "brand",
    bottom: "brand",
    bg: "var(--bg-brand)",
    note:
      "Paso 2 en caja: un cupón a la vez, con su código para escanear (hasta 2 por día). " +
      "Desliza o toca <b>Siguiente cupón</b>; <b>1 · Tarjeta</b> vuelve al pase.",
    render: function () {
      var n = D.cupones.length;
      var slides = D.cupones.map(function (c, i) {
        var caja = CAJA[c.id] || { codigo: "TAMBO-" + c.id.toUpperCase(), linea: c.vence ? c.vence.texto : "" };
        var largo = String(c.hablador.num || "").length > 3;
        return (
          '<article class="b2c-slide" aria-roledescription="cupón" aria-label="Cupón ' + (i + 1) + " de " + n + '">' +
          '<div class="b2c-card">' +
          '<div class="b2c-top">' +
          ui.hablador(c.hablador, null, "b2c-hab" + (largo ? " b2c-hab--long" : "")) +
          '<div class="b2c-info">' +
          '<p class="t-over b2c-kicker">Cupón ' + (i + 1) + " de " + n + "</p>" +
          '<p class="t-m b2c-title">' + ui.esc(c.titulo) + "</p>" +
          '<p class="b2c-line">' + caja.linea + "</p>" +
          "</div></div>" +
          codigo(caja.codigo, "Válido para un solo uso. Máximo 2 cupones por día", "b2c-code", code128(caja.codigo, 302, 104)) +
          "</div></article>"
        );
      }).join("");
      var dots = D.cupones.map(function (c, i) {
        return '<span class="b2c-dot' + (i === 0 ? " is-on" : "") + '"></span>';
      }).join("");
      return (
        barra("cupones") +
        '<div class="b2c-track" tabindex="0" aria-label="Cupones para mostrar en caja">' + slides + "</div>" +
        '<div class="b2c-pager">' +
        '<span class="b2c-dots" aria-hidden="true">' + dots + "</span>" +
        '<p class="b2c-hint">Desliza para mostrar el siguiente cupón</p>' +
        "</div>" +
        '<div class="px b2c-next">' + ui.btn({ text: "Siguiente cupón", variant: "on-brand", block: true, attrs: { id: "b2c-next" } }) + "</div>" +
        '<div class="b2-end"></div>'
      );
    },
    mount: function (root, ctx) {
      var track = root.querySelector(".b2c-track");
      var dots = root.querySelectorAll(".b2c-dot");
      var next = root.querySelector("#b2c-next");
      var n = dots.length, raf = 0;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function actual() { return Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / (track.clientWidth || 1)))); }
      function marcar(i) {
        for (var k = 0; k < n; k++) dots[k].classList.toggle("is-on", k === i);
      }
      function ir(i, suave) {
        track.scrollTo({ left: i * track.clientWidth, behavior: suave && !reduce ? "smooth" : "auto" });
        marcar(i);
      }

      track.addEventListener("scroll", function () {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () { marcar(actual()); });
      }, { passive: true });
      next.addEventListener("click", function () { ir((actual() + 1) % n, true); });
      // Flechas dentro del carrusel: no cambian de pantalla (el riel usa ← →)
      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { e.preventDefault(); e.stopPropagation(); ir(Math.min(n - 1, actual() + 1), true); }
        if (e.key === "ArrowLeft") { e.preventDefault(); e.stopPropagation(); ir(Math.max(0, actual() - 1), true); }
      });

      // "Usar" desde C1/C2 abre este paso en ese cupón: #/b2-cupones/<id>
      var id = ctx.params && ctx.params[0];
      if (id) {
        for (var i = 0; i < D.cupones.length; i++) if (D.cupones[i].id === id) { ir(i, false); break; }
      }

      var off = pantallaEncendida();
      return function () { cancelAnimationFrame(raf); off(); };
    },
  });
})();

/* ==========================================================================
   Estados · S1 Inicio cargando, S3 Inicio sin conexión, S5 Inicio con
   resultado, S6 Aún sin visitas (pantalla Visitas) y S7 Nuevo periodo
   ========================================================================== */
(function () {
  var ui = CT.ui, I = ui.I, D = CT.data;

  /* ------------------------------- S1 · Cargando ------------------------------- */
  function s1() {
    var cupon =
      '<div class="s1-cupon">' +
      '<span class="skel s1-cupon-hab"></span>' +
      '<span class="s1-cupon-body">' +
      '<span class="skel s1-sk-l1"></span><span class="skel s1-sk-l2"></span><span class="skel s1-sk-act"></span>' +
      "</span></div>";
    return (
      '<p class="sr-only" role="status">Cargando tu Inicio</p>' +
      '<div aria-hidden="true">' +
      '<header class="b1-head">' +
      '<div class="b1-head-row">' + ui.logo("negativo", 175) + '<span class="avatar">' + D.socio.iniciales + "</span></div>" +
      '<div class="s1-head-copy">' +
      '<span class="skel skel--on-brand s1-sk-hola"></span>' +
      '<span class="skel skel--on-brand s1-sk-num"></span>' +
      '<span class="skel skel--on-brand s1-sk-chip"></span>' +
      "</div></header>" +
      '<div class="b1-code-wrap px"><div class="s1-code">' +
      '<div class="s1-code-top"><span class="skel s1-sk-label"></span><span class="skel s1-sk-link"></span></div>' +
      '<span class="skel s1-sk-bars"></span>' +
      '<span class="skel s1-sk-numero"></span>' +
      "</div></div>" +
      '<div class="px s1-unlock"><span class="skel s1-sk-unlock"></span></div>' +
      '<div class="px s1-sec"><span class="skel s1-sk-sec"></span><span class="skel s1-sk-all"></span></div>' +
      '<div class="px stack gap-3 s1-cupones">' + cupon + cupon + "</div>" +
      '<div style="height:24px"></div>' +
      "</div>"
    );
  }

  CT.screen({
    id: "s1",
    top: "brand",
    tab: "inicio",
    note:
      "Mientras llega <b>membership</b>, cada sección del Inicio muestra su esqueleto; nunca un spinner en medio del contenido. " +
      "Si la tarjeta ya está guardada en el navegador, se muestra de inmediato (aquí se queda cargando como demostración).",
    render: s1,
  });

  /* Textos de la tarjeta y de la lista en los frames de estado (S3, S5, S7) */
  var ESTADO_CODIGO = { label: "Club Tambero", note: "Muéstrala al pagar para sumar visitas y usar tus cupones" };
  var ESTADO_LISTA = { title: "Tus cupones" };

  /* ------------------------------ S3 · Sin conexión ------------------------------ */
  CT.screen({
    id: "s3",
    top: "brand",
    tab: "inicio",
    note:
      "Degradación por sección: si <b>raffles</b> responde 5xx o tarda más de 3 s, solo la tarjeta del desbloqueo muestra el aviso y el resto del Inicio sigue funcionando. " +
      "<b>Reintentar</b> repite solo esa llamada; las visitas siguen sumando.",
    render: function () {
      var X = CT.inicio;
      return (
        X.header({ chip: X.hoyChip(), link: true }) + X.barcodeCard(ESTADO_CODIGO) +
        '<div class="px s3-off-wrap"><div class="card s3-off" role="status">' +
        '<span class="tile tile--muted s3-off-tile">' + I("wifi_off", 20) + "</span>" +
        '<p class="t-m c-primary s3-off-title">Sin conexión</p>' +
        '<p class="t-body-s c-secondary s3-off-text">Mostramos tus datos guardados. Tu tarjeta funciona igual en caja.</p>' +
        ui.btn({ text: "Reintentar", variant: "secondary", size: "s", cls: "s3-retry", iconHtml: I("refresh", 16), attrs: { id: "s3-retry" } }) +
        "</div></div>" +
        X.beneficios(2, ESTADO_LISTA) + '<div style="height:24px"></div>'
      );
    },
    mount: function (root) {
      var btn = root.querySelector("#s3-retry");
      var t = 0;
      btn.addEventListener("click", function () {
        btn.classList.add("is-loading");
        btn.setAttribute("aria-busy", "true");
        // "Reintentar" repite solo esa llamada: la sección vuelve a ser el desbloqueo
        t = setTimeout(function () {
          var box = root.querySelector(".s3-off-wrap");
          if (!box) return;
          var tmp = document.createElement("div");
          tmp.innerHTML = CT.inicio.unlockCard();
          var card = tmp.firstChild;
          card.classList.add("s3-swap");
          box.parentNode.replaceChild(card, box);
        }, 900);
      });
      return function () { clearTimeout(t); };
    },
  });

  /* --------------------------- S5 · Inicio con resultado --------------------------- */
  CT.screen({
    id: "s5",
    top: "brand",
    tab: "inicio",
    note:
      "Sin notificaciones push en V0: el socio se entera de la sorpresa al entrar a la web y la tarjeta del desbloqueo cambia a magenta. " +
      "Tócala para abrir <b>R3 · Sorpresa desbloqueada</b>; se muestra una sola vez (marca local de visto).",
    render: function () {
      var X = CT.inicio, meta = D.visitas.meta;
      return (
        X.header({ visitas: meta, chip: X.hoyChip(), link: true }) + X.barcodeCard(ESTADO_CODIGO) +
        X.unlockCard({
          cls: "s5-unlock",
          icon: "gift",
          visitas: meta,
          kicker: "¡Desbloqueaste una sorpresa!",
          title: "¡Llegaste a " + meta + " visitas!",
          sub: "Toca para ver tu sorpresa",
          bar: false,
          go: "r3",
        }) +
        X.beneficios(2, ESTADO_LISTA) + '<div style="height:24px"></div>'
      );
    },
  });

  /* ---------------------- S6 · Aún sin visitas (pantalla Visitas) ---------------------- */
  function s6Fila(titulo, toast) {
    return (
      '<button type="button" class="list-row" data-toast="' + toast + '" data-toast-icon="file">' +
      '<span class="tile s6-row-tile">' + I("file", 20) + "</span>" +
      '<span class="list-row-main"><span class="list-row-title">' + titulo + "</span></span>" +
      I("chev_r", 20) + "</button>"
    );
  }

  function s6Paso(tile, icon, texto) {
    return '<div class="s6-how-item"><span class="tile ' + tile + ' s6-how-tile">' + I(icon, 22) + "</span><p>" + texto + "</p></div>";
  }

  CT.screen({
    id: "s6",
    top: "brand",
    tab: "visitas",
    note:
      "Primera vez en Visitas o socio sin compras que sumen: 0 visitas, barra vacía y, en lugar de la lista, una invitación a usar la tarjeta. " +
      "Es el estado de todo socio nuevo, porque afiliarse no da visitas.",
    render: function () {
      var meta = D.visitas.meta;
      return (
        '<header class="s6-head">' +
        '<h1 class="page-title on-brand">Visitas</h1>' +
        '<div class="s6-panel">' +
        '<span class="s6-plus" aria-hidden="true"></span>' +
        '<div class="s6-panel-row">' +
        '<div class="s6-panel-copy">' +
        '<p class="s6-kicker">Tus visitas acumuladas</p>' +
        '<p class="s6-count"><span class="t-display num">0</span><span class="s6-count-label">visitas</span></p>' +
        "</div>" +
        '<span class="tile tile--brand tile--lg s6-tile">' + I("lock", 24) + "</span>" +
        "</div>" +
        '<p class="s6-next"><span>Próximo desbloqueo</span><span class="s6-of num">0 de ' + meta + "</span></p>" +
        '<span class="progress s6-bar" role="progressbar" aria-label="Avance al próximo desbloqueo" aria-valuemin="0" aria-valuemax="' + meta + '" aria-valuenow="0" style="--p:0%"><span></span></span>' +
        '<p class="s6-left">Te faltan ' + meta + " visitas para descubrir qué es.</p>" +
        "</div></header>" +

        '<div class="px s6-sec"><h2 class="sec-title">Cómo sumar más</h2></div>' +
        '<div class="px"><div class="card s6-how">' +
        s6Paso("tile--brand", "scan", "Muestra tu tarjeta") +
        s6Paso("tile--yellow", "cart", "Compra más de S/ 10") +
        s6Paso("s6-how-tile--tint", "plus", "Revisa tus visitas") +
        "</div></div>" +
        '<p class="px s6-foot">Solo cuentan las visitas con compras de más de S/&nbsp;10.</p>' +

        '<div class="px s6-sec"><h2 class="sec-title">Tus últimas visitas</h2></div>' +
        '<div class="px"><div class="card s6-empty">' +
        '<p class="t-m c-primary">Aún no tienes visitas</p>' +
        '<p class="t-body-s c-secondary">Muestra tu tarjeta en compras de más de S/&nbsp;10 para sumar tus primeras visitas.</p>' +
        "</div></div>" +

        '<div class="px s6-sec"><h2 class="sec-title">Más información</h2></div>' +
        '<div class="px"><div class="list s6-list">' +
        s6Fila("Cómo funcionan las visitas", "Se abre la explicación de cómo funcionan las visitas") +
        s6Fila("Términos y condiciones", "Se abren los términos y condiciones del Club Tambero") +
        "</div></div>" +
        '<div style="height:24px"></div>'
      );
    },
  });

  /* ---------------------------- S7 · Nuevo periodo ---------------------------- */
  CT.screen({
    id: "s7",
    top: "brand",
    tab: "inicio",
    note:
      "Las visitas son por periodo: al cerrar uno, el contador y la barra vuelven a 0 y esta hoja lo explica una sola vez, sin fechas (si el socio tenía 0 visitas, no se muestra). " +
      "Toca <b>Entendido</b> para ver el Inicio del nuevo periodo.",
    render: function () {
      var X = CT.inicio, meta = D.visitas.meta;
      return (
        X.header({ visitas: 0, chip: X.visitsLink(), cls: "b1-head--link" }) + X.barcodeCard(ESTADO_CODIGO) +
        X.unlockCard({ visitas: 0, title: "Te faltan " + meta + " visitas", sub: "0 de " + meta + " visitas" }) +
        X.beneficios(2, ESTADO_LISTA) + '<div style="height:24px"></div>'
      );
    },
    overlay: function () {
      var antes = D.visitas.acumuladas; // total del periodo que cerró
      return (
        '<div class="layer s7-layer" data-layer>' +
        '<section class="sheet s7-sheet" role="dialog" aria-modal="true" aria-labelledby="s7-title">' +
        ui.hablador({ tag: "Tus", num: antes, pie: "Visitas" }, null, "s7-hab") +
        '<h2 class="page-title s7-title" id="s7-title">¡Empieza un nuevo periodo!</h2>' +
        '<p class="t-body c-secondary s7-text">Tus ' + antes + " visitas del periodo anterior ya se contaron. Desde hoy tu contador vuelve a 0: sigue usando tu tarjeta, se vienen más sorpresas.</p>" +
        '<p class="t-note c-tertiary s7-note">Cuando desbloquees una sorpresa, te avisamos aquí mismo.</p>' +
        '<button type="button" class="btn btn--primary btn--block s7-cta" data-close-layer>Entendido</button>' +
        '<a class="link s7-link" href="#/r1" data-go="r1">¿Cómo funcionan las visitas?</a>' +
        "</section></div>"
      );
    },
    mount: function (root, ctx) {
      var layer = root.querySelector(".s7-layer");
      if (!layer) return;
      // Tocar fuera de la hoja también la cierra
      layer.addEventListener("click", function (e) { if (e.target === layer) ctx.closeLayer(); });
    },
  });
})();

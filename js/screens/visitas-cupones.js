/* ==========================================================================
   4 · Visitas (R1–R3) · 5 · Cupones (C1–C3) · S2 Cupones vacío
   Figma: sección "4 · Visitas (R1–R3)" · R1 615:2991, R2 616:2991, R3 617:2991
          sección "5 · Cupones (C1–C3)" · C1 612:2991, C2 613:2991, C3 614:2991
          sección "7 · Estados" · S2 621:2991
   ========================================================================== */
(function () {
  var ui = CT.ui, I = ui.I, D = CT.data, esc = ui.esc;

  /* ------------------------------------------------------------------------
     Datos ficticios propios de estas pantallas
     ------------------------------------------------------------------------ */

  // R2: movimientos del mes (las 3 primeras filas son las de R1)
  D.historial = D.movimientos.concat([
    { tipo: "compra", titulo: "Compra en Tambo Larco", detalle: "15 oct. · S/ 38.00", delta: "+1" },
    { tipo: "compra", titulo: "Compra en Tambo Pardo", detalle: "12 oct. · S/ 61.40", delta: "+1" },
    { tipo: "compra", titulo: "Compra en Tambo Angamos", detalle: "9 oct. · S/ 27.30", delta: "+1" },
    { tipo: "compra", titulo: "Compra en Tambo Schell", detalle: "5 oct. · S/ 139.90", delta: "+1" },
  ]);
  // Resumen de R2 tal como lo muestra el Figma
  D.historialResumen = { esteMes: 12, anuladas: 1, total: 14 };

  // C3: cupones usados y vencidos (los del Figma C3; el hablador va sin pie, el sello lo tapa)
  D.cuponesUsados = [
    {
      id: "empanadas",
      titulo: "Empanadas clásicas",
      desc: "Carne, pollo o queso",
      hablador: { tag: "AHORRA", cur: true, num: "3" },
      estado: "usado",
      fecha: "Usado el 12 oct.",
    },
    {
      id: "helados",
      titulo: "Helados de paleta",
      desc: "Todas las marcas",
      hablador: { tag: "", cur: false, num: "-15%" },
      estado: "usado",
      fecha: "Usado el 8 oct.",
    },
    {
      id: "gaseosas",
      titulo: "Gaseosas de 500 ml",
      desc: "Sabores seleccionados",
      hablador: { tag: "2 X", cur: true, num: "7.90" },
      estado: "vencido",
      fecha: "Venció el 30 sep.",
    },
  ];

  // C2: condiciones del Figma (Sixpack Pilsen), con su ícono, y detalle de cada cupón
  var COND = {
    tiendas: { icon: "store", text: "Válido en todas las tiendas Tambo del Perú." },
    uso: { icon: "ticket", text: "Válido para un solo uso. Máximo 2 cupones por día por cliente" },
    promo: { icon: "info", text: "No acumulable con otras promociones del mismo producto." },
    alcohol: { icon: "alert", text: "Solo para mayores de 18 años. Tomar bebidas alcohólicas en exceso es dañino." },
  };
  var DETALLE = {
    pilsen: {
      tituloLargo: "S/ 5 de descuento en Sixpack Pilsen en lata",
      detalle: "Latas de 269 ml o 355 ml seleccionadas. Un sixpack por compra.",
      codigo: "TAMBO-PLS-8942",
      vigencia: "Vigencia: del 1 al 20 de octubre de 2026.",
      condiciones: [COND.tiendas, COND.uso, COND.promo, COND.alcohol],
      icono: "cart",
      // imageUrl del API de cupones: recorte 1x de la foto del frame C2 del Figma
      foto: "assets/img/cupones/pilsen.png",
    },
    snacks: {
      tituloLargo: "20% de descuento en Snacks Lay's y Pringles",
      detalle: "Presentaciones medianas y grandes seleccionadas.",
      codigo: "TAMBO-SNK-3170",
      vigencia: "Vigencia: hasta el 15 de noviembre de 2026.",
      condiciones: [COND.tiendas, COND.uso, COND.promo],
      icono: "bag",
    },
    cafe: {
      tituloLargo: "Café americano mediano a S/ 2.90",
      detalle: "Café Tambo de 12 oz.",
      codigo: "TAMBO-CAF-5526",
      vigencia: "Vigencia: hasta el 30 de noviembre de 2026.",
      condiciones: [COND.tiendas, COND.uso, COND.promo],
      icono: "coffee",
    },
    bienvenida: {
      tituloLargo: "S/ 3 de descuento en tu próxima compra",
      detalle: "Compra mínima de S/ 15.",
      codigo: "TAMBO-BNV-0418",
      vigencia: "Vigencia: hasta el 31 de octubre de 2026.",
      condiciones: [COND.tiendas, COND.uso, COND.promo],
      icono: "gift",
    },
  };
  D.cupones.forEach(function (c) {
    var x = DETALLE[c.id];
    if (!x) return;
    for (var k in x) if (c[k] == null) c[k] = x[k];
  });

  /* ------------------------------------------------------------------------
     Piezas compartidas
     ------------------------------------------------------------------------ */

  /* Fila de movimiento (componente "Fila de movimiento": Compra / Devolución) */
  function movRow(m) {
    var dev = m.tipo === "devolucion";
    return (
      '<li class="r1-mov">' +
      '<span class="tile r1-mov-tile' + (dev ? " tile--muted" : "") + '">' + I(dev ? "undo" : "cart", 20) + "</span>" +
      '<span class="r1-mov-main">' +
      '<span class="r1-mov-title">' + esc(m.titulo) + "</span>" +
      '<span class="r1-mov-sub">' + esc(m.detalle) + "</span>" +
      "</span>" +
      '<span class="r1-mov-delta">' +
      '<span class="r1-mov-num' + (dev ? "" : " is-plus") + '">' + m.delta + "</span>" +
      '<span class="r1-mov-unit">visita</span>' +
      "</span></li>"
    );
  }

  /* Lista blanca con separadores con sangría de 68 px */
  function movList(list) {
    return '<ul class="r1-list">' + list.map(movRow).join('<li class="r1-sep" aria-hidden="true"></li>') + "</ul>";
  }

  /* Fila de "Más información" (abre hoja o aviso) */
  function infoRow(text, attrs) {
    return (
      '<button type="button" class="r1-mov r1-info"' + (attrs || "") + ">" +
      '<span class="tile r1-mov-tile">' + I("file", 20) + "</span>" +
      '<span class="r1-info-label">' + text + "</span>" +
      '<span class="r1-info-chev">' + I("chev_r", 20) + "</span>" +
      "</button>"
    );
  }

  /* Título de página + segmentado de Beneficios (C1, C3, S2) */
  function headBeneficios(active, count, dispRoute) {
    return (
      '<h1 class="page-title c1-title">Mis beneficios</h1>' +
      '<div class="c1-seg">' +
      ui.seg(
        [
          { id: "disp", label: "Disponibles", count: count, go: dispRoute || "c1" },
          { id: "usados", label: "Usados y vencidos", go: "c3" },
        ],
        active
      ) +
      "</div>"
    );
  }

  /* Chip de vigencia: ámbar con reloj si vence pronto */
  function venceChip(c) {
    if (!c.vence) return "";
    return c.vence.urgente
      ? '<span class="chip chip--warning">' + I("clock", 14) + c.vence.texto + "</span>"
      : '<span class="chip">' + c.vence.texto + "</span>";
  }

  /* Pasos numerados (C2 "¿Cómo canjear tu cupón?" y R3 "Qué sigue") */
  function steps(cls, items) {
    return (
      '<ol class="' + cls + '">' +
      items.map(function (t, i) {
        return '<li><span class="vc-num">' + (i + 1) + "</span><span>" + t + "</span></li>";
      }).join("") +
      "</ol>"
    );
  }

  /* ------------------------------------------------------------------------
     R1 · Visitas
     ------------------------------------------------------------------------ */

  function panelR1() {
    var v = D.visitas;
    var pct = Math.max(0, Math.min(100, Math.round((v.acumuladas / v.meta) * 100)));
    return (
      '<div class="r1-panel-wrap"><div class="r1-panel">' +
      '<span class="r1-plus" aria-hidden="true"></span>' +
      '<div class="r1-panel-top">' +
      '<div class="r1-panel-copy">' +
      '<p class="r1-kicker">¡Tu premio te espera!</p>' +
      '<p class="r1-count"><span class="t-display">' + v.acumuladas + '</span><span class="t-m">visitas acumuladas</span></p>' +
      "</div>" +
      '<span class="tile tile--brand tile--lg r1-gift">' + I("gift", 24) + "</span>" +
      "</div>" +
      '<div class="r1-panel-foot">' +
      '<p class="r1-ratio">' + v.acumuladas + " de " + v.meta + "</p>" +
      '<span class="progress" style="--p:' + pct + '%" role="progressbar" aria-label="Avance de visitas" aria-valuemin="0" aria-valuemax="' + v.meta + '" aria-valuenow="' + v.acumuladas + '"><span></span></span>' +
      '<p class="t-note r1-panel-note">Te faltan ' + v.faltan + (v.faltan === 1 ? " visita" : " visitas") + " para conseguir tu premio</p>" +
      "</div>" +
      "</div></div>"
    );
  }

  /* Hoja "Cómo funcionan las visitas": la explicación de S7 sin el contador */
  function hojaComoFunciona() {
    function item(icon, tile, text) {
      return '<li><span class="tile ' + tile + '">' + I(icon, 20) + "</span><span>" + text + "</span></li>";
    }
    return (
      '<div class="sheet r1-sheet" role="dialog" aria-modal="true" aria-labelledby="r1-sheet-t">' +
      '<h2 class="t-xl" id="r1-sheet-t">Cómo funcionan las visitas</h2>' +
      '<ul class="r1-sheet-list">' +
      item("scan", "tile--brand", "Muestra tu código del Club o DNI al comprar.") +
      item("cart", "tile--yellow", "Cada compra de S/10 o más suma 1 visita.") +
      item("refresh", "", "Las visitas son por periodo: al cerrar cada periodo, tu contador vuelve a 0.") +
      "</ul>" +
      '<p class="r1-sheet-note">Cuando desbloquees una sorpresa, te avisamos aquí mismo.</p>' +
      ui.btn({ text: "Entendido", block: true, attrs: { "data-close-layer": "" } }) +
      "</div>"
    );
  }

  CT.screen({
    id: "r1",
    top: "brand",
    tab: "visitas",
    note:
      "Visitas acumuladas y avance hacia el premio, sin revelar cuál es; la meta la configura negocio. " +
      "Toca <b>Ver todas</b> para el historial o <b>Cómo funcionan las visitas</b> para la explicación.",
    render: function () {
      return (
        '<header class="r1-head">' +
        '<h1 class="page-title on-brand r1-title">Mis visitas</h1>' +
        panelR1() +
        "</header>" +

        '<section class="r1-sec">' +
        '<h2 class="sec-title">Cómo sumar más</h2>' +
        '<div class="r1-how">' +
        '<p class="r1-how-item"><span class="tile tile--brand r1-how-tile">' + I("scan", 22) + "</span>Muestra tu código del Club o DNI al comprar</p>" +
        '<p class="r1-how-item"><span class="tile tile--yellow r1-how-tile">' + I("cart", 22) + "</span>Cada compra de S/10 o más suma 1 visita</p>" +
        "</div></section>" +

        '<section class="r1-sec">' +
        '<div class="sec-head"><h2 class="sec-title">Tus últimas visitas</h2>' +
        '<a class="link r1-link" href="#/r2" data-go="r2">Ver todas</a></div>' +
        movList(D.movimientos) +
        "</section>" +

        '<section class="r1-sec">' +
        '<h2 class="sec-title">Más información</h2>' +
        '<div class="r1-list">' +
        infoRow("Cómo funcionan las visitas", ' data-r1-como aria-haspopup="dialog"') +
        '<div class="r1-sep" aria-hidden="true"></div>' +
        infoRow("Términos y condiciones", ' data-toast="Se abren los términos y condiciones del Club Tambero" data-toast-icon="file"') +
        "</div></section>" +
        '<div class="r1-end"></div>'
      );
    },
    mount: function (root, ctx) {
      var como = root.querySelector("[data-r1-como]");
      if (como) como.addEventListener("click", function () { ctx.layer(hojaComoFunciona()); });
    },
  });

  /* ------------------------------------------------------------------------
     R2 · Mis visitas
     ------------------------------------------------------------------------ */

  CT.screen({
    id: "r2",
    top: "canvas",
    note:
      "Historial de visitas del periodo en curso: cada compra de más de S/ 10 suma 1 visita y una devolución la anula. " +
      "Toca la flecha para volver a Visitas.",
    render: function () {
      var v = D.visitas, r = D.historialResumen;
      return (
        ui.appbar({ title: "Mis visitas", cls: "vc-bar" }) +
        '<div class="r2-sum-wrap"><section class="card r2-sum" aria-label="Resumen de visitas">' +
        '<div class="r2-sum-top">' +
        '<span class="tile tile--yellow tile--lg">' + I("trophy", 24) + "</span>" +
        '<div class="r2-sum-copy">' +
        '<p class="t-l">' + v.acumuladas + " de " + v.meta + " visitas</p>" +
        '<p class="t-body-s c-secondary">Faltan ' + v.faltan + " para tu premio</p>" +
        "</div></div>" +
        '<hr class="r2-sum-sep">' +
        '<dl class="r2-stats">' +
        '<div><dt>visitas este mes</dt><dd>' + r.esteMes + "</dd></div>" +
        '<div><dt>visitas anuladas</dt><dd>' + r.anuladas + "</dd></div>" +
        "</dl>" +
        "</section></div>" +

        '<section class="r2-sec">' +
        '<h2 class="sec-title">Movimientos</h2>' +
        movList(D.historial) +
        "</section>" +
        '<p class="r2-count">Mostrando ' + D.historial.length + " de " + r.total + " movimientos</p>"
      );
    },
  });

  /* ------------------------------------------------------------------------
     R3 · Sorpresa desbloqueada (celebración)
     ------------------------------------------------------------------------ */

  // Confeti medido del frame R3 (1x): [x centro, y centro desde el borde superior del contenido
  // (debajo de la barra de estado), ancho, alto, giro en grados, color]
  var CONFETI = [
    [182.5, 39.5, 13, 6, -30, "w"],
    [333.5, 56.5, 8, 16, -25, "w"],
    [34.5, 81.5, 11, 17, 15, "y"],
    [252.5, 85.5, 6, 6, 0, "p"],
    [112.5, 108.5, 6, 11, -38, "y"],
    [304.5, 157.5, 10, 10, 45, "y"],
    [69.5, 165.5, 11, 5, 35, "p"],
    [355.5, 255.5, 11, 6, -10, "y"],
    [27.5, 286.5, 8, 8, 10, "w"],
  ];

  function confeti() {
    var col = { y: "var(--bg-yellow)", w: "var(--bg-surface)", p: "#ffd6ee" };
    return (
      '<span class="r3-confeti" aria-hidden="true">' +
      CONFETI.map(function (p, i) {
        return (
          '<i style="--x:' + (((p[0] + 0.02) / 390) * 100).toFixed(3) + "%;--y:" + p[1] +
          "px;--w:" + p[2] + "px;--h:" + p[3] + "px;--r:" + p[4] + "deg;--c:" + col[p[5]] + ";--d:" + (160 + i * 50) + 'ms"></i>'
        );
      }).join("") +
      "</span>"
    );
  }

  CT.screen({
    id: "r3",
    top: "brand",
    bottom: "brand",
    bg: "var(--bg-brand)",
    cls: "r3-scr",
    note:
      "Celebración que se abre una sola vez desde el aviso del Inicio (S5). No revela la sorpresa: Tambo la comunica por WhatsApp al coordinar la entrega. " +
      "Toca <b>Ver mi super cupón</b> para ir a tus beneficios.",
    render: function () {
      var v = D.visitas;
      return (
        '<div class="r3">' +
        confeti() +
        '<header class="appbar r3-bar"><button class="icon-btn" data-back aria-label="Cerrar">' + I("x", 24) + "</button></header>" +

        '<section class="r3-hero">' +
        '<span class="r3-badge">' + I("trophy", 44) + "</span>" +
        '<h1 class="r3-title">¡GANASTE!</h1>' +
        '<p class="r3-sub">¡Completaste tus ' + v.meta + " visitas y ganaste un premio!</p>" +
        "</section>" +

        '<div class="r3-card-wrap"><div class="r3-card">' +
        '<span class="chip chip--tint">' + I("trophy", 14) + "Gran sorpresa</span>" +
        '<span class="tile tile--yellow r3-card-tile">' + I("gift", 32) + "</span>" +
        '<p class="r3-card-title">¡Tu super cupón te espera!</p>' +
        '<p class="r3-card-sub">Premio por completar tus ' + v.meta + " visitas</p>" +
        "</div></div>" +

        '<section class="r3-next">' +
        '<h2 class="r3-next-title">Qué sigue</h2>' +
        steps("vc-steps r3-steps", [
          "Canjea tu premio en tienda mostrando tu código del Club y tu super cupón.",
          "Tienes 24 horas para usar tu super cupón.",
        ]) +
        "</section>" +
        "</div>"
      );
    },
    foot: function () {
      return (
        '<div class="r3-foot">' +
        ui.btn({ text: "Ver mi super cupón", variant: "on-brand", block: true, go: "c1", attrs: { "data-nav": "fade" } }) +
        ui.btn({
          text: "Ver términos y condiciones",
          variant: "outline-light",
          block: true,
          attrs: { "data-toast": "Se abren los términos y condiciones del Club Tambero", "data-toast-icon": "file" },
        }) +
        "</div>"
      );
    },
  });

  /* ------------------------------------------------------------------------
     C1 · Mis cupones (Beneficios)
     ------------------------------------------------------------------------ */

  /* Cupón disponible: el boleto abre C2 y "Usar" abre la caja (B2 · paso 2) en ese cupón */
  function cuponDisponible(c) {
    var html = ui.cupon(c, { go: "c2/" + c.id }).replace(
      '<span class="cupon-action">',
      '<span class="cupon-action" data-go="b2-cupones/' + c.id + '">'
    );
    // Rótulos largos (BIENVENIDA) van sin espaciado extra para caber en el talón, como el Figma
    var tag = c.hablador && c.hablador.tag;
    if (tag && tag.length > 8) {
      html = html.replace('<span class="hablador-tag">' + tag, '<span class="hablador-tag is-long">' + tag);
    }
    return html;
  }

  CT.screen({
    id: "c1",
    top: "canvas",
    tab: "beneficios",
    note:
      "Billetera de cupones vigentes; el hablador de cada cupón es una imagen del API de cupones. " +
      "Toca un cupón para su detalle, <b>Usar</b> para mostrarlo en caja o <b>Usados y vencidos</b> para el historial.",
    render: function () {
      return (
        headBeneficios("disp", D.cupones.length) +
        '<p class="notice c1-notice">' + I("info", 16) + "<span>Presenta tu código del Club Tambero en caja junto al cupón que quieras usar.</span></p>" +
        '<div class="stack c1-list">' + D.cupones.map(cuponDisponible).join("") + "</div>" +
        '<div class="c1-end"></div>'
      );
    },
  });

  /* ------------------------------------------------------------------------
     C2 · Detalle del cupón
     ------------------------------------------------------------------------ */

  CT.screen({
    id: "c2",
    top: "surface",
    bg: "var(--bg-surface)",
    note:
      "Detalle del cupón con el código arriba del pliegue: es lo que el cajero escanea, después de la tarjeta del Club. " +
      "La foto y el hablador son imágenes del API de cupones. Toca la flecha para volver.",
    render: function (ctx) {
      var c = CT.cupon(ctx.params && ctx.params[0]);
      var conds = (c.condiciones || []).map(function (t) {
        return "<li>" + I(t.icon, 20) + "<span>" + t.text + "</span></li>";
      }).join("");
      // Foto del cupón (imageUrl): la de Pilsen es el recorte del Figma; el resto, marcador con ícono
      var media = c.foto
        ? '<img class="c2-media c2-photo" src="' + c.foto + '" width="350" height="180" alt="Foto de ' + esc(c.titulo) + '">'
        : '<div class="c2-media" role="img" aria-label="Foto de ' + esc(c.titulo) + '">' + I(c.icono || "ticket_pct", 56) + "</div>";
      return (
        ui.appbar({ title: "Detalle del cupón", cls: "vc-bar" }) +
        '<div class="c2-media-wrap">' + media + "</div>" +
        '<div class="c2-hab">' + ui.hablador(c.hablador, "l") + "</div>" +

        '<section class="c2-info">' +
        '<div class="c2-chips"><span class="chip chip--success">' + I("check", 14) + "Listo para usar</span>" + venceChip(c) + "</div>" +
        '<h1 class="c2-title">' + esc(c.tituloLargo || c.titulo) + "</h1>" +
        '<p class="t-body-s c-secondary c2-desc">' + esc(c.detalle || c.desc) + "</p>" +
        "</section>" +

        '<div class="c2-how-wrap"><section class="c2-how" aria-labelledby="c2-how-t">' +
        '<div class="c2-how-head"><span class="tile tile--brand c2-how-tile">' + I("scan", 18) + "</span>" +
        '<h2 class="t-m" id="c2-how-t">¿Cómo canjear tu cupón?</h2></div>' +
        steps("vc-steps c2-steps", [
          "Muestra tu código del Club Tambero en caja.",
          "Luego muestra este código antes de pagar.",
        ]) +
        '<div class="c2-code">' +
        '<img class="c2-barcode" src="assets/img/cupones/codigo-cupon.svg" width="294" height="80" alt="Código de barras del cupón ' + c.codigo + '">' +
        '<p class="c2-code-num">' + c.codigo + "</p>" +
        "</div>" +
        "</section></div>" +

        '<section class="c2-cond">' +
        '<h2 class="t-l c2-cond-title">Condiciones</h2>' +
        '<ul class="c2-cond-list">' + conds + "</ul>" +
        '<p class="c2-vig">' + (c.vigencia || "") + "</p>" +
        "</section>"
      );
    },
  });

  /* ------------------------------------------------------------------------
     C3 · Usados y vencidos
     ------------------------------------------------------------------------ */

  CT.screen({
    id: "c3",
    top: "canvas",
    tab: "beneficios",
    note:
      "Historial corto de cupones usados y vencidos: el mismo hablador en gris (efecto plomo en código: grayscale y opacidad) con el sello USADO o VENCIDO encima. " +
      "Toca <b>Disponibles</b> para volver a tus cupones.",
    render: function () {
      return (
        headBeneficios("usados", D.cupones.length) +
        '<div class="stack c3-list">' +
        D.cuponesUsados.map(function (c) {
          var vencido = c.estado === "vencido";
          var html = ui.cupon(c, {
            lead: true,
            action: false,
            chip: '<span class="chip' + (vencido ? " chip--error" : "") + '">' + I("check", 14) + c.fecha + "</span>",
          });
          // El sello va sobre el hablador, no en el pie
          return html.replace(
            '<span class="hablador hablador--m">',
            '<span class="hablador hablador--m"><span class="stamp c3-stamp">' + (vencido ? "Vencido" : "Usado") + "</span>"
          );
        }).join("") +
        "</div>" +
        '<div class="c1-end"></div>'
      );
    },
  });

  /* ------------------------------------------------------------------------
     S2 · Cupones vacío
     ------------------------------------------------------------------------ */

  CT.screen({
    id: "s2",
    top: "canvas",
    tab: "beneficios",
    note:
      "Estado vacío cuando el socio no tiene cupones vigentes: explica qué hacer. " +
      "Toca <b>Ver mi tarjeta</b> para abrir el código del Club.",
    render: function () {
      return (
        headBeneficios("disp", null, "s2") +
        '<section class="s2-empty">' +
        '<div class="s2-art" aria-hidden="true">' +
        '<span class="s2-card s2-card--back"></span>' +
        '<span class="s2-card s2-card--front">' + I("ticket_pct", 40) + "</span>" +
        "</div>" +
        '<h2 class="t-l s2-title">Aún no tienes cupones disponibles</h2>' +
        '<p class="t-body-s c-secondary s2-text">Cuando recibas cupones aparecerán aquí. Muestra tu código del Club en todas tus compras para sumar visitas y desbloquear beneficios.</p>' +
        ui.btn({ text: "Ver mi tarjeta", icon: "scan", go: "b2", cls: "s2-btn" }) +
        "</section>"
      );
    },
  });
})();

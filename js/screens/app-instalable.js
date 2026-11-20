/* ==========================================================================
   P1–P3 · App instalable (no están en el Figma)
   Vistas fijas de las hojas de js/pwa.js para mostrarlas desde el índice:
   la invitación a instalar (Android), los pasos de iPhone y el permiso de
   notificaciones. En el celular aparecen solas cuando corresponde.
   ========================================================================== */
(function () {
  function overlay(sheet) {
    return '<div class="layer" data-layer>' + sheet + "</div>";
  }

  // Botones de la hoja + tocar fuera cierra
  function mountLayer(root) {
    var layer = root.querySelector(".layer");
    if (!layer) return null;
    CT.pwa.wire(layer);
    layer.addEventListener("click", function (e) { if (e.target === layer) CT.closeLayer(); });
    return null;
  }

  CT.screen({
    id: "p1",
    top: "brand",
    tab: "inicio",
    note:
      "Aparece <b>una sola vez</b>, al llegar al Inicio desde el navegador del celular (o al cerrar la Bienvenida A5). Instalada, nunca se muestra. " +
      "En Android, <b>Instalar app</b> abre el instalador del sistema con un toque; si el navegador no lo permite, muestra los pasos. " +
      "También se puede abrir desde <b>Perfil → Instalar la app</b>.",
    render: function (ctx) { return CT.screens.b1.render(ctx); },
    overlay: function () { return overlay(CT.pwa.sheets.installTap()); },
    mount: mountLayer,
  });

  CT.screen({
    id: "p2",
    top: "brand",
    tab: "inicio",
    note:
      "En iPhone ninguna web puede instalarse con un botón: Safari solo lo permite desde <b>Compartir → Agregar a inicio</b>. " +
      "Por eso la invitación muestra los pasos. <b>Ya la tengo instalada</b> evita que se vuelva a sugerir (Safari no puede saber si ya está instalada).",
    render: function (ctx) { return CT.screens.b1.render(ctx); },
    overlay: function () { return overlay(CT.pwa.sheets.installIOS()); },
    mount: mountLayer,
  });

  CT.screen({
    id: "p3",
    top: "brand",
    tab: "visitas",
    note:
      "Hoja previa al permiso del sistema: explica para qué sirven los avisos antes de que aparezca el «Permitir» del celular. " +
      "Sale al tocar una visita en <b>R1</b> o <b>R2</b>. En el celular, la notificación es real; en la computadora se simula dentro del teléfono.",
    render: function (ctx) { return CT.screens.r1.render(ctx); },
    overlay: function () { return overlay(CT.pwa.sheets.softAsk()); },
    mount: mountLayer,
  });
})();

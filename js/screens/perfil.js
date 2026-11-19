/* ==========================================================================
   6 · Perfil (E1–E3)
   Figma: sección "6 · Perfil (E1–E2)" · E1 618:2991 · E2 619:2991 · E3 710:2069
   Notas dev: E1 238:2 · E2 240:2 · E3 713:2077
   ========================================================================== */
(function () {
  var ui = CT.ui, I = ui.I, D = CT.data, esc = ui.esc;

  // Lo que no forma parte de la demo (enlaces de config.support, cambio de clave)
  var DEMO = "Disponible en la versión final";

  /* ---------------------------------------------------------------------------
     Piezas de E1
     --------------------------------------------------------------------------- */

  /* Fila con ficha de ícono 40px. o: { icon, tile, title, sub, go }
     Sin go: no es parte de la demo y muestra un aviso honesto. */
  function navRow(o) {
    var attrs = o.go
      ? ' href="#/' + o.go + '" data-go="' + o.go + '"'
      : ' type="button" data-toast="' + DEMO + '" data-toast-icon="info"';
    var tag = o.go ? "a" : "button";
    return (
      "<" + tag + ' class="e1-row"' + attrs + ">" +
      '<span class="tile e1-tile' + (o.tile ? " " + o.tile : "") + '">' + I(o.icon, 20) + "</span>" +
      '<span class="e1-row-main">' +
      '<span class="t-label c-primary">' + o.title + "</span>" +
      (o.sub ? '<span class="t-note c-tertiary">' + o.sub + "</span>" : "") +
      "</span>" +
      '<span class="e1-chev">' + I("chev_r", 20) + "</span>" +
      "</" + tag + ">"
    );
  }

  function promoSub(on) {
    return (on ? "Habilitada" : "Deshabilitada") + ": ofertas y cupones de Tambo";
  }

  /* ---------------------------------------------------------------------------
     E1 · Mi perfil
     --------------------------------------------------------------------------- */
  CT.screen({
    id: "e1",
    top: "brand",
    tab: "perfil",
    note:
      "Datos de la socia en solo lectura (DNI enmascarado), su tarjeta en Wallet, el permiso de marketing (PUT /consents) y la ayuda legal. " +
      "Prueba el <b>interruptor</b> de promociones, toca <b>Editar mis datos</b>, <b>Cerrar sesión</b> o <b>Eliminar mi cuenta</b>.",
    render: function () {
      var s = D.socio;
      var datos = [
        ["DNI", s.dniMascara],
        ["Correo", s.correo],
        ["Celular", s.celular],
        ["Nacimiento", s.nacimiento],
      ];
      return (
        // Cabecera morada con avatar
        '<header class="e1-head">' +
        '<h1 class="page-title on-brand">Mi perfil</h1>' +
        '<div class="e1-who">' +
        '<span class="avatar e1-avatar" aria-hidden="true">' + esc(s.iniciales) + "</span>" +
        '<div class="e1-who-copy">' +
        '<p class="t-l">' + esc(s.nombreCompleto) + "</p>" +
        '<p class="t-note e1-since">Cliente Club Tambero desde ' + s.miembroDesde + "</p>" +
        "</div></div></header>" +

        // Mis datos (solo lectura)
        '<section class="e1-sec" aria-labelledby="e1-datos-t">' +
        '<div class="e1-sec-head"><h2 class="sec-title" id="e1-datos-t">Mis datos</h2>' +
        '<a class="link e1-edit" href="#/e3" data-go="e3">Editar mis datos</a></div>' +
        '<dl class="card e1-card e1-data">' +
        datos.map(function (d) {
          return '<div class="e1-data-row"><dt class="t-body-s c-tertiary">' + d[0] + '</dt><dd class="t-label c-primary">' + esc(d[1]) + "</dd></div>";
        }).join("") +
        "</dl></section>" +

        // Mi tarjeta
        '<section class="e1-sec" aria-labelledby="e1-tarjeta-t">' +
        '<div class="e1-sec-head"><h2 class="sec-title" id="e1-tarjeta-t">Mi tarjeta</h2></div>' +
        '<div class="card e1-card">' +
        navRow({ icon: "wallet", tile: "tile--yellow", title: "Tarjeta en mi Wallet", sub: "Agrégala a Apple Wallet o Google Wallet", go: "b2" }) +
        "</div></section>" +

        // Ofertas y Promociones (consentimiento MARKETING)
        '<section class="e1-sec" aria-labelledby="e1-promo-t">' +
        '<div class="e1-sec-head"><h2 class="sec-title" id="e1-promo-t">Ofertas y Promociones</h2></div>' +
        '<div class="card e1-card">' +
        '<div class="e1-row e1-promo">' +
        '<span class="tile tile--brand e1-tile">' + I("message", 20) + "</span>" +
        '<span class="e1-row-main">' +
        '<span class="t-label c-primary" id="e1-promo-title">Comunicación de promociones</span>' +
        '<span class="t-note c-tertiary" id="e1-promo-sub">' + promoSub(s.promociones) + "</span>" +
        "</span>" +
        '<button type="button" class="switch e1-switch" role="switch" aria-checked="' + (s.promociones ? "true" : "false") + '" aria-labelledby="e1-promo-title" aria-describedby="e1-promo-sub"></button>' +
        "</div></div></section>" +

        // Cuenta y ayuda (enlaces de config.support)
        '<section class="e1-sec" aria-labelledby="e1-ayuda-t">' +
        '<div class="e1-sec-head"><h2 class="sec-title" id="e1-ayuda-t">Cuenta y ayuda</h2></div>' +
        '<div class="card e1-card e1-list">' +
        navRow({ icon: "key", title: "Cambiar contraseña" }) +
        navRow({ icon: "help", tile: "e1-tile--soft", title: "Preguntas frecuentes" }) +
        navRow({ icon: "file", title: "Términos y Condiciones" }) +
        navRow({ icon: "shield", tile: "e1-tile--soft", title: "Política de Privacidad" }) +
        navRow({ icon: "book", title: "Libro de Reclamaciones" }) +
        "</div></section>" +

        // Cerrar sesión · Eliminar mi cuenta · versión
        '<div class="e1-foot">' +
        ui.btn({ text: "Cerrar sesión", variant: "secondary", block: true, icon: "logout", attrs: { id: "e1-logout" } }) +
        ui.btn({ text: "Eliminar mi cuenta", variant: "ghost-danger", size: "s", go: "e2", cls: "e1-delete" }) +
        '<p class="t-note c-tertiary">Club Tambero 1.0.0</p>' +
        "</div>"
      );
    },
    mount: function (root, ctx) {
      var sw = root.querySelector(".e1-switch");
      var sub = root.querySelector("#e1-promo-sub");

      // El interruptor lo alterna app.js; aquí se refleja el cambio (PUT /consents)
      function onSwitch(e) {
        var on = !!(e.detail && e.detail.on);
        D.socio.promociones = on;
        sub.textContent = promoSub(on);
        ctx.toast("Comunicación de promociones " + (on ? "habilitada" : "deshabilitada"), on ? "check_circle" : "bell_off");
      }
      sw.addEventListener("switch", onSwitch);

      // Toda la fila alterna el interruptor (área táctil amplia)
      var row = root.querySelector(".e1-promo");
      function onRow(e) {
        if (!e.target.closest(".switch")) sw.click();
      }
      row.addEventListener("click", onRow);

      // Cerrar sesión: confirmación breve
      var logout = root.querySelector("#e1-logout");
      function onLogout() {
        var l = ctx.layer(
          '<div class="dialog e1-dialog" role="alertdialog" aria-modal="true" aria-labelledby="e1-dlg-t">' +
          '<h2 class="t-l" id="e1-dlg-t">¿Cerrar sesión?</h2>' +
          '<div class="stack gap-2">' +
          ui.btn({ text: "Cerrar sesión", block: true, attrs: { id: "e1-logout-ok" } }) +
          ui.btn({ text: "Cancelar", variant: "ghost", block: true, attrs: { "data-close-layer": "" } }) +
          "</div></div>",
          { center: true }
        );
        if (!l) return;
        l.querySelector("#e1-logout-ok").addEventListener("click", function () { ctx.go("a1"); });
      }
      logout.addEventListener("click", onLogout);

      return function () {
        sw.removeEventListener("switch", onSwitch);
        row.removeEventListener("click", onRow);
        logout.removeEventListener("click", onLogout);
      };
    },
  });

  /* ---------------------------------------------------------------------------
     E2 · Eliminar cuenta
     --------------------------------------------------------------------------- */
  var MOTIVOS = ["Ya no lo uso", "Privacidad", "Tengo otra cuenta", "Mala experiencia", "Otro"];

  function plural(n, uno, varios) {
    return n + " " + (n === 1 ? uno : varios);
  }

  CT.screen({
    id: "e2",
    top: "surface",
    bg: "var(--bg-surface)",
    note:
      "Derecho de cancelación (Ley 29733): la socia elimina su cuenta y sus datos; el aviso usa sus visitas y cupones en caché y envía el motivo opcional con la confirmación. " +
      "Marca la casilla para habilitar <b>Eliminar mi cuenta</b>.",
    render: function () {
      // Cifras del aviso: membership en caché (aquí, los datos de la maqueta)
      var nCup = D.cupones.length;
      var perdidas = [
        "Perderás tus " + plural(D.visitas.acumuladas, "visita acumulada", "visitas acumuladas") + ".",
        "Perderás tus <b>" + plural(nCup, "cupón", "cupones") + "</b> " + (nCup === 1 ? "disponible" : "disponibles") + ".",
        "Tu tarjeta dejará de funcionar en caja y en tu Wallet.",
        "Eliminaremos tus datos personales según la Ley N.° 29733.",
      ];
      return (
        ui.appbar({ title: "Eliminar cuenta", cls: "e2-bar" }) +
        '<div class="e2-body">' +
        '<span class="e2-tile" aria-hidden="true">' + I("alert", 28) + "</span>" +
        '<div class="e2-copy">' +
        '<h2 class="page-title">¿Eliminar tu cuenta?</h2>' +
        '<p class="t-body c-secondary">Esta acción no se puede deshacer. Al eliminarla:</p>' +
        "</div>" +
        '<ul class="e2-loss">' +
        perdidas.map(function (t) {
          return '<li class="e2-loss-item">' + I("x", 18) + '<span class="t-body-s c-secondary">' + t + "</span></li>";
        }).join("") +
        "</ul>" +
        '<div class="e2-why" role="group" aria-labelledby="e2-why-t">' +
        '<p class="e2-why-t" id="e2-why-t">¿Por qué te vas? <span>(opcional)</span></p>' +
        '<div class="e2-chips">' +
        MOTIVOS.map(function (m) {
          return '<button type="button" class="e2-chip" aria-pressed="false">' + m + "</button>";
        }).join("") +
        "</div></div>" +
        ui.check({ id: "e2-ok", html: "Entiendo que perderé mis visitas y cupones." }) +
        '<div class="e2-actions">' +
        ui.btn({ text: "Eliminar mi cuenta", variant: "danger", block: true, attrs: { id: "e2-delete", disabled: true } }) +
        ui.btn({ text: "Mejor no", variant: "ghost", back: true, cls: "e2-cancel" }) +
        "</div>" +
        '<p class="t-note c-tertiary center">Por seguridad te pediremos tu contraseña o volver a entrar con Google o Apple.</p>' +
        "</div>"
      );
    },
    mount: function (root, ctx) {
      var ok = root.querySelector("#e2-ok");
      var del = root.querySelector("#e2-delete");
      var chips = root.querySelector(".e2-chips");
      var timer = null;

      // Motivo opcional: selección única, se puede quitar
      function onChip(e) {
        var c = e.target.closest(".e2-chip");
        if (!c) return;
        var on = c.getAttribute("aria-pressed") !== "true";
        chips.querySelectorAll(".e2-chip").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        c.setAttribute("aria-pressed", on ? "true" : "false");
      }
      chips.addEventListener("click", onChip);

      // La confirmación habilita el botón destructivo
      function onCheck() { del.disabled = !ok.checked; }
      ok.addEventListener("change", onCheck);

      // POST /account-deletion → 202 → vuelve al acceso
      function onDelete() {
        if (!ok.checked) return;
        del.classList.add("is-loading");
        timer = setTimeout(function () {
          ctx.go("a1");
          // El aviso va sobre la pantalla nueva (A1), ya montada por el router
          setTimeout(function () { ctx.toast("Tu cuenta fue eliminada", "check_circle"); }, 180);
        }, 700);
      }
      del.addEventListener("click", onDelete);

      return function () {
        clearTimeout(timer);
        chips.removeEventListener("click", onChip);
        ok.removeEventListener("change", onCheck);
        del.removeEventListener("click", onDelete);
      };
    },
  });

  /* ---------------------------------------------------------------------------
     E3 · Editar mis datos
     --------------------------------------------------------------------------- */

  // Celular peruano: 9 dígitos que empiezan con 9 (prefijo +51 de config.registration)
  function soloDigitos(v) { return String(v || "").replace(/\D/g, ""); }
  function formatoCelular(d) { return d.length === 9 ? d.slice(0, 3) + " " + d.slice(3, 6) + " " + d.slice(6) : d; }
  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, msg) {
    var f = input.closest(".field");
    var old = f.querySelector(".field-msg");
    if (old) old.remove();
    if (!msg) {
      f.classList.remove("is-error");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      return;
    }
    f.classList.add("is-error");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", input.id + "-msg");
    f.insertAdjacentHTML("beforeend", '<p class="field-msg" id="' + input.id + '-msg">' + I("alert", 14) + "<span>" + msg + "</span></p>");
  }

  CT.screen({
    id: "e3",
    top: "surface",
    bg: "var(--bg-surface)",
    note:
      "La socia corrige nombres, apellidos, celular y correo (<b>PATCH /customers/{id}</b>); el DNI y la fecha de nacimiento no se editan aquí. " +
      "<b>Guardar cambios</b> se activa solo cuando hay cambios: prueba dejar el <b>celular</b> incompleto y guarda.",
    render: function () {
      var s = D.socio;
      return (
        ui.appbar({ title: "Editar mis datos", cls: "e3-bar" }) +
        '<form class="e3-form" id="e3-form" novalidate>' +
        '<h2 class="t-l">Tus datos</h2>' +
        '<div class="e3-row">' +
        ui.field({ id: "e3-doc", label: "Documento", value: "DNI", readonly: true, cls: "e3-lock e3-ro e3-doc", trailing: I("chev_d", 18) }) +
        ui.field({ id: "e3-dni", label: "N.° de documento", icon: "idcard", value: s.dni, readonly: true, cls: "e3-lock e3-ro" }) +
        "</div>" +
        '<div class="e3-row e3-row--half">' +
        ui.field({ id: "e3-nom", label: "Nombres", value: s.nombre, autocomplete: "given-name" }) +
        ui.field({ id: "e3-ape", label: "Apellidos", value: s.apellido, autocomplete: "family-name" }) +
        "</div>" +
        ui.field({ id: "e3-nac", label: "Fecha de nacimiento", icon: "calendar", value: s.nacimiento, readonly: true, cls: "e3-lock" }) +
        ui.field({ id: "e3-cel", label: "Celular", icon: "phone", type: "tel", value: s.celular, inputmode: "numeric", autocomplete: "tel-national", cls: "e3-cel" }) +
        ui.field({ id: "e3-mail", label: "Correo electrónico", icon: "mail", type: "email", value: s.correo, inputmode: "email", autocomplete: "email" }) +
        ui.btn({ text: "Guardar cambios", block: true, type: "submit", attrs: { id: "e3-save", disabled: true } }) +
        "</form>"
      );
    },
    mount: function (root, ctx) {
      var form = root.querySelector("#e3-form");
      var save = root.querySelector("#e3-save");
      var f = {
        nom: root.querySelector("#e3-nom"),
        ape: root.querySelector("#e3-ape"),
        cel: root.querySelector("#e3-cel"),
        mail: root.querySelector("#e3-mail"),
      };
      var timer = null;
      f.cel.maxLength = 11;

      // Valores de partida: "Guardar cambios" se activa solo cuando algo cambia
      function valores() {
        return [f.nom.value.trim(), f.ape.value.trim(), soloDigitos(f.cel.value), f.mail.value.trim().toLowerCase()].join("|");
      }
      var inicial = valores();
      function hayCambios() { return valores() !== inicial; }

      // Celular: solo dígitos y espacios; al salir, formato "987 654 321"
      function onCelInput() {
        var v = f.cel.value.replace(/[^\d ]/g, "");
        if (v !== f.cel.value) f.cel.value = v;
      }
      function onCelBlur() { f.cel.value = formatoCelular(soloDigitos(f.cel.value)); }
      f.cel.addEventListener("input", onCelInput);
      f.cel.addEventListener("blur", onCelBlur);

      // Al corregir un campo se limpia su error; el botón sigue a los cambios
      function onInput(e) {
        if (e.target.closest(".field.is-error")) setError(e.target, null);
        save.disabled = !hayCambios();
      }
      form.addEventListener("input", onInput);

      // DNI y fecha de nacimiento: sin edición en esta pantalla
      function onLocked(e) {
        if (e.target.closest(".e3-lock")) ctx.toast("El DNI y la fecha de nacimiento no se editan aquí", "lock");
      }
      form.addEventListener("click", onLocked);

      function validar() {
        var errs = [];
        var nom = f.nom.value.trim(), ape = f.ape.value.trim();
        var cel = soloDigitos(f.cel.value), mail = f.mail.value.trim();
        if (!nom) errs.push([f.nom, "Ingresa tus nombres."]);
        if (!ape) errs.push([f.ape, "Ingresa tus apellidos."]);
        if (!/^9\d{8}$/.test(cel)) errs.push([f.cel, cel ? "Ingresa 9 dígitos que empiecen con 9." : "Ingresa tu celular."]);
        if (!RE_CORREO.test(mail)) errs.push([f.mail, mail ? "Ingresa un correo válido." : "Ingresa tu correo electrónico."]);
        [f.nom, f.ape, f.cel, f.mail].forEach(function (i) { setError(i, null); });
        errs.forEach(function (e) { setError(e[0], e[1]); });
        if (errs.length) errs[0][0].focus();
        return !errs.length && { nom: nom, ape: ape, cel: cel, mail: mail };
      }

      // PATCH /customers/{id} → datos en memoria → vuelve a Mi perfil
      function onSubmit(e) {
        e.preventDefault();
        if (save.classList.contains("is-loading") || !hayCambios()) return;
        var v = validar();
        if (!v) return;
        save.classList.add("is-loading");
        timer = setTimeout(function () {
          var s = D.socio;
          s.nombre = v.nom;
          s.apellido = v.ape;
          s.nombreCompleto = v.nom + " " + v.ape;
          s.iniciales = (v.nom.charAt(0) + v.ape.charAt(0)).toUpperCase();
          s.celular = formatoCelular(v.cel);
          s.correo = v.mail;
          // Sin ctx.go: si se llegó desde E1, el router lo trata como "volver"
          location.hash = "#/e1";
          setTimeout(function () { ctx.toast("Tus datos se actualizaron", "check_circle"); }, 180);
        }, 600);
      }
      form.addEventListener("submit", onSubmit);

      return function () {
        clearTimeout(timer);
        f.cel.removeEventListener("input", onCelInput);
        f.cel.removeEventListener("blur", onCelBlur);
        form.removeEventListener("input", onInput);
        form.removeEventListener("click", onLocked);
        form.removeEventListener("submit", onSubmit);
      };
    },
  });
})();

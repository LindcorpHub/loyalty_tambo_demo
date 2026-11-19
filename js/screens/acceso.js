/* ==========================================================================
   2 · Acceso: A1 Iniciar sesión · A2 Crear cuenta · A3 Completar registro ·
   A4 Recuperar contraseña · A5 Bienvenida · S4 Registro con errores
   Figma: sección "2 · Acceso (A1–A4)" · frames 603:2991 … 607:2991, S4 623:2991
   A2, A3 y S4 comparten el formulario de registro (clases a2-*).
   ========================================================================== */
(function () {
  var ui = CT.ui, I = ui.I, D = CT.data;

  var APPLE = '<span class="ico" style="--s:20px">' + CT.svg.apple + "</span>";
  var GOOGLE = '<img src="assets/img/google.svg" width="20" height="20" alt="">';

  /* Contraseña precargada: 8 caracteres, como los 8 puntos del Figma
     (CT.data.demo.clave tiene 9). En A2 da "Seguridad media". */
  var CLAVE = "Tambo123";

  /* Textos de error. Los de S4 vienen del Figma; "campo vacío", DNI corto,
     fecha mal escrita, celular, correo usado y contraseña son de la maqueta. */
  var MSG = {
    banner: "No pudimos crear tu cuenta. Revisa los campos marcados.",
    login: "Correo o contraseña incorrectos.", // A1: mensaje neutro (nota dev)
    req: "Completa este campo.",
    dni: "El DNI tiene 8 dígitos.",
    dniUsado:
      'Este DNI ya tiene una cuenta. <a class="a2-msg-link" href="#/a1" data-go="a1">Inicia sesión</a> o ' +
      '<a class="a2-msg-link" href="#/a4" data-go="a4">recupera tu contraseña</a>.',
    // A3 (Google / Apple): DOCUMENT_ALREADY_REGISTERED ofrece "Inicia sesión con tu correo" (nota dev)
    dniUsadoA3: 'Este DNI ya tiene una cuenta. <a class="a2-msg-link" href="#/a1" data-go="a1">Inicia sesión con tu correo</a>.',
    fecha: "Escribe una fecha válida como DD/MM/AAAA.",
    edad: "Debes ser mayor de 18 años para unirte al Club Tambero.",
    cel: "Ingresa un celular de 9 dígitos que empiece con 9.",
    mail: "Revisa el formato del correo (ejemplo: nombre@correo.com).",
    mailUsado:
      'Este correo ya tiene una cuenta. <a class="a2-msg-link" href="#/a1" data-go="a1">Inicia sesión</a> o ' +
      '<a class="a2-msg-link" href="#/a4" data-go="a4">recupera tu contraseña</a>.',
    pass: "Usa mínimo 8 caracteres.",
    terms: "Acepta los Términos y la Política de Privacidad para continuar.",
  };

  /* ---------------------------- Reglas por campo ----------------------------
     Clave = sufijo del id del input (a2-dni, s4-nac…); p = prefijo del formulario
     de registro (a2 | a3 | s4) o nada (A1, A4). Devuelven el mensaje de error o "".
     Simulan el lookup al salir del campo y las validaciones del BFF (400 / 409 / 422). */
  function edad(nac) {
    var hoy = new Date();
    var e = hoy.getFullYear() - nac.getFullYear();
    if (hoy.getMonth() < nac.getMonth() || (hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate())) e--;
    return e;
  }
  function req(v) { return v ? "" : MSG.req; }

  var RULES = {
    dni: function (v, p) {
      v = v.replace(/\D/g, "");
      if (!v) return MSG.req;
      if (v.length !== 8) return MSG.dni;
      if (v !== D.socio.dni) return "";
      return p === "a3" ? MSG.dniUsadoA3 : MSG.dniUsado; // DOCUMENT_ALREADY_REGISTERED (409)
    },
    nom: req,
    ape: req,
    nac: function (v) {
      if (!v) return MSG.req;
      var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
      if (!m) return MSG.fecha;
      var d = +m[1], mo = +m[2] - 1, y = +m[3], f = new Date(y, mo, d);
      if (y < 1900 || f.getFullYear() !== y || f.getMonth() !== mo || f.getDate() !== d || f > new Date()) return MSG.fecha;
      return edad(f) < 18 ? MSG.edad : ""; // UNDERAGE (422)
    },
    cel: function (v) {
      v = v.replace(/\D/g, "");
      if (!v) return MSG.req;
      return /^9\d{8}$/.test(v) ? "" : MSG.cel;
    },
    mail: function (v, p) {
      if (!v) return MSG.req;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MSG.mail;
      // EMAIL_ALREADY_REGISTERED (409): solo en el registro, no en A1 ni A4
      return p && v.toLowerCase() === D.socio.correo ? MSG.mailUsado : "";
    },
    pass: function (v) {
      if (!v) return MSG.req;
      return v.length < 8 ? MSG.pass : "";
    },
  };

  /* Formato mientras se escribe: DNI 8 dígitos, fecha DD/MM/AAAA, celular 987 654 321 */
  var FMT = {
    dni: function (v) { return v.replace(/\D/g, "").slice(0, 8); },
    nac: function (v) {
      var d = v.replace(/\D/g, "").slice(0, 8);
      if (d.length > 4) return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
      if (d.length > 2) return d.slice(0, 2) + "/" + d.slice(2);
      return d;
    },
    cel: function (v) { return v.replace(/\D/g, "").slice(0, 9).replace(/(\d{3})(?=\d)/g, "$1 "); },
  };
  var MAXLEN = { dni: 8, nac: 10, cel: 11 };

  /* Seguridad de la contraseña: 1 baja · 2 media · 3–4 alta (Figma: "Seguridad media", 2 barras) */
  var NIVEL = ["", "Seguridad baja", "Seguridad media", "Seguridad alta", "Seguridad alta"];
  function nivel(v) {
    if (!v) return 0;
    var s = 0;
    if (v.length >= 8) s++;
    if (/\d/.test(v)) s++;
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    if (v.length >= 12) s++;
    return s <= 1 ? 1 : s <= 3 ? 2 : s === 4 ? 3 : 4;
  }

  /* --------------------------- Mensajes y errores --------------------------- */
  function msg(id, html, cls) {
    return '<p class="field-msg' + (cls ? " " + cls : "") + '" id="' + id + '">' + I("alert", 14) + "<span>" + html + "</span></p>";
  }

  function alertBox(text) {
    return '<div class="a2-alert" role="alert">' + I("alert", 18) + "<p>" + (text || MSG.banner) + "</p></div>";
  }

  /* Error en su campo (estilo S4): borde rojo y mensaje debajo */
  function fieldError(input, html) {
    var f = input.closest(".field");
    var old = f.querySelector(".field-msg");
    if (old) old.remove();
    f.classList.toggle("is-error", !!html);
    if (html) {
      f.insertAdjacentHTML("beforeend", msg(input.id + "-msg", html));
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", input.id + "-msg");
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  function termsError(box, html) {
    var wrap = box.closest(".a2-consents");
    var old = wrap.querySelector(".a2-consent-msg");
    if (old) old.remove();
    wrap.classList.toggle("has-error", !!html);
    box.closest(".check").classList.toggle("is-error", !!html);
    if (html) {
      box.closest(".check").insertAdjacentHTML("afterend", msg(box.id + "-msg", html, "a2-consent-msg"));
      box.setAttribute("aria-invalid", "true");
      box.setAttribute("aria-describedby", box.id + "-msg");
    } else {
      box.removeAttribute("aria-invalid");
      box.removeAttribute("aria-describedby");
    }
  }

  /* El aviso general se va cuando ya no queda ningún campo marcado */
  function syncAlert(form) {
    var box = form.querySelector(".a2-alert");
    if (box && !form.querySelector(".is-error")) box.remove();
  }

  /* ------------------------------ A1 · Iniciar sesión ------------------------------ */
  /* Banner morado con habladores. Es un banner del API (login_hero). */
  function heroA1() {
    return (
      '<section class="a1-hero">' +
      ui.logo("negativo", 175) +
      '<div class="a1-hero-copy">' +
      '<h1 class="a1-hero-title">¡Únete al Club Tambero!</h1>' +
      '<p class="a1-hero-sub">Usa tu código del Club al comprar, acumula visitas y prepárate para grandes sorpresas.</p>' +
      "</div>" +
      '<div class="a1-tag a1-tag--1">' + ui.hablador({ tag: "ACUMULA", num: "+", pie: "VISITAS" }) + "</div>" +
      '<div class="a1-tag a1-tag--2">' + ui.hablador({ tag: "GRANDES", num: "?", pie: "SORPRESAS" }) + "</div>" +
      '<div class="a1-tag a1-tag--3">' + ui.hablador({ tag: "AHORRA", cur: true, num: "5", pie: "DCTO" }) + "</div>" +
      "</section>"
    );
  }

  CT.screen({
    id: "a1",
    top: "brand",
    bg: "var(--bg-surface)",
    note:
      "Banner de campaign-service (<b>login_hero</b>) y acceso con correo, Apple o Google. " +
      "Escribe cualquier correo y toca <b>Iniciar sesión</b> para entrar como Carla; si cambias la contraseña verás el aviso neutro «Correo o contraseña incorrectos».",
    render: function () {
      return (
        heroA1() +
        '<form class="sheet-top a1-form" id="a1-form" novalidate>' +
        '<h2 class="t-l">Inicia sesión</h2>' +
        ui.field({ id: "a1-mail", label: "Correo electrónico", icon: "mail", type: "email", placeholder: "tunombre@correo.com", autocomplete: "email", inputmode: "email", required: true }) +
        ui.field({ id: "a1-pass", label: "Contraseña", icon: "lock", type: "password", value: CLAVE, toggle: true, autocomplete: "current-password", required: true }) +
        '<div class="a1-row">' +
        ui.check({ id: "a1-remember", checked: true, html: "Recordar sesión" }) +
        '<a class="link" href="#/a4" data-go="a4">¿Olvidaste tu contraseña?</a>' +
        "</div>" +
        ui.btn({ text: "Iniciar sesión", block: true, type: "submit", attrs: { id: "a1-submit" } }) +
        '<p class="or">o continúa con</p>' +
        '<div class="stack" style="gap:10px">' +
        ui.btn({ text: "Continuar con Apple", variant: "apple", block: true, go: "a3/apple", iconHtml: APPLE }) +
        ui.btn({ text: "Continuar con Google", variant: "secondary", block: true, go: "a3/google", iconHtml: GOOGLE }) +
        "</div>" +
        '<div class="a1-first">' +
        '<div class="grow"><p class="t-m c-primary">¿Primera vez?</p><p class="t-body-s c-primary a1-first-sub">Crea tu cuenta y disfruta los beneficios de Club Tambero.</p></div>' +
        ui.btn({ text: "Crear cuenta", variant: "dark", size: "s", go: "a2" }) +
        "</div>" +
        '<p class="a1-legal">' + I("shield", 14) + "Protegido por la Ley N.° 29733 · +400 tiendas en el Perú</p>" +
        "</form>"
      );
    },
    mount: function (root, ctx) {
      var form = root.querySelector("#a1-form");
      var mail = root.querySelector("#a1-mail");
      var pass = root.querySelector("#a1-pass");
      var btn = root.querySelector("#a1-submit");
      var title = form.querySelector(".t-l");
      var timer = null;

      function credError(on) {
        var box = form.querySelector(".a2-alert");
        if (box) box.remove();
        if (on) title.insertAdjacentHTML("afterend", alertBox(MSG.login));
      }

      // Formato del correo al salir del campo (vacío se avisa al enviar)
      form.addEventListener("focusout", function (e) {
        if (e.target === mail && mail.value.trim()) fieldError(mail, RULES.mail(mail.value.trim()));
      });
      form.addEventListener("input", function (e) {
        var t = e.target;
        if (t === mail || t === pass) {
          if (t.closest(".field.is-error")) fieldError(t, "");
          credError(false);
        }
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (btn.classList.contains("is-loading")) return;
        // Maqueta: con el correo vacío se entra con la socia de ejemplo (un solo toque para la demo)
        if (!mail.value.trim()) mail.value = D.demo.correo;
        var em = RULES.mail(mail.value.trim());
        var pm = pass.value ? "" : MSG.req;
        fieldError(mail, em);
        fieldError(pass, pm);
        credError(false);
        if (em || pm) { (em ? mail : pass).focus(); return; }
        btn.classList.add("is-loading");
        timer = setTimeout(function () {
          // IdP del BFF: cualquier correo entra como Carla con la contraseña precargada
          if (pass.value !== CLAVE) {
            btn.classList.remove("is-loading");
            credError(true);
            return;
          }
          ctx.go("b1");
        }, 650);
      });
      return function () { clearTimeout(timer); };
    },
  });

  /* ------------------------- Piezas del formulario de registro ------------------------- */
  function bar(title) {
    return ui.appbar({ title: title, cls: "a2-bar" });
  }

  /* Documento (select DNI, 104 px) + N.° de documento */
  function docRow(p, v, e) {
    return (
      '<div class="a2-row a2-row--doc">' +
      '<div class="field">' +
      '<label class="field-label" for="' + p + '-tipo">Documento</label>' +
      '<div class="field-box a2-select">' +
      '<select id="' + p + '-tipo" name="tipo"><option value="DNI">DNI</option></select>' +
      I("chev_d", 18) +
      "</div></div>" +
      ui.field({ id: p + "-dni", label: "N.° de documento", icon: "idcard", placeholder: "74829103", value: v.dni, error: e.dni, inputmode: "numeric", required: true }) +
      "</div>"
    );
  }

  function namesRow(p, v, e) {
    return (
      '<div class="a2-row">' +
      ui.field({ id: p + "-nom", label: "Nombres", placeholder: "Carla", value: v.nom, error: e.nom, autocomplete: "given-name", required: true }) +
      ui.field({ id: p + "-ape", label: "Apellidos", placeholder: "Mendoza", value: v.ape, error: e.ape, autocomplete: "family-name", required: true }) +
      "</div>"
    );
  }

  function fechaField(p, v, e) {
    return ui.field({
      id: p + "-nac", label: "Fecha de nacimiento", icon: "calendar", placeholder: "DD/MM/AAAA",
      value: v.nac, error: e.nac, inputmode: "numeric", autocomplete: "bday", required: true,
      hint: "Obligatoria: la usamos para validar tu edad.",
    });
  }

  function celField(p, v, e) {
    return ui.field({ id: p + "-cel", label: "Celular", icon: "phone", type: "tel", placeholder: "987 654 321", value: v.cel, error: e.cel, inputmode: "tel", autocomplete: "tel-national", required: true, cls: "a2-cel" });
  }

  function mailField(p, v, e) {
    return ui.field({ id: p + "-mail", label: "Correo electrónico", icon: "mail", type: "email", placeholder: "tunombre@correo.com", value: v.mail, error: e.mail, inputmode: "email", autocomplete: "email", required: true });
  }

  /* Contraseña con "Mínimo 8 caracteres" en la etiqueta y medidor de 4 barras */
  function passBlock(p, value) {
    var n = nivel(value);
    return (
      '<div class="a2-pass">' +
      ui.field({
        id: p + "-pass", label: 'Contraseña<span class="a2-pass-min">Mínimo 8 caracteres</span>', icon: "lock",
        type: "password", value: value, toggle: true, autocomplete: "new-password", required: true,
      }) +
      '<div class="a2-meter" data-level="' + n + '">' +
      '<span class="a2-meter-bar"></span><span class="a2-meter-bar"></span><span class="a2-meter-bar"></span><span class="a2-meter-bar"></span>' +
      '<span class="a2-meter-label" aria-live="polite">' + NIVEL[n] + "</span>" +
      "</div></div>"
    );
  }

  /* Términos (obligatorio) y ofertas (opcional) · o: { terms, promo, error }
     Con error, la casilla de ofertas muestra "(Opcional)" (Figma S4). */
  function consents(p, o) {
    o = o || {};
    return (
      '<div class="a2-consents' + (o.error ? " has-error" : "") + '">' +
      '<div class="a2-consent">' +
      ui.check({
        id: p + "-terms", checked: o.terms, error: !!o.error,
        html: 'Acepto los <span class="link-inline">Términos y Condiciones</span> y la <span class="link-inline">Política de Privacidad</span> de Tambo.',
      }) +
      // El error de términos va justo debajo de su casilla (MANDATORY_CONSENT_MISSING)
      (o.error ? msg(p + "-terms-msg", o.error, "a2-consent-msg") : "") +
      ui.check({ id: p + "-promo", checked: o.promo, html: 'Quiero recibir ofertas y cupones de Tambo.<span class="a2-opt"> (Opcional)</span>' }) +
      "</div>" +
      "</div>"
    );
  }

  function submit(p, text) {
    return ui.btn({ text: text || "Crear cuenta", block: true, type: "submit", attrs: { id: p + "-submit" } });
  }

  /* Valida todo el formulario; muestra u oculta el aviso general. Devuelve los inválidos. */
  function validate(form, p) {
    var bad = [];
    Object.keys(RULES).forEach(function (k) {
      var el = form.querySelector("#" + p + "-" + k);
      if (!el) return;
      var m = RULES[k](el.value.trim(), p);
      fieldError(el, m);
      if (m) bad.push(el);
    });
    var terms = form.querySelector("#" + p + "-terms");
    if (terms) {
      termsError(terms, terms.checked ? "" : MSG.terms);
      if (!terms.checked) bad.push(terms);
    }
    var box = form.querySelector(".a2-alert");
    if (bad.length && !box) form.insertAdjacentHTML("afterbegin", alertBox());
    if (!bad.length && box) box.remove();
    return bad;
  }

  /* Conecta formato, medidor, validación al salir del campo, limpieza de errores y envío (A2, A3, S4) */
  function wire(root, ctx, p) {
    var form = root.querySelector("#" + p + "-form");
    if (!form) return null;
    var btn = form.querySelector('[type="submit"]');
    var timer = null;

    Object.keys(MAXLEN).forEach(function (k) {
      var el = form.querySelector("#" + p + "-" + k);
      if (el) el.maxLength = MAXLEN[k];
    });
    var terms = form.querySelector("#" + p + "-terms");
    var termsMsg = form.querySelector(".a2-consent-msg");
    if (terms && termsMsg) {
      terms.setAttribute("aria-invalid", "true");
      terms.setAttribute("aria-describedby", termsMsg.id);
    }

    function key(t) {
      return t.id && t.type !== "checkbox" && t.id.indexOf(p + "-") === 0 ? t.id.slice(p.length + 1) : "";
    }

    // Mientras se escribe: formato, medidor y se quita el error del campo
    form.addEventListener("input", function (e) {
      var t = e.target, k = key(t);
      if (!k) return;
      if (FMT[k]) {
        var nv = FMT[k](t.value);
        if (nv !== t.value) t.value = nv;
      }
      if (k === "pass") {
        var m = form.querySelector(".a2-meter"), n = nivel(t.value);
        if (m && m.getAttribute("data-level") !== String(n)) {
          m.setAttribute("data-level", n);
          m.querySelector(".a2-meter-label").textContent = NIVEL[n];
        }
      }
      if (t.closest(".field.is-error")) {
        fieldError(t, "");
        syncAlert(form);
      }
    });

    // Al salir del campo: su regla (y el lookup de DNI / correo). Vacío se avisa al enviar.
    form.addEventListener("focusout", function (e) {
      var t = e.target, k = key(t);
      if (!k || !RULES[k]) return;
      var v = t.value.trim();
      if (!v) return;
      fieldError(t, RULES[k](v, p));
      syncAlert(form);
    });

    form.addEventListener("change", function (e) {
      if (terms && e.target === terms && terms.checked) {
        termsError(terms, "");
        syncAlert(form);
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (btn.classList.contains("is-loading")) return;
      if (validate(form, p).length) {
        var sc = root.querySelector(".scr-scroll");
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (sc) sc.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      btn.classList.add("is-loading");
      timer = setTimeout(function () { ctx.go("a5"); }, 600);
    });

    return function () { clearTimeout(timer); };
  }

  /* ------------------------------ A2 · Crear cuenta ------------------------------ */
  CT.screen({
    id: "a2",
    top: "surface",
    bg: "var(--bg-surface)",
    note:
      "Alta con correo: documento, nombres, fecha de nacimiento y <b>celular obligatorios</b>; afiliarse no da visitas ni puntos. " +
      "Cada campo se valida al salir de él (el DNI y el correo, además, contra cuentas existentes); toca <b>Crear cuenta</b> para terminar o usa <b>Apple</b> / <b>Google</b> para ir a A3.",
    render: function () {
      var p = "a2", v = {}, e = {};
      return (
        bar("Crear cuenta") +
        '<form class="a2-form" id="a2-form" novalidate>' +
        '<div class="a2-quick">' +
        '<p class="t-body-s c-secondary">Regístrate más rápido con</p>' +
        '<div class="a2-quick-row">' +
        ui.btn({ text: "Apple", variant: "apple", go: "a3/apple", iconHtml: APPLE }) +
        ui.btn({ text: "Google", variant: "secondary", go: "a3/google", iconHtml: GOOGLE }) +
        "</div></div>" +
        '<p class="or">o con tu correo</p>' +
        '<h2 class="t-l">Tus datos</h2>' +
        docRow(p, v, e) +
        namesRow(p, v, e) +
        fechaField(p, v, e) +
        celField(p, v, e) +
        '<h2 class="t-l a2-sec-gap">Tu cuenta</h2>' +
        mailField(p, v, e) +
        passBlock(p, CLAVE) +
        consents(p, { terms: true }) +
        submit(p) +
        '<p class="a2-login">¿Ya tienes cuenta? <a class="a2-link" href="#/a1" data-go="a1">Inicia sesión</a></p>' +
        "</form>"
      );
    },
    mount: function (root, ctx) { return wire(root, ctx, "a2"); },
  });

  /* ----------------- A3 · Completar registro (Google / Apple) ----------------- */
  CT.screen({
    id: "a3",
    top: "surface",
    bg: "var(--bg-surface)",
    note:
      "Primera vez con Google o Apple: el nombre y el correo vienen del proveedor y no se editan; faltan documento, fecha de nacimiento (para validar la edad) y <b>celular</b>. " +
      "Completa los datos y toca <b>Crear mi cuenta</b>; si el DNI ya existe, se ofrece iniciar sesión con tu correo.",
    render: function (ctx) {
      var p = "a3", v = {}, e = {};
      var apple = ctx.params && ctx.params[0] === "apple";
      return (
        bar("Completa tu registro") +
        '<form class="a2-form" id="a3-form" novalidate>' +
        '<p class="a3-chip">' + (apple ? APPLE : GOOGLE) +
        '<span><span class="sr-only">Cuenta de ' + (apple ? "Apple" : "Google") + ": </span>" + D.socio.correo + "</span>" +
        I("check_circle", 16, "a3-ok") + "</p>" +
        '<div class="a3-head">' +
        '<h2 class="page-title">¡Casi listo, ' + D.socio.nombre + "!</h2>" +
        '<p class="t-body c-secondary">Completa estos datos para crear tu tarjeta Club Tambero.</p>' +
        "</div>" +
        docRow(p, v, e) +
        fechaField(p, v, e) +
        celField(p, v, e) +
        consents(p, { terms: true, promo: true }) +
        submit(p, "Crear mi cuenta") +
        '<p class="a1-legal a3-legal">' + I("shield", 14) + "Tus datos están protegidos por la Ley N.° 29733.</p>" +
        "</form>"
      );
    },
    mount: function (root, ctx) { return wire(root, ctx, "a3"); },
  });

  /* -------------------------- A4 · Recuperar contraseña -------------------------- */
  CT.screen({
    id: "a4",
    top: "surface",
    bg: "var(--bg-surface)",
    note:
      "Recuperación con el IdP del BFF, sin llamar a lealtad. La respuesta es siempre neutra para no revelar si el correo existe: " +
      "toca <b>Enviar enlace</b> para verla. Quien entró con Google o Apple vuelve a A1 desde el aviso.",
    render: function () {
      return (
        '<header class="appbar a2-bar"><button type="button" class="icon-btn" data-back aria-label="Volver">' + I("back", 24) + "</button></header>" +
        '<div class="a4-body">' +
        '<span class="a4-tile" aria-hidden="true">' + I("key", 28) + "</span>" +
        '<div class="a3-head">' +
        '<h1 class="page-title">¿Olvidaste tu contraseña?</h1>' +
        '<p class="t-body c-secondary">Escribe el correo con el que te registraste y te enviaremos un enlace para crear una nueva.</p>' +
        "</div>" +
        '<form class="a4-form" id="a4-form" novalidate>' +
        ui.field({ id: "a4-mail", label: "Correo electrónico", icon: "mail", type: "email", placeholder: "tunombre@correo.com", value: D.socio.correo, inputmode: "email", autocomplete: "email", required: true }) +
        ui.btn({ text: "Enviar enlace", block: true, type: "submit", attrs: { id: "a4-submit" } }) +
        "</form>" +
        // Estado enviado: respuesta neutra (nota dev A4)
        '<div class="a4-done" id="a4-done" hidden>' +
        '<p class="a4-sent" role="status">' + I("mail_check", 20) +
        "<span>Si el correo está registrado, te enviaremos un enlace.</span></p>" +
        ui.btn({ text: "Volver a iniciar sesión", block: true, go: "a1", attrs: { "data-nav": "fade" } }) +
        "</div>" +
        // Cuentas solo Google o Apple: el aviso las devuelve a A1 (nota dev A4)
        '<a class="a4-tip" href="#/a1" data-go="a1">' + I("info", 20) +
        "<span>¿Entraste con Google o Apple? No necesitas contraseña: vuelve e inicia sesión con ese botón.</span></a>" +
        "</div>"
      );
    },
    mount: function (root) {
      var form = root.querySelector("#a4-form");
      var mail = root.querySelector("#a4-mail");
      var btn = root.querySelector("#a4-submit");
      var done = root.querySelector("#a4-done");
      var timer = null;
      // Llega a escribir su correo: el campo empieza con foco (Figma A4)
      var ft = setTimeout(function () {
        if (mail.isConnected) mail.focus({ preventScroll: true });
      }, 60);
      form.addEventListener("input", function () {
        if (mail.closest(".field.is-error")) fieldError(mail, "");
      });
      form.addEventListener("focusout", function (e) {
        if (e.target === mail && mail.value.trim()) fieldError(mail, RULES.mail(mail.value.trim()));
      });
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (btn.classList.contains("is-loading")) return;
        var m = RULES.mail(mail.value.trim());
        fieldError(mail, m);
        if (m) { mail.focus(); return; }
        btn.classList.add("is-loading");
        timer = setTimeout(function () {
          form.hidden = true;
          done.hidden = false;
          done.querySelector(".btn").focus({ preventScroll: true });
        }, 600);
      });
      return function () { clearTimeout(timer); clearTimeout(ft); };
    },
  });

  /* --------------------------------- A5 · Bienvenida ---------------------------------
     Hoja sobre el Inicio de un socio nuevo (0 visitas). El banner (imagen, título,
     texto y botón) es del API: welcome_modal. Sin hablador ni bono.
     Foto: recorte 1x del frame A5 del Figma (assets/img/acceso/bienvenida.png). */
  CT.screen({
    id: "a5",
    top: "brand",
    tab: "inicio",
    note:
      "Hoja que aparece una sola vez al terminar el registro (A2 o A3), sobre el Inicio. Es un banner del API (<b>welcome_modal</b>): si no hay banner, no se muestra. " +
      "<b>Ver mis beneficios</b> abre Mis cupones; <b>Ir al inicio</b>, deslizar hacia abajo o tocar fuera cierra la hoja.",
    render: function () {
      var X = CT.inicio;
      return (
        X.header({ visitas: 0, chip: '<a class="a5-visits" href="#/r1" data-go="r1">Ver mis visitas' + I("chev_r", 18) + "</a>" }) +
        // En el Figma A5 la tarjeta dice "Club Tambero"
        X.barcodeCard().replace("Código Club Tambero", "Club Tambero") +
        X.unlockCard({ visitas: 0 }) +
        X.beneficios(2) +
        '<div style="height:24px"></div>'
      );
    },
    overlay: function () {
      return (
        '<div class="layer a5-layer" data-layer>' +
        '<section class="sheet a5-sheet" role="dialog" aria-modal="true" aria-labelledby="a5-title" aria-describedby="a5-text" tabindex="-1">' +
        '<img class="a5-photo" src="assets/img/acceso/bienvenida.png" width="342" height="171" alt="Tres amigas ríen con sus compras a la salida de una tienda">' +
        '<h2 class="t-xl t-upper a5-title" id="a5-title">¡Ya eres parte del Club!</h2>' +
        '<p class="t-body c-secondary a5-text" id="a5-text">Descubre tus beneficios y disfruta de promociones exclusivas en Tambo</p>' +
        ui.btn({ text: "Ver mis beneficios", block: true, go: "c1", cls: "a5-cta" }) +
        '<button type="button" class="link a5-later" data-close-layer>Ir al inicio</button>' +
        "</section></div>"
      );
    },
    mount: function (root) {
      var layer = root.querySelector(".a5-layer");
      if (!layer) return null;
      var sheet = layer.querySelector(".a5-sheet");
      layer.addEventListener("click", function (e) {
        if (e.target === layer) CT.closeLayer();
      });

      // Deslizar hacia abajo cierra la hoja (nota dev A5). Se usa "translate" y no
      // "transform" porque la animación de entrada de la hoja fija el transform.
      var y0 = null, dy = 0;
      sheet.addEventListener("pointerdown", function (e) {
        if (e.button !== 0 || e.target.closest("button, a")) return;
        y0 = e.clientY;
        dy = 0;
        sheet.classList.add("is-dragging");
        try { sheet.setPointerCapture(e.pointerId); } catch (err) {}
      });
      sheet.addEventListener("pointermove", function (e) {
        if (y0 == null) return;
        dy = Math.max(0, e.clientY - y0);
        sheet.style.translate = dy ? "0 " + dy + "px" : "";
      });
      function release() {
        if (y0 == null) return;
        y0 = null;
        sheet.classList.remove("is-dragging");
        if (dy > 80) { CT.closeLayer(); return; }
        sheet.style.translate = "";
      }
      sheet.addEventListener("pointerup", release);
      sheet.addEventListener("pointercancel", release);

      // Foco en la hoja (no en el botón) para que el lector la anuncie sin anillo visible
      var t = setTimeout(function () { if (sheet.isConnected) sheet.focus({ preventScroll: true }); }, 60);
      return function () { clearTimeout(t); };
    },
  });

  /* ------------------------- S4 · Registro con errores -------------------------
     Mismo formulario con los errores de POST /customers en su campo:
     DNI ya registrado (409), menor de edad (422), celular y correo (400) y términos (422). */
  CT.screen({
    id: "s4",
    top: "surface",
    bg: "var(--bg-surface)",
    note:
      "Cada error de <b>POST /customers</b> aparece en su campo: DNI ya registrado (con enlaces a A1 y A4), menor de 18 años, celular, correo y términos. " +
      "Corrige los campos (se revalidan al salir de cada uno) y toca <b>Crear cuenta</b>.",
    render: function () {
      var p = "s4";
      var v = { dni: D.socio.dni, nom: D.socio.nombre, ape: D.socio.apellido, nac: "18/11/2010", cel: "987 654 32", mail: "carla.mendoza@gmail" };
      var e = {};
      Object.keys(v).forEach(function (k) { e[k] = RULES[k](v[k], p); });
      return (
        bar("Crear cuenta") +
        '<form class="a2-form" id="s4-form" novalidate>' +
        alertBox() +
        '<h2 class="t-l">Tus datos</h2>' +
        docRow(p, v, e) +
        namesRow(p, v, e) +
        fechaField(p, v, e) +
        celField(p, v, e) +
        mailField(p, v, e) +
        consents(p, { error: MSG.terms }) +
        submit(p) +
        "</form>"
      );
    },
    mount: function (root, ctx) { return wire(root, ctx, "s4"); },
  });
})();

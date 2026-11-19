/* ==========================================================================
   Helpers de UI: devuelven HTML (strings) con las clases de components.css.
   Úsalos desde las pantallas para no repetir marcado.
   ========================================================================== */
window.CT = window.CT || {};

/* SVG en línea que no son del set de íconos (barra de estado, Apple) */
CT.svg = {
 "signal": "<svg aria-hidden=\"true\" focusable=\"false\" width=\"18\" height=\"12\" viewBox=\"0 0 18 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g clip-path=\"url(#clip-signal)\"><path d=\"M2 8H1C0.447715 8 0 8.44772 0 9V11C0 11.5523 0.447715 12 1 12H2C2.55228 12 3 11.5523 3 11V9C3 8.44772 2.55228 8 2 8Z\" fill=\"currentColor\"/><path d=\"M7 5.5H6C5.44772 5.5 5 5.94772 5 6.5V11C5 11.5523 5.44772 12 6 12H7C7.55228 12 8 11.5523 8 11V6.5C8 5.94772 7.55228 5.5 7 5.5Z\" fill=\"currentColor\"/><path d=\"M12 3H11C10.4477 3 10 3.44772 10 4V11C10 11.5523 10.4477 12 11 12H12C12.5523 12 13 11.5523 13 11V4C13 3.44772 12.5523 3 12 3Z\" fill=\"currentColor\"/><path d=\"M17 0H16C15.4477 0 15 0.447715 15 1V11C15 11.5523 15.4477 12 16 12H17C17.5523 12 18 11.5523 18 11V1C18 0.447715 17.5523 0 17 0Z\" fill=\"currentColor\"/></g><defs><clipPath><rect width=\"18\" height=\"12\" fill=\"currentColor\"/></clipPath></defs></svg>",
 "wifi": "<svg aria-hidden=\"true\" focusable=\"false\" width=\"17\" height=\"12\" viewBox=\"0 0 17 12\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g><path d=\"M8.5 2.6C10.8 2.6 12.9 3.5 14.5 5L15.7 3.7C13.77 1.8314 11.1863 0.790757 8.5 0.8C5.81365 0.790757 3.22999 1.8314 1.3 3.7L2.5 5C4.10604 3.44129 6.26203 2.5789 8.5 2.6Z\" fill=\"currentColor\"/><path d=\"M8.5 6.2C9.8 6.2 11 6.7 11.9 7.5L13.1 6.2C11.8453 5.04751 10.2037 4.40799 8.5 4.40799C6.79632 4.40799 5.15471 5.04751 3.9 6.2L5.1 7.5C6 6.7 7.2 6.2 8.5 6.2Z\" fill=\"currentColor\"/><path d=\"M8.5 11.9C9.38366 11.9 10.1 11.1837 10.1 10.3C10.1 9.41634 9.38366 8.7 8.5 8.7C7.61634 8.7 6.9 9.41634 6.9 10.3C6.9 11.1837 7.61634 11.9 8.5 11.9Z\" fill=\"currentColor\"/></g></svg>",
 "battery": "<svg aria-hidden=\"true\" focusable=\"false\" width=\"27\" height=\"13\" viewBox=\"0 0 27 13\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g clip-path=\"url(#clip-battery)\"><path d=\"M4 0.5H20C21.933 0.5 23.5 2.067 23.5 4V9C23.5 10.933 21.933 12.5 20 12.5H4C2.067 12.5 0.5 10.933 0.5 9V4C0.5 2.067 2.067 0.5 4 0.5Z\" stroke=\"currentColor\" stroke-opacity=\"0.4\"/><path d=\"M20 2H4C2.89543 2 2 2.89543 2 4V9C2 10.1046 2.89543 11 4 11H20C21.1046 11 22 10.1046 22 9V4C22 2.89543 21.1046 2 20 2Z\" fill=\"currentColor\"/><path d=\"M25 4.5V8.5C25.8 8.2 26.3 7.4 26.3 6.5C26.3 5.6 25.8 4.8 25 4.5Z\" fill=\"currentColor\" fill-opacity=\"0.45\"/></g><defs><clipPath><rect width=\"27\" height=\"13\" fill=\"currentColor\"/></clipPath></defs></svg>",
 "apple": "<svg aria-hidden=\"true\" focusable=\"false\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g><path d=\"M10.127 5.747C9.337 5.747 8.114 4.848 6.827 4.88C5.127 4.902 3.568 5.866 2.692 7.392C0.928 10.454 2.238 14.977 3.958 17.467C4.803 18.678 5.798 20.042 7.118 19.999C8.385 19.945 8.86 19.177 10.398 19.177C11.923 19.177 12.356 19.999 13.698 19.967C15.062 19.945 15.928 18.733 16.761 17.51C17.724 16.103 18.124 14.739 18.146 14.664C18.113 14.653 15.494 13.647 15.463 10.617C15.441 8.083 17.529 6.872 17.627 6.817C16.436 5.076 14.607 4.881 13.968 4.838C12.302 4.708 10.906 5.746 10.127 5.746V5.747ZM12.942 3.192C13.644 2.348 14.108 1.169 13.979 0C12.973 0.043 11.761 0.671 11.036 1.515C10.386 2.262 9.824 3.463 9.975 4.61C11.09 4.697 12.238 4.037 12.941 3.192\" fill=\"currentColor\"/></g></svg>"
};

CT.ui = (function () {
  var I = function (n, s, c) { return CT.icon(n, s, c); };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function attrs(o) {
    if (!o) return "";
    var out = "";
    for (var k in o) {
      if (o[k] === false || o[k] == null) continue;
      out += " " + k + (o[k] === true ? "" : '="' + esc(o[k]) + '"');
    }
    return out;
  }

  /* Barra de estado 9:41 (se pinta con el color superior de la pantalla) */
  function statusBar() {
    return (
      '<div class="statusbar" aria-hidden="true">' +
      '<span class="statusbar-time">9:41</span>' +
      '<span class="statusbar-icons">' + CT.svg.signal + CT.svg.wifi + CT.svg.battery + "</span>" +
      "</div>"
    );
  }

  function homeIndicator() {
    return '<div class="home-ind" aria-hidden="true"></div>';
  }

  /* Barra inferior: active = inicio | beneficios | tarjeta | visitas | perfil */
  function tabbar(active) {
    function tab(id, icon, label, route) {
      var cur = active === id ? ' aria-current="page"' : "";
      return (
        '<a class="tab" href="#/' + route + '"' + cur + ">" +
        I(icon, 24) +
        '<span class="tab-label">' + label + "</span></a>"
      );
    }
    return (
      '<nav class="tabbar" aria-label="Navegación principal"><div class="tabbar-row">' +
      tab("inicio", "home", "Inicio", "b1") +
      tab("beneficios", "ticket_pct", "Beneficios", "c1") +
      '<a class="tab tab--card" href="#/b2"' + (active === "tarjeta" ? ' aria-current="page"' : "") + '>' +
      '<span class="tab-fab"><span class="fab">' + I("scan", 24) + "</span></span>" +
      '<span class="tab-label">Mi tarjeta</span></a>' +
      tab("visitas", "trophy", "Visitas", "r1") +
      tab("perfil", "user", "Perfil", "e1") +
      "</div></nav>"
    );
  }

  /* Botón. o: { text, variant, size, icon, iconRight, go, back, block, type, attrs, cls } */
  function btn(o) {
    o = o || {};
    var cls = "btn btn--" + (o.variant || "primary") + (o.size === "s" ? " btn--s" : "") + (o.block ? " btn--block" : "") + (o.cls ? " " + o.cls : "");
    var a = Object.assign({ type: o.type || "button", class: cls }, o.attrs || {});
    if (o.go) a["data-go"] = o.go;
    if (o.back) a["data-back"] = "";
    var inner = "";
    if (o.iconHtml) inner += o.iconHtml;
    else if (o.icon) inner += I(o.icon, o.size === "s" ? 18 : 20);
    inner += "<span>" + o.text + "</span>";
    if (o.iconRight) inner += I(o.iconRight, o.size === "s" ? 18 : 20);
    return "<button" + attrs(a) + ">" + inner + "</button>";
  }

  /* Campo. o: { id, label, icon, type, value, placeholder, error, hint, prefix, toggle, autocomplete, inputmode, readonly } */
  function field(o) {
    o = o || {};
    var id = o.id || "f-" + Math.random().toString(36).slice(2, 8);
    var input = {
      id: id,
      name: o.name || id,
      type: o.type || "text",
      value: o.value || null,
      placeholder: o.placeholder || null,
      autocomplete: o.autocomplete || "off",
      inputmode: o.inputmode || null,
      readonly: o.readonly || false,
      required: o.required || false,
      "aria-invalid": o.error ? "true" : null,
      "aria-describedby": o.error ? id + "-msg" : null,
    };
    var html =
      '<div class="field' + (o.error ? " is-error" : "") + (o.cls ? " " + o.cls : "") + '">' +
      (o.label ? '<label class="field-label" for="' + id + '">' + o.label + "</label>" : "") +
      '<div class="field-box">' +
      (o.icon ? I(o.icon, 20) : "") +
      (o.prefix ? '<span class="field-prefix">' + o.prefix + "</span>" : "") +
      "<input" + attrs(input) + ">" +
      (o.toggle ? '<button type="button" class="field-action" data-toggle-pass="' + id + '" aria-label="Mostrar contraseña">' + I("eye", 20) + "</button>" : "") +
      (o.trailing || "") +
      "</div>" +
      (o.error ? '<p class="field-msg" id="' + id + '-msg">' + I("alert", 14) + "<span>" + o.error + "</span></p>" : "") +
      (o.hint && !o.error ? '<p class="field-hint">' + o.hint + "</p>" : "") +
      "</div>";
    return html;
  }

  /* Casilla. o: { id, checked, html, error } */
  function check(o) {
    o = o || {};
    return (
      '<label class="check' + (o.error ? " is-error" : "") + '">' +
      '<input type="checkbox"' + (o.id ? ' id="' + o.id + '"' : "") + (o.checked ? " checked" : "") + ">" +
      '<span class="check-box">' + I("check", 14) + "</span>" +
      "<span>" + (o.html || "") + "</span></label>"
    );
  }

  /* Hablador. h: { tag, cur, num, pie }  size: "s" | "m" | "l" */
  function hablador(h, size, extraCls) {
    h = h || {};
    var cls = "hablador" + (size === "m" ? " hablador--m" : size === "l" ? " hablador--l" : "") + (extraCls ? " " + extraCls : "");
    return (
      '<span class="' + cls + '">' +
      (h.tag ? '<span class="hablador-tag">' + h.tag + "</span>" : "") +
      '<span class="hablador-val">' +
      (h.cur ? '<span class="hablador-cur">S/</span>' : "") +
      '<span class="hablador-num">' + h.num + "</span></span>" +
      (h.pie ? '<span class="hablador-tag">' + h.pie + "</span>" : "") +
      "</span>"
    );
  }

  /* Cupón (boleto con muescas y perforación caladas). c = CT.data.cupones[i]; o: { go, action, lead, stamp, chip } */
  function cupon(c, o) {
    o = o || {};
    var chip = o.chip != null ? o.chip :
      c.vence && c.vence.urgente
        ? '<span class="chip chip--warning">' + I("clock", 14) + c.vence.texto + "</span>"
        : '<span class="chip">' + (c.vence ? c.vence.texto : "") + "</span>";
    var action = o.action === false ? "" : '<span class="cupon-action">' + (o.action || "Usar") + "</span>";
    var tag = o.go ? "a" : "div";
    var href = o.go ? ' href="#/' + o.go + '"' : "";
    return (
      "<" + tag + href + ' class="cupon' + (o.lead ? " is-lead" : "") + '">' +
      '<span class="cupon-shape">' +
      hablador(c.hablador, "m") +
      '<span class="cupon-body">' +
      '<span class="cupon-title">' + esc(c.titulo) + "</span>" +
      '<span class="cupon-desc">' + esc(c.desc) + "</span>" +
      '<span class="cupon-foot">' + chip + (o.stamp ? '<span class="stamp">' + o.stamp + "</span>" : action) + "</span>" +
      "</span></span>" +
      "</" + tag + ">"
    );
  }

  /* Barra superior con volver/cerrar. o: { title, back, close, right, cls } */
  function appbar(o) {
    o = o || {};
    var left = o.close
      ? '<button class="icon-btn" data-back aria-label="Cerrar">' + I("x", 24) + "</button>"
      : o.back !== false
      ? '<button class="icon-btn" data-back aria-label="Volver">' + I("back", 24) + "</button>"
      : '<span class="appbar-spacer"></span>';
    return (
      '<header class="appbar' + (o.cls ? " " + o.cls : "") + '">' + left +
      '<h1 class="appbar-title">' + (o.title || "") + "</h1>" +
      (o.right || '<span class="appbar-spacer"></span>') +
      "</header>"
    );
  }

  function seg(items, active) {
    return (
      '<div class="seg" role="tablist">' +
      items.map(function (it) {
        var sel = it.id === active;
        return (
          '<a class="seg-item" role="tab" aria-selected="' + sel + '"' + (it.go ? ' href="#/' + it.go + '"' : "") + ">" +
          it.label + (it.count != null ? ' <span class="count">' + it.count + "</span>" : "") +
          "</a>"
        );
      }).join("") +
      "</div>"
    );
  }

  function logo(kind, w) {
    return '<img class="logo" src="assets/brand/logo-' + (kind || "negativo") + '.svg" width="' + (w || 175) + '" height="' + Math.round((w || 175) * 0.2714) + '" alt="Tambo">';
  }

  function barcode(w, h) {
    return '<img class="barcode" src="assets/img/barcode.svg" width="' + (w || 300) + '" height="' + (h || 60) + '" alt="Código de barras ' + CT.data.tarjeta.numero + '">';
  }

  return {
    I: I,
    esc: esc,
    attrs: attrs,
    statusBar: statusBar,
    homeIndicator: homeIndicator,
    tabbar: tabbar,
    btn: btn,
    field: field,
    check: check,
    hablador: hablador,
    cupon: cupon,
    appbar: appbar,
    seg: seg,
    logo: logo,
    barcode: barcode,
  };
})();

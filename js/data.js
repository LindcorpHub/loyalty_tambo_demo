/* ==========================================================================
   Datos ficticios de la maqueta (los mismos del Figma).
   Nada de esto llama a un API: es una socia de ejemplo.
   ========================================================================== */
window.CT = window.CT || {};

CT.data = {
  socio: {
    nombre: "Carla",
    apellido: "Mendoza",
    nombreCompleto: "Carla Mendoza",
    iniciales: "CM",
    dni: "74829103",
    dniMascara: "74•••••03",
    correo: "carla.mendoza@gmail.com",
    celular: "987 654 321",
    nacimiento: "18/11/1999",
    miembroDesde: "agosto de 2026",
    miembroDesdeCorto: "Ago. 2026",
    promociones: true,
  },

  // Credenciales de demostración (se aceptan cualquiera; estas vienen precargadas)
  demo: {
    correo: "carla.mendoza@gmail.com",
    clave: "Tambo123",
  },

  tarjeta: {
    numero: "7482 9103 4401",
    numeroPlano: "748291034401",
  },

  visitas: {
    acumuladas: 3,
    meta: 5,
    faltan: 2,
    hoy: 1,
    regla: "Solo cuentan las visitas con compras de más de S/ 10",
  },

  cupones: [
    {
      id: "pilsen",
      titulo: "Sixpack Pilsen en lata",
      desc: "Latas de 269 ml o 355 ml",
      hablador: { tag: "AHORRA", cur: true, num: "5", pie: "DCTO" },
      vence: { texto: "Vence mañana, 23:59", urgente: true },
      // condiciones y código de caja: los define C2 (js/screens/cupones.js) con los textos del Figma
    },
    {
      id: "snacks",
      titulo: "Snacks Lay's y Pringles",
      desc: "Presentaciones medianas y grandes",
      hablador: { tag: "", cur: false, num: "-20%", pie: "DCTO" },
      vence: { texto: "Hasta el 15 nov.", urgente: false },
      // condiciones y código de caja: los define C2 (js/screens/cupones.js) con los textos del Figma
    },
    {
      id: "cafe",
      titulo: "Café americano mediano",
      desc: "Café Tambo de 12 oz",
      hablador: { tag: "PRECIO", cur: true, num: "2.90", pie: "CAFÉ" },
      vence: { texto: "Hasta el 30 nov.", urgente: false },
      // condiciones y código de caja: los define C2 (js/screens/cupones.js) con los textos del Figma
    },
    {
      id: "bienvenida",
      titulo: "En tu próxima compra",
      desc: "Compra mínima de S/ 15",
      hablador: { tag: "BIENVENIDA", cur: true, num: "3", pie: "DCTO" },
      vence: { texto: "Hasta el 31 oct.", urgente: false },
      // condiciones y código de caja: los define C2 (js/screens/cupones.js) con los textos del Figma
    },
  ],

  movimientos: [
    { tipo: "compra", titulo: "Compra en Tambo Schell", detalle: "Hoy, 18:42 · S/ 25.80", delta: "+1" },
    { tipo: "compra", titulo: "Compra en Tambo Benavides", detalle: "Ayer, 08:15 · S/ 18.90", delta: "+1" },
    { tipo: "devolucion", titulo: "Devolución en Tambo Larco", detalle: "16 oct. · anula la compra del 15 oct.", delta: "−1" },
  ],
};

/* Atajos */
CT.cupon = function (id) {
  var list = CT.data.cupones;
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return list[0];
};

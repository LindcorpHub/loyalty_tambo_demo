# Club Tambero · Maqueta móvil (MVP V0)

Maqueta navegable del programa de lealtad **Club Tambero**, construida a partir del Figma *Club Tambero - Fase 0* (página **MVP V0**): versión móvil, tema claro, datos ficticios y sin llamadas a servicios.

- 27 pantallas: Acceso (A1–A5), Inicio y tarjeta (B1–B2), Visitas (R1–R3), Cupones (C1–C3), Perfil (E1–E3), Estados (S1–S7) y App instalable (P1–P3, agregadas para la demo; no están en el Figma).
- En computadora se muestra dentro de un teléfono, con el índice de pantallas a la izquierda y una nota de cada pantalla a la derecha (flechas ← → para recorrerlas).
- En un celular se abre a pantalla completa, como la web real. Para saltar entre pantallas, toca la pestaña del borde izquierdo.
- La socia de ejemplo es **Carla Mendoza**. La contraseña ya viene escrita (`Tambo123`): basta tocar **Iniciar sesión**; con el correo vacío se entra como Carla. Cualquier otra contraseña muestra el aviso de credenciales incorrectas. **Continuar con Apple / Google** también entra como Carla, directo al Inicio; el registro con esas cuentas (A3) se ve desde **Crear cuenta**.

## Verla en tu computadora

Es HTML, CSS y JavaScript puros: no hay que instalar dependencias ni compilar.

**Opción rápida:** abre `index.html` con doble clic.

**Opción recomendada (igual que en GitHub Pages):** levanta un servidor local en esta carpeta y abre <http://localhost:5173>.

```powershell
python -m http.server 5173
```

o, si tienes Node.js:

```powershell
npx serve -l 5173
```

## Publicarla en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `club-tambero-maqueta`).
2. Sube **el contenido de esta carpeta** a la raíz del repositorio (botón *Add file → Upload files*, arrastra todo y confirma con *Commit changes*). `index.html` debe quedar en la raíz.
3. En el repositorio, ve a *Settings → Pages*. En *Build and deployment* elige *Deploy from a branch*, rama `main` y carpeta `/ (root)`. Guarda.
4. En uno o dos minutos la maqueta queda publicada en `https://<tu-usuario>.github.io/<repositorio>/`. Ese es el enlace para compartir.

Cada pantalla tiene su propio enlace (por ejemplo `.../#/b1` para el Inicio o `.../#/c2/cafe` para el detalle de un cupón), útil para mandar a alguien directo a una pantalla.

> Si el repositorio es privado, GitHub Pages requiere un plan que lo permita. Para compartir con usuarios externos, usa un repositorio público.

## Instalarla como app en el celular (PWA)

La maqueta es una PWA: se instala desde el navegador, abre a pantalla completa con el ícono de Tambo y funciona sin internet después de la primera visita.

- **iPhone (Safari):** abre el enlace de GitHub Pages, toca **Compartir** y luego **Agregar a inicio**.
- **Android (Chrome):** abre el enlace y toca **Instalar app** en el aviso, o en el menú ⋮ elige **Instalar app** / **Agregar a la pantalla principal**.

Antes de una demo sin señal, ábrela una vez con internet y recorre las pantallas para que queden guardadas. Para saltar entre pantallas dentro de la app, toca la pestaña del borde izquierdo.

> La instalación solo funciona desde el enlace publicado (https) o desde `http://localhost`. Abriendo `index.html` con doble clic la maqueta se ve, pero no se puede instalar.

**Invitación a instalar.** En el navegador del celular, la primera vez que la socia llega al Inicio (o al cerrar la Bienvenida A5) aparece una hoja que invita a instalar la app. Sale una sola vez y nunca si la app ya está instalada; después queda disponible en **Perfil → Instalar la app**.

- En Android con Chrome, **Instalar app** abre el instalador del sistema con un toque. Chrome habilita esa opción tras unos segundos de uso, así que la hoja espera ese momento (hasta 20 s); si el navegador no la ofrece, muestra los pasos.
- En iPhone ninguna web se puede instalar desde un botón, así que la hoja muestra los pasos de Safari.

**Notificación de ejemplo.** En Visitas (R1) o Mis visitas (R2), toca una visita: llega una notificación como la que enviaría el programa.

- La primera vez, una hoja explica para qué sirven los avisos antes de que el celular pida permiso. Si el permiso está bloqueado, explica cómo activarlo.
- En Android llega desde el navegador o desde la app instalada. En iPhone solo llega con la app instalada y abierta desde su ícono (es una regla de Apple); si no, la hoja ofrece los pasos para instalarla.
- Si la notificación no aparece arriba en iPhone, desliza hacia abajo desde el borde superior para verla en el Centro de notificaciones.
- No hay backend: la notificación la crea el propio celular con el service worker, pero se ve igual que una enviada desde el servidor. `sw.js` ya trae el manejador `push` para cuando exista uno.
- En la computadora (vista de presentador), la notificación se simula dentro del teléfono.

## Estructura

```
index.html              Shell: riel con índice, teléfono y nota de pantalla
css/tokens.css          Tokens del sistema de diseño (variables de Figma, tema claro)
css/base.css            Reset y escala tipográfica (estilos "Tambo/…")
css/components.css      Componentes compartidos: botón, campo, hablador, cupón, barra inferior…
css/shell.css           Marco del teléfono, riel, transiciones y modo pantalla completa
css/screens/*.css       Estilos propios de cada sección
js/icons.js             Set de 52 íconos del Figma (trazo en currentColor)
js/data.js              Datos ficticios de la socia y sus cupones
js/ui.js                Helpers que generan el HTML de los componentes
js/app.js               Router por hash (#/a1, #/b1…), transiciones, capas y avisos
js/screens/*.js         Pantallas por sección
js/pwa.js, css/pwa.css  Invitación a instalar y notificaciones de ejemplo
sw.js                   Service worker: copia sin conexión y notificaciones
assets/                 Logo Tambo, código de barras e imágenes exportadas de Figma
```

Para cambiar los datos de la demo (nombre, visitas, cupones) edita `js/data.js`.

## Qué no incluye

- Tema oscuro y versión escritorio (W1–W9): existen en el Figma pero quedan fuera de esta maqueta.
- Llamadas reales al BFF, Wallet, Google o Apple: los botones responden con datos de ejemplo.

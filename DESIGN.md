---
name: Club Tambero
description: Programa de lealtad de Tambo por visitas; app móvil del socio, tema claro.
colors:
  brand: "#af1380"
  brand-pressed: "#9c1172"
  brand-tint: "#edd1e9"
  brand-night: "#1f1520"
  yellow: "#ffee0c"
  canvas: "#f7f2f6"
  surface: "#ffffff"
  muted: "#f1eaef"
  subtle: "#eee4eb"
  segment: "#efe8ed"
  text-primary: "#1f1520"
  text-secondary: "#4e3f4b"
  text-tertiary: "#74636f"
  border-default: "#e2d5de"
  border-control: "#cdbac7"
  border-stamp: "#7d6c79"
  success-bg: "#e2f4ea"
  success: "#0f7b4f"
  warning-bg: "#ffefd6"
  warning: "#9a4a00"
  error-bg: "#fde8eb"
  error: "#c4162a"
  apple: "#111111"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "44px"
    fontWeight: 800
    lineHeight: "48px"
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: "32px"
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: "24px"
    letterSpacing: "-0.005em"
  title-s:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "22px"
  bar:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    lineHeight: "22px"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "24px"
  body-s:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  label:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "20px"
  label-s:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
  note:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  button:
    fontFamily: "Schibsted Grotesk, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "20px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  card: "16px"
  xl: "20px"
  2xl: "24px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.brand-pressed}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    height: "52px"
  button-secondary-hover:
    backgroundColor: "{colors.muted}"
  button-tint:
    backgroundColor: "{colors.brand-tint}"
    textColor: "{colors.brand}"
    rounded: "{rounded.lg}"
    height: "52px"
  button-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    height: "52px"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    height: "52px"
  button-s:
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "40px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "52px"
  chip:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label-s}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
  chip-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.text-primary}"
  hablador:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.brand}"
    rounded: "10px"
    width: "76px"
    height: "64px"
  cupon:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    height: "108px"
  cupon-action:
    backgroundColor: "{colors.brand-tint}"
    textColor: "{colors.brand}"
    rounded: "9px"
    padding: "0 14px"
    height: "30px"
  segmented:
    backgroundColor: "{colors.segment}"
    rounded: "{rounded.lg}"
    padding: "4px"
  segmented-item-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "11px"
    height: "40px"
  tab-fab:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.surface}"
    rounded: "18px"
    size: "56px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
  sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.2xl}"
    padding: "12px 20px"
---

# Design System: Club Tambero

## Overview

**Creative North Star: "El mostrador de Tambo"**

Club Tambero vive en el celular del socio, frente a la caja, con una mano. El sistema toma el vocabulario de la tienda: el morado Tambo como techo de cada pantalla importante, los habladores amarillos que cuelgan de los anaqueles convertidos en el sello de valor de cada cupón, y boletos con perforación que se sienten arrancables. Todo lo demás es lienzo rosado muy pálido y superficies blancas que se quitan del camino para que el código y los cupones queden a un toque.

La densidad es de app de tienda: bloques grandes, títulos de página en mayúsculas extra negritas, cifras enormes para las visitas acumuladas, y textos cortos. Una sola familia, Schibsted Grotesk, sostiene toda la jerarquía con cuatro pesos (500 a 800). El sistema está fijado por el Figma "Club Tambero - Fase 0" (MVP V0); los nombres de token replican las variables de Figma por rol. Solo existe tema claro y móvil a 390px; tema oscuro y escritorio están fuera de esta maqueta.

Las sombras están teñidas de morado, nunca grises neutras: la profundidad se lee como la luz de la marca rebotando bajo las piezas. El movimiento es corto y con salida suave, con presiones que encogen levemente lo tocado.

**Key Characteristics:**
- Morado Tambo en cabeceras, botones primarios, pestaña activa y FAB central; amarillo solo en habladores, avisos de premio y selección.
- Lienzo #F7F2F6 con superficies blancas de radio 16 y sombras teñidas de marca.
- Una familia (Schibsted Grotesk), pesos 500/600/700/800, títulos de página en mayúsculas 800.
- Cupón como boleto de una sola pieza con muescas y perforación caladas por máscara.
- Barra inferior de cinco pestañas con "Mi tarjeta" como FAB morado elevado al centro.

## Colors

Una paleta de dos voces de tienda (morado y amarillo) sobre neutros rosados cálidos, con estados semánticos suaves.

### Primary
- **Morado Tambo** (brand): cabeceras de Inicio y tarjeta, botón primario, casilla marcada, interruptor encendido, barra de avance, pestaña activa, FAB "Mi tarjeta", foco. También es el color del texto y el borde inferior dentro de los habladores.
- **Morado presionado** (brand-pressed): solo el estado hover/presión del botón primario.
- **Rosa de marca** (brand-tint): fondo de fichas de ícono, botón y acción de cupón secundarios, chip de marca. Es el morado diluido para acciones de segundo nivel.
- **Morado noche** (brand-night): botón oscuro y superficies inversas (toast); coincide con el texto primario.

### Secondary
- **Amarillo hablador** (yellow): habladores de precio/descuento, tarjeta de avance hacia la sorpresa, avatar, chip amarillo, selección de texto y el ítem activo del índice del presentador. Sobre amarillo el texto va en morado o en morado noche, nunca en blanco.

### Neutral
- **Lienzo** (canvas): fondo de toda pantalla de la app.
- **Superficie** (surface): tarjetas, listas, campos, hojas, diálogos, barra inferior.
- **Atenuado** (muted) y **Sutil** (subtle): chips neutros, presión de filas, esqueletos, separadores.
- **Segmento** (segment): riel del control segmentado.
- **Texto primario / secundario / terciario** (text-primary, text-secondary, text-tertiary): títulos y valores; descripciones; ayudas, placeholders y etiquetas de pestaña inactiva.
- **Borde** (border-default): contorno de campos y botón secundario, asa de la hoja. **Borde de control** (border-control): casilla sin marcar. **Sello** (border-stamp): sello "Usado"/"Vencido".
- **Estados**: éxito, aviso y error en pares fondo/texto (success-bg/success, warning-bg/warning, error-bg/error); error también rellena el botón de peligro.
- **Apple** (apple): solo el botón de Apple.

### Named Rules
**The Two Voices Rule.** El morado actúa (botones, foco, navegación, cabeceras) y el amarillo anuncia valor (habladores, premio, selección). El amarillo nunca es un botón de acción por defecto ni un fondo de pantalla.

**The Ink On Yellow Rule.** Sobre amarillo el texto es morado Tambo o morado noche; jamás blanco.

## Typography

**Display Font:** Schibsted Grotesk (con system-ui, -apple-system, Segoe UI)
**Body Font:** Schibsted Grotesk

**Character:** Una grotesca de tienda, compacta y firme; la jerarquía sale del peso (500 cuerpo, 600 etiquetas, 700 títulos y botones, 800 cifras y títulos de página), no de cambiar de familia.

### Hierarchy
- **Display** (800, 44px/48px, -0.02em): el número de visitas acumuladas; siempre cifra tabular, nunca frase.
- **Headline** (800, 24px/32px, -0.005em, mayúsculas): títulos de página ("BENEFICIOS", "VISITAS") y titulares de bienvenida.
- **Bar** (800, 17px/22px): título centrado de la barra superior con volver/cerrar.
- **Title** (700, 18px/24px, -0.005em): títulos de sección dentro de una pantalla.
- **Title S** (700, 16px/22px): título de cupón, valores destacados, etiqueta junto al número grande.
- **Body** (500, 16px/24px): texto corrido e inputs (16px para evitar zoom en iOS).
- **Body S** (500, 14px/20px): descripciones de cupón y filas.
- **Label** (600, 14px/20px): etiquetas de campo, casillas, toasts. **Label S** (600, 12px/16px): chips, mensajes de error.
- **Note** (500, 12px/16px): ayudas y avisos en línea.
- **Button** (700, 16px/20px; 14px en botón S).
- **Data caption** (600, 11px/14px, 0.08em, mayúsculas): solo rótulos de dato pegados a su valor (términos de una lista de datos, campos del pase). No es un recurso para encabezar secciones.

### Named Rules
**The Weight Ladder Rule.** Cuatro pesos y una familia. Si algo necesita más jerarquía, sube de peso o de tamaño dentro de la escala Tambo; no se introduce otra fuente ni cursivas.

**The Tabular Count Rule.** Contadores en píldora, montos y listas de movimientos usan cifras tabulares. Los números grandes y el número de la tarjeta siguen al Figma con cifras proporcionales.

## Layout

Lienzo de teléfono de 390×844 con barra de estado de 47px e indicador de inicio de 34px; en dispositivo real ambos pasan a las áreas seguras del sistema. Cada pantalla es una columna: zona desplazable, pie fijo opcional para acciones y, en la app, barra inferior. El margen lateral es de 20px (space-5) en todas las pantallas; los bloques se separan en múltiplos de 4px (escala 4/8/12/16/20/24/32/48), con 12–16px entre elementos de una lista y 24–32px entre secciones.

Las cabeceras de marca (Inicio, tarjeta) son bloques morados altos (280px en Inicio) de los que la primera tarjeta blanca o amarilla sobresale encima del lienzo. Las acciones principales van a ancho completo en el pie.

Fuera del teléfono, el presentador de escritorio coloca un riel morado con el índice (280–320px), el teléfono enmarcado al centro y la nota de pantalla a la derecha; bajo 1180px desaparece la nota y bajo 860px el índice pasa a cajón lateral. Esto es andamiaje de la maqueta, no parte de la app.

## Elevation & Depth

Sistema híbrido: tonos (lienzo rosado bajo superficies blancas) más sombras suaves de dos capas teñidas con el morado de la marca. Las piezas que deben atraer la mano (tarjeta de código, FAB) tienen las sombras más profundas y moradas; el resto queda casi plano. Las piezas recortadas (cupón, FAB) usan `drop-shadow` en el contenedor para que la sombra siga la silueta y no el rectángulo.

### Shadow Vocabulary
- **Tarjeta** (`0 1px 2px rgba(31,21,32,.05), 0 4px 14px rgba(31,21,32,.06)`): tarjetas y listas sobre el lienzo.
- **Código de barras** (`0 16px 32px rgba(94,0,66,.45), 0 1px 2px rgba(31,21,32,.06)`): tarjeta del código sobre la cabecera morada.
- **FAB** (`drop-shadow(0 10px 9px rgba(141,0,96,.6))`): botón central "Mi tarjeta".
- **Cupón** (`drop-shadow(0 1px 1px rgba(31,21,32,.05)) drop-shadow(0 4px 7px rgba(31,21,32,.07))`): sigue las muescas del boleto.
- **Hoja** (`0 -12px 40px rgba(31,20,33,.18)`): hoja inferior. **Diálogo / toast** (`0 24px 60px` y `0 12px 30px rgba(31,20,33,.3)`).
- **Halo de foco** (`0 0 0 3px rgba(184,0,126,.14)`): campos y casillas con foco; en error, el mismo halo en rojo.

### Named Rules
**The Brand-Tinted Shadow Rule.** Toda sombra lleva el tinte del morado noche o del morado de marca; no hay sombras negras neutras ni desplazamientos duros sin desenfoque.

## Shapes

Esquinas generosas y amables, escaladas por tamaño: 8px chips y esqueletos, 12px campos y botón S, 14px botón M y segmentado, 16px tarjetas, listas y cupones, 20px tarjetas de código, 24px hojas y diálogos, píldora para contadores e interruptores. El FAB es un cuadrado redondeado (18px) con aro blanco de 4px, no un círculo. Los habladores son la única pieza con borde inferior grueso (3px morado, 4px en el grande), como la regleta del anaquel. El cupón es un boleto: dos muescas semicirculares de 9px en la costura a 88px del borde izquierdo y una línea de perforación de puntos, caladas con máscara para que se vea el fondo real.

## Components

### Buttons
Firmes y de tienda: anchos, altos y sin adornos.
- **Shape:** esquinas de 14px en M (52px de alto); 12px en S (40px).
- **Primary:** morado Tambo con texto blanco 16px/700, relleno lateral 20px; normalmente a ancho completo en el pie.
- **Hover / Press:** el primario pasa a morado presionado; todo botón se encoge a 0.98 al presionarse (160ms, salida suave). Deshabilitado al 40% de opacidad. Cargando: texto transparente y un aro giratorio.
- **Variantes:** secundario blanco con borde; tinte (rosa de marca, texto morado); amarillo (texto morado noche); oscuro; peligro (rojo); sobre-marca (blanco con texto morado, para cabeceras moradas); fantasma morado o rojo; Apple negro.
- **Enlace de texto:** 14px/700 en morado, sin subrayado.

### Chips
- **Style:** 24px de alto, radio 8px, 12px/600, ícono opcional a 4px.
- **State:** neutro (atenuado), aviso, éxito, error, amarillo, tinte, marca y código; comunican estado de cupón o visita, no son filtros. Contadores en píldora morada de 20px con cifras tabulares.

### Segmented
- Riel gris rosado con 4px de relleno y radio 14px; ítems de 40px, radio 11px, 15px/600. El activo es blanco, 700, con sombra mínima; transición de 320ms.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** superficie blanca sobre lienzo; tarjeta de avance en amarillo; tarjeta de código en blanco de código (#fefefe) con radio 16–20px.
- **Shadow Strategy:** sombra Tarjeta (ver Elevation & Depth).
- **Listas:** filas de 56px mínimo, relleno 12px 16px, separadas por línea sutil; presión con fondo atenuado. Fichas de ícono de 36px radio 10 (48px radio 14) en rosa de marca, amarillo, marca o atenuado.

### Inputs / Fields
- **Style:** 52px de alto, radio 12px, borde rosado grisáceo, fondo blanco, texto 16px/500; prefijo (+51) separado por línea vertical; etiqueta 14px/600 encima a 6px.
- **Focus:** borde morado y halo de 3px morado al 14%.
- **Error:** fondo #fffbfb, borde rojo, halo rojo y mensaje 12px/600 rojo con ícono.
- **Casilla:** 22px, radio 6px; marcada en morado con check blanco.
- **Interruptor:** 44×26 en píldora; encendido en morado.

### Navigation
- **Barra inferior:** blanca con línea superior sutil; cinco pestañas (Inicio, Beneficios, Mi tarjeta, Visitas, Perfil) de 72px con ícono 24px y etiqueta 11px/600. Inactiva en terciario, activa en morado. El centro es el FAB "Mi tarjeta": 56px, radio 18px, morado con aro blanco de 4px, elevado 26px sobre la barra, con su etiqueta siempre en morado.
- **Barra superior:** 52px con botones de ícono de 40px (radio 12) y título Bar centrado.
- **Transiciones:** empujar desde la derecha (420ms) para avanzar, regresar con la pantalla anterior desplazada -28% y oscurecida; fundido con subida de 8px para cambios de pestaña.

### Hablador (firma)
El cartel amarillo de anaquel que marca el valor. S: 76×64, radio 10, borde inferior 3px morado, rótulo 11px/600 en mayúsculas y cifra 20px/800 en morado. M (talón de cupón): 88px de ancho a toda la altura del boleto, sin radio ni borde, cifra 28px. L (detalle): 124×108, radio 14, borde 4px, cifra 40px. Usado o vencido: el mismo hablador en escala de grises al 55% ("plomo").

### Cupón (firma)
Un solo boleto de mínimo 108px: talón amarillo (hablador M) a la izquierda y cuerpo blanco, unidos por la perforación calada entre dos muescas. Cuerpo con relleno 14px 14px 14px 18px, título 16px/700, descripción 14px/500 y pie con vencimiento y acción "Usar" (30px, radio 9, rosa de marca, 13px/600). Presión a 0.985. Usado o vencido: hablador plomo y sello rotado -6° con borde de 1.5px.

### Sheets / Dialogs / Toasts
- Velo morado noche al 55%. Hoja inferior blanca con esquinas superiores de 24px, asa de 40×5 y entrada deslizante de 420ms. Diálogo centrado con radio 24px y relleno 24/20. Toast morado noche, radio 12px, 14px/600, encima de la barra inferior.

### App instalable (fuera del Figma)
Piezas agregadas para la demo PWA; reutilizan la hoja inferior y los tokens.
- **Invitación a instalar:** fila de app (ícono de 56px radio 13 con sombra morada, nombre 16px/700 y subtítulo Note), titular Headline sin mayúsculas, beneficios con fichas de 36px y botón primario a ancho completo; "Ahora no" como enlace centrado de 44px.
- **Pasos:** números en círculo de 26px en rosa de marca (13px/700 morado), paso 14px/500 y ayuda Note en terciario. Las teclas del navegador (Compartir, ···, Agregar a inicio) van como chip blanco de 22px, radio 6, borde por defecto e ícono morado de 16px.
- **Notificación:** tarjeta translúcida de radio 20 con ícono de app de 38px (radio 9), título 15px/700, "ahora" Note y texto 14px/19px hasta 3 líneas. Como banner baja desde arriba dentro del teléfono (520ms) y se va a los 6s; en la hoja de permiso aparece sobre una pantalla bloqueada morada.

### Skeletons
- Bloques con el radio de la pieza que reemplazan, en barrido atenuado→sutil de 1.4s; sobre cabeceras moradas, el barrido es blanco al 14–26%.

## Do's and Don'ts

### Do:
- **Do** usar los tokens por rol de Figma (`--bg-*`, `--text-*`, `--icon-*`, `--border-*`) en lugar de hex sueltos.
- **Do** poner el código del socio y los cupones a un toque: FAB central "Mi tarjeta" en toda pantalla con barra inferior.
- **Do** expresar el valor de un cupón siempre con un hablador amarillo (S, M o L) y su borde inferior morado.
- **Do** construir el cupón como una sola pieza recortada con máscara, con la sombra en `drop-shadow` del contenedor.
- **Do** usar Headline en mayúsculas 800 para títulos de página y Display con cifras tabulares para las visitas.
- **Do** teñir de morado toda sombra y mantener el margen lateral de 20px.
- **Do** respetar `prefers-reduced-motion`: animaciones y transiciones se reducen a 1ms.

### Don't:
- **Don't** poner texto blanco sobre amarillo ni usar amarillo como color de acción primaria.
- **Don't** introducir otra familia tipográfica, cursivas o pesos fuera de 500–800.
- **Don't** usar sombras grises neutras ni desplazamientos duros sin desenfoque.
- **Don't** usar el rótulo en mayúsculas espaciadas (11px, 0.08em) como antetítulo sobre títulos o secciones; es solo para rótulos de dato.

**Excepción del cliente.** Las líneas cortas que el Figma pone sobre un título dentro de una tarjeta ("¡Tu premio te espera!", "¡Desbloqueaste una sorpresa!", "CUPÓN 1 DE 4") son copy del diseño aprobado y se mantienen tal cual; no se extienden a títulos de página ni a secciones nuevas.
- **Don't** alterar el logo oficial ni escribir "Tambo+": logo negativo amarillo sobre morado, positivo morado sobre blanco o amarillo.

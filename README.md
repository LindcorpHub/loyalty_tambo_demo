# Club Tambero · Maqueta móvil (MVP V0)

Maqueta navegable del programa de lealtad **Club Tambero**, construida a partir del Figma *Club Tambero - Fase 0* (página **MVP V0**): versión móvil, tema claro, datos ficticios y sin llamadas a servicios.

- 24 pantallas: Acceso (A1–A5), Inicio y tarjeta (B1–B2), Visitas (R1–R3), Cupones (C1–C3), Perfil (E1–E3) y Estados (S1–S7).
- En computadora se muestra dentro de un teléfono, con el índice de pantallas a la izquierda y una nota de cada pantalla a la derecha (flechas ← → para recorrerlas).
- En un celular se abre a pantalla completa, como la web real. Para saltar entre pantallas, toca la pestaña del borde izquierdo.
- La socia de ejemplo es **Carla Mendoza**. La contraseña ya viene escrita (`Tambo123`): basta tocar **Iniciar sesión**; con el correo vacío se entra como Carla. Cualquier otra contraseña muestra el aviso de credenciales incorrectas.

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
assets/                 Logo Tambo, código de barras e imágenes exportadas de Figma
```

Para cambiar los datos de la demo (nombre, visitas, cupones) edita `js/data.js`.

## Qué no incluye

- Tema oscuro y versión escritorio (W1–W9): existen en el Figma pero quedan fuera de esta maqueta.
- Llamadas reales al BFF, Wallet, Google o Apple: los botones responden con datos de ejemplo.

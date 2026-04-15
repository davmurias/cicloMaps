# Design System & UI/UX Constitution

> *Ningún Frontend Expert de Antigravity tiene la autoridad para vulnerar las proporciones y directrices geométricas firmadas en este documento.*

## 1. Topología del Glassmorphism
El sistema obedece a un esquema Premium visual para mapas oscuros:
- **Paneles Overlay:** Deben usar fondos de alto desenfoque. Regla CSS estricta: `backdrop-filter: blur(16px); background: rgba(15, 23, 42, 0.75);`.
- **Bordes Activos:** `border: 1px solid rgba(255, 255, 255, 0.1);` para separar los layers del canvas de mapa subyacente.

## 2. Paleta de Colores (P3 Scheme Variables)
- `:root` controlará toda variable `var(...)`.
- **Fondo Primario:** `#0f172a` (Slate oscuro intenso).
- **Ruta Activa Neon:** `#0ea5e9` (Cyan elécrtico). Genera contraste visible (WCAG AAA) sobre el mapa.
- **Accentos (Hover/Activo):** `#3b82f6` (Azul purista para toggles activos).

## 3. Tipografía y Jerarquía
- Prohibición estricta de fuentes de sistema feas. Uso inamovible de familias **Inter**, **Roboto** o nativas legibles de San Francisco.
- Tamaños basados empíricamente en `rem` (relativo a 16px).
  - Titulares `h1/h2`: `1.5rem`, `font-weight: 600`, tracking de letra estrecho.
  - Subtitulares e Infos: `0.875rem`, `color: #cbd5e1`.

## 4. Breakpoints Responsivos e Interacción
- Cualquier barra o menú lateral es *Absolute* o *Fixed*.
- En `@media (max-width: 768px)` (Dispositivos Móviles):
  - Queda terminantemente prohibido mantener un Dashboard fijo a la izquierda. Se colapsará automáticamente a un formato `Bottom-Sheet` (Panel inferior subrepticio) que cubra como máximo el 40% de la altura inferior (Viewport) para dejar usar el mapa.
- Transiciones Mandatarias: Todos los botones deben tener `transition: all 0.3s ease;` sin excepciones. Nada debe cambiar abruptamente.

## 5. Criterios A11Y (Accesibilidad)
- Ratio de Contraste evaluado según estándar WCAG 2.2.
- El Dashboard interactivo deberá tener la semántica `role="complementary"` o `role="search"`.
- Los campos de input requieren un identificador HTML claro y visible o un `aria-label` descriptivo.

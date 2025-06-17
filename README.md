# 🍸 ForeverClassics

Un proyecto frontend desarrollado con **Astro** y **TailwindCSS**, que implementa un carrusel horizontal de tarjetas para representar cócteles clásicos con animación de giro (flip-card) y scroll infinito simulado. Cada tarjeta incluye imagen, descripción, receta, preparación e historia del cóctel.

---

## 🧱 Stack Técnico

- **Astro** — Framework frontend optimizado para performance
- **TailwindCSS** — Utilizado para estilos utilitarios rápidos y responsive
- **Vanilla JS** — Lógica de scroll, flipping y centrado de tarjetas
- **Looped Array** — Técnica de duplicado de extremos para scroll infinito sin límites visibles
- **CSS personalizado** — Flip 3D con `transform-style: preserve-3d` y `backface-visibility`

---

## 📦 Instalación

```bash
git clone https://github.com/rhodlib/forever-classics.git
cd foreverclassics
npm install
npm run dev

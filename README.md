# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# Vistas previas de clips

Vercel sirve `/clips/<id>` mediante `api/clip-preview.js`. La función usa el `VITE_PROJECTID` del frontend para consultar el documento público de Firestore y agregar los metadatos al HTML compilado. Configura `SITE_URL` con el dominio público si quieres fijar la URL canónica. Si queda vacío, se usa el dominio de la solicitud.

La portada usa `thumbnailUrl` del documento si contiene una URL HTTPS pública, o la miniatura de ImageKit o YouTube cuando está disponible. Los clips de R2 sin portada propia usan la imagen de Perro Flautas. Los MP4 públicos también incluyen `og:video`.

## Colecciones

En **Dashboard → Colecciones** se pueden crear y editar colecciones con clips y capturas existentes y elegir cuál se destaca en Inicio. Las colecciones tienen enlaces públicos bajo `/colecciones`.

Si las reglas desplegadas de Firestore aún no contemplan `Collections`, añade este bloque dentro de `match /databases/{database}/documents` y sustituye el UID de ejemplo por los UID autorizados del panel. El documento `_featured` en la misma colección guarda qué colección se muestra en Inicio.

```txt
match /Collections/{collectionId} {
  allow read: if true;
  allow create, update: if request.auth != null
    && request.auth.uid in ['UID_ADMIN'];
}
```

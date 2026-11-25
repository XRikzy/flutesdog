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

Al crear un clip se puede elegir una miniatura JPG, PNG o WebP de hasta 10 MiB. La API firma la subida en `clip-thumbnails/` de R2 y el frontend guarda su URL en `thumbnailUrl`. Despliega la API actualizada antes de usar la subida de miniaturas.

## Colecciones

En **Colecciones → Crear colección**, cualquier usuario con sesión de Google puede elegir clips y capturas, subir una portada y ver la vista previa antes de guardar. La portada usa la imagen propia, una captura de la colección o la imagen de Perro Flautas, en ese orden. En **Dashboard → Colecciones**, los administradores pueden editar y eliminar colecciones, reemplazar o quitar portadas y elegir una colección destacada. Al eliminar la destacada se limpia su referencia en la misma transacción. Las acciones sobre las colecciones conservan los archivos de R2.

Para habilitar la creación con cuentas normales, integra este bloque en las reglas existentes de Firestore en `match /databases/{database}/documents` y sustituye el UID de ejemplo. Revisa que ninguna regla general conceda escrituras adicionales a `Collections`. Despliega también la API actualizada, que firma las subidas de portadas al prefijo `collection-covers/` de R2.

```txt
match /Collections/{collectionId} {
  allow read: if true;
  function collectionAdmin() {
    return request.auth != null && request.auth.uid in ['UID_ADMIN'];
  }

  function validCollection(item) {
    return item.title is string && item.title.size() > 0 && item.title.size() <= 80
      && item.description is string && item.description.size() <= 300
      && item.clipIds is list && item.screenshotIds is list
      && item.coverUrl is string && item.coverUrl.size() <= 2048
      && (item.coverUrl == '' || item.coverUrl.matches('https://.+'));
  }

  allow create: if request.auth != null && collectionId != '_featured'
    && request.resource.data.keys().hasOnly(['title', 'description', 'clipIds', 'screenshotIds', 'coverUrl', 'ownerUid'])
    && request.resource.data.ownerUid == request.auth.uid
    && validCollection(request.resource.data);
  allow update: if collectionAdmin() && collectionId != '_featured'
    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['title', 'description', 'clipIds', 'screenshotIds', 'coverUrl'])
    && validCollection(request.resource.data);
  allow delete: if collectionAdmin() && collectionId != '_featured';
  allow create, update: if collectionAdmin() && collectionId == '_featured'
    && request.resource.data.keys().hasOnly(['collectionId'])
    && request.resource.data.collectionId is string
    && (request.resource.data.collectionId == ''
      || (request.resource.data.collectionId != '_featured'
        && existsAfter(/databases/$(database)/documents/Collections/$(request.resource.data.collectionId))));
}
```

## Inicio de sesión y administración

El modal de cuenta usa Google mediante Firebase Auth y se abre sobre la página actual. El enlace directo `/login` abre el mismo modal sobre Inicio. El panel `/dashboard` exige que el documento `Users/<uid>` tenga `role: "admin"`. Las cuentas nuevas se registran con `role: "user"`.

En las reglas desplegadas de Firestore, las cuentas normales deben poder crear su propio documento únicamente con el rol `user`, y sus actualizaciones deben conservar el rol existente. Asigna `admin` desde un entorno de confianza. Los permisos de escritura de cada colección deben validarse en Firestore independientemente de la navegación del frontend.

import couldinary from "cloudinary";

couldinary.v2.config({
  cloud_name: import.meta.env.VITE_COULDNAME,
  api_key: import.meta.env.VITE_API_COUDLSTORAGE_KEY,
  api_secret: import.meta.env.VITE_API_SECRET_CLOUDSTOREGEKEY,
  secure: import.meta.env.VITE_SECURE,
});

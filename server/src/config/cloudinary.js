import { v2 as cloudinary } from "cloudinary";

const requiredConfig = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const key of requiredConfig) {
  if (!process.env[key]?.trim()) {
    throw new Error(`${key} is missing from the server environment`);
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
  api_key: process.env.CLOUDINARY_API_KEY.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
  secure: true,
});

export default cloudinary;

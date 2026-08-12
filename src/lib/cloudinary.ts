import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_URL (or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET).");
  }
  if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  configured = true;
}

export function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME);
}

/** Mirrors a remote image (or a data: URL) into Cloudinary and returns the hosted URL. */
export async function uploadImageToCloudinary(source: string, folder = "highsocietymn/products"): Promise<string> {
  ensureConfigured();
  const result = await cloudinary.uploader.upload(source, {
    folder,
    overwrite: false,
    unique_filename: true,
    resource_type: "image",
  });
  return result.secure_url;
}

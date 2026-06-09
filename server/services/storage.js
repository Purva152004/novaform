import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadBufferToCloudinary = (buffer, { folder, filename, resourceType = "raw" }) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: resourceType,
        overwrite: false
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

export const uploadPublicFile = async (file) => {
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "nova-forms";
  const extension = (file.originalname.split(".").pop() || "bin").toLowerCase();
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

  const resourceType =
    file.mimetype?.startsWith("image/")
      ? "image"
      : file.mimetype?.startsWith("video/")
        ? "video"
        : "raw";

  const result = await uploadBufferToCloudinary(file.buffer, {
    folder,
    filename: safeName,
    resourceType
  });

  return {
    name: file.originalname,
    type: file.mimetype || "application/octet-stream",
    size: file.size,
    url: result.secure_url,
    storageKey: result.public_id
  };
};

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image: Blob): Promise<string | null> {
  try {
    const base64Image = await blobToBase64(image);
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'courses',
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    blob.arrayBuffer().then((buffer) => {
      const base64 = Buffer.from(buffer).toString('base64');
      resolve(`data:application/octet-stream;base64,${base64}`);
    }).catch((error) => {
      reject(error);
    });
  });
}
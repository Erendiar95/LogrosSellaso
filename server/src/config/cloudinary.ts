import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Cloudinary a través de variables de entorno individuales o CLOUDINARY_URL
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Verifica si las variables de entorno de Cloudinary están configuradas
 */
export const isCloudinaryConfigured = (): boolean => {
  if (process.env.CLOUDINARY_URL) return true;
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width?: number;
  height?: number;
}

/**
 * Sube un buffer de imagen directamente a Cloudinary utilizando un stream
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = 'logros/achievements'
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(
        new Error(
          'Cloudinary no está configurado. Por favor, define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en el archivo .env'
        )
      );
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }, // Optimización automática
        ],
      },
      (error, result) => {
        if (error) {
          console.error('Error al subir a Cloudinary:', error);
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Respuesta vacía de Cloudinary'));
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Elimina una imagen de Cloudinary a partir de su public_id o secure_url
 */
export const deleteFromCloudinary = async (imageUrlOrPublicId: string): Promise<void> => {
  if (!isCloudinaryConfigured() || !imageUrlOrPublicId) return;

  try {
    let publicId = imageUrlOrPublicId;

    // Si es una URL completa de Cloudinary, extraer el public_id
    if (imageUrlOrPublicId.includes('cloudinary.com')) {
      const parts = imageUrlOrPublicId.split('/upload/');
      if (parts.length > 1) {
        // Remover versión (v12345678/) y extensión (.jpg)
        const pathAfterUpload = parts[1].replace(/^v\d+\//, '');
        publicId = pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf('.')) || pathAfterUpload;
      }
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error);
  }
};

export { cloudinary };

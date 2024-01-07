import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

/**
 *
 * @param {*} file  Archivo a subir
 * @param {*} folder  Carpeta donde se guardara el archivo
 * @param {*} resourceType  Tipo de recurso ``` "image" | "video" | "raw" | "auto" ```
 * @returns {object} ```
 * {
      asset_id: string,
      public_id: string,
      width: number;
      height: number;
      format: string;
      resource_type: "image" | "video" | "raw" | "auto";
      created_at: string;
      url: string;
      secure_url: string;
      original_filename: string;
 * }
 * ```
 * @example  const data = await uploadFile({ path, folder, resourceType: 'image' })
 */

export const uploadFile = (file, folder, resourceType = 'image') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );

    streamifier.createReadStream(file.data).pipe(uploadStream);
  });
};

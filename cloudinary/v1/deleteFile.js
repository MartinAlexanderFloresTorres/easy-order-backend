import { v2 as cloudinary } from 'cloudinary';

/**
 * @param {string} publicId  Id de la imagen a eliminar
 * @param {string} resourceType  Tipo de recurso ``` "image" | "video" | "raw" | "auto" ```
 * @returns {object} ```
 * {
      result: string;
      id: string;
      type: string;
  * }
  * ```
  * @example  const data = await deleteFile(publicId, resourceType)
  * @example  const data = await deleteFile('shop-app/productos/13124', 'image')
*/

export const deleteFile = async (publicId, resourceType) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
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
  });
};

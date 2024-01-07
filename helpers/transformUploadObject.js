/**
 *
 * @param {*} uploadCloudinary Objeto que se obtiene al subir un archivo a cloudinary
 * @returns  {object} ```
 * {
      public_id: string,
      secure_url: string;
      url: string;
      width: number;
      height: number;
      format: string;
      resource_type: "image" | "video" | "raw" | "auto";
      folder: string;
      created_at: string;
  * }
  * ```
 */

const transformUploadObject = (uploadCloudinary) => ({
  public_id: uploadCloudinary.public_id,
  secure_url: uploadCloudinary.secure_url,
  url: uploadCloudinary.url,
  width: uploadCloudinary.width,
  height: uploadCloudinary.height,
  format: uploadCloudinary.format,
  resource_type: uploadCloudinary.resource_type,
  folder: uploadCloudinary.folder,
  created_at: uploadCloudinary.created_at,
});

export default transformUploadObject;

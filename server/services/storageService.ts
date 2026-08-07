import supabase from "../config/supabase.js";
import path from "path";

const BUCKET_NAME = "media";

/**
 * Uploads a file buffer to Supabase Storage bucket.
 * Returns the public URL of the uploaded asset.
 */
export const uploadFileToStorage = async (
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  folder: string = "uploads"
): Promise<string> => {
  try {
    const ext =
      path.extname(originalFilename) ||
      (mimeType.includes("video") ? ".mp4" : ".png");
    const uniqueFilename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFilename, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.error("Supabase Storage Upload Error:", error.message);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uniqueFilename);

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.error("Error in uploadFileToStorage:", err?.message || err);
    throw err;
  }
};

/**
 * Deletes a file from Supabase Storage given its public URL or storage path.
 */
export const deleteFileFromStorage = async (
  publicUrlOrPath: string
): Promise<boolean> => {
  try {
    let filePath = publicUrlOrPath;
    if (
      publicUrlOrPath.includes(`/storage/v1/object/public/${BUCKET_NAME}/`)
    ) {
      filePath = publicUrlOrPath.split(
        `/storage/v1/object/public/${BUCKET_NAME}/`
      )[1];
    }

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.warn("Supabase Storage Delete Warning:", error.message);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("Error in deleteFileFromStorage:", err?.message || err);
    return false;
  }
};

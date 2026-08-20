// Maps a product's `image_key` (editable in admin) to a bundled product photo.
import blackTee from "@/assets/merch-black-oversized-tee.png.asset.json";
import whiteTee from "@/assets/merch-white-tee.png.asset.json";

export const MERCH_IMAGES: Record<string, string> = {
  "black-oversized-tee": blackTee.url,
  "white-tee": whiteTee.url,
};

export const getMerchImage = (imageKey: string | null): string | null =>
  imageKey ? MERCH_IMAGES[imageKey] ?? null : null;

// Maps a product's `image_key` (set in the database) to a bundled product photo.
import blackTee from "@/assets/merch-black-oversized-tee.png";
import whiteTee from "@/assets/merch-white-tee.png";

export const MERCH_IMAGES: Record<string, string> = {
  "black-oversized-tee": blackTee,
  "white-tee": whiteTee,
};

export const getMerchImage = (imageKey: string | null): string | null =>
  imageKey ? MERCH_IMAGES[imageKey] ?? null : null;

// Maps a product's `image_key` (set in the database) to a product photo.
import blackTee from "@/assets/merch-black-oversized-tee.png";
import whiteTee from "@/assets/merch-white-tee.png";
import blackRedTee from "@/assets/merch-black-red-tee.png.asset.json";
import greenTee from "@/assets/merch-green-tee.png.asset.json";
import blackRedHoodie from "@/assets/merch-black-red-hoodie.png.asset.json";
import blackGreyHoodie from "@/assets/merch-black-grey-hoodie.png.asset.json";

export const MERCH_IMAGES: Record<string, string> = {
  "black-oversized-tee": blackTee,
  "white-tee": whiteTee,
  "black-red-tee": blackRedTee.url,
  "green-tee": greenTee.url,
  "black-red-hoodie": blackRedHoodie.url,
  "black-grey-hoodie": blackGreyHoodie.url,
};

export const getMerchImage = (imageKey: string | null): string | null =>
  imageKey ? MERCH_IMAGES[imageKey] ?? null : null;

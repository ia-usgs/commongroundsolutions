// Single merch product card: photo, price, size picker (with stock), order button.
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/features/signups/discounts";
import { getMerchImage } from "../data/images";
import { availabilityKey, type AvailabilityMap } from "../api";
import type { MerchProduct } from "../types";

type Props = {
  product: MerchProduct;
  availability: AvailabilityMap;
  onOrder: (product: MerchProduct, size: string) => void;
};

export const MerchProductCard = ({ product, availability, onOrder }: Props) => {
  const remainingFor = (option: string) =>
    availability[availabilityKey(product.id, option)] ?? 0;

  const firstInStock = product.sizes.find((option) => remainingFor(option) > 0) ?? "";
  const [size, setSize] = useState(firstInStock);
  const image = getMerchImage(product.image_key);

  useEffect(() => {
    setSize((current) => (current && remainingFor(current) > 0 ? current : firstInStock));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability, product.id]);

  const allSoldOut = product.sizes.every((option) => remainingFor(option) <= 0);
  const selectedRemaining = size ? remainingFor(size) : 0;

  return (
    <article className="border border-border bg-card overflow-hidden flex flex-col">
      {image && (
        <div className="bg-black relative">
          <img
            src={image}
            alt={`${product.name} front and back print`}
            loading="lazy"
            className="w-full h-64 sm:h-80 object-contain"
          />
          {allSoldOut && (
            <span className="absolute top-3 left-3 font-heading text-xs uppercase tracking-widest bg-background/90 text-destructive border border-destructive px-2 py-1">
              Sold Out
            </span>
          )}
        </div>
      )}
      <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="font-heading text-xl sm:text-2xl uppercase tracking-widest text-foreground">
            {product.name}
          </h3>
          <p className="font-heading text-primary tracking-widest mt-1">
            {formatCents(product.price_cents)}
          </p>
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((option) => {
              const remaining = remainingFor(option);
              const out = remaining <= 0;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={out}
                  onClick={() => setSize(option)}
                  title={out ? "Sold out" : `${remaining} left`}
                  className={`px-3 py-1 text-sm font-heading tracking-wider border transition-colors ${
                    out
                      ? "border-border/50 text-muted-foreground/40 line-through cursor-not-allowed"
                      : size === option
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {allSoldOut
              ? "All sizes are sold out."
              : size
                ? `${selectedRemaining} left in ${size}`
                : "Select a size"}
          </p>
        </div>

        {product.badges.length > 0 && (
          <ul className="space-y-1 mt-auto">
            {product.badges.map((badge) => (
              <li key={badge} className="text-[11px] uppercase tracking-widest text-primary/80">
                {badge}
              </li>
            ))}
          </ul>
        )}

        <Button
          className="w-full"
          disabled={allSoldOut || !size}
          onClick={() => onOrder(product, size)}
        >
          {allSoldOut ? "Sold Out" : "Order Now"}
        </Button>
      </div>
    </article>
  );
};

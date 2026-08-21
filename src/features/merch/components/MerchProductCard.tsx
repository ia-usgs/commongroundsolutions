// Single merch product card: photo, price, size picker, order button.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/features/signups/discounts";
import { getMerchImage } from "../data/images";
import type { MerchProduct } from "../types";

type Props = {
  product: MerchProduct;
  onOrder: (product: MerchProduct, size: string) => void;
};

export const MerchProductCard = ({ product, onOrder }: Props) => {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const image = getMerchImage(product.image_key);

  return (
    <article className="border border-border bg-card overflow-hidden flex flex-col">
      {image && (
        <div className="bg-black">
          <img
            src={image}
            alt={`${product.name} front and back print`}
            loading="lazy"
            className="w-full h-64 sm:h-80 object-contain"
          />
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
            {product.sizes.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSize(option)}
                className={`px-3 py-1 text-sm font-heading tracking-wider border transition-colors ${
                  size === option
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
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

        <Button className="w-full" onClick={() => onOrder(product, size)}>
          Order Now
        </Button>
      </div>
    </article>
  );
};

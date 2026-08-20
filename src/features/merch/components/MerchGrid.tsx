// Loads active merch products and wires the order modal.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchMerchProducts } from "../api";
import type { MerchProduct } from "../types";
import { MerchProductCard } from "./MerchProductCard";
import { MerchOrderModal } from "./MerchOrderModal";

export const MerchGrid = () => {
  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{ product: MerchProduct; size: string } | null>(null);

  useEffect(() => {
    fetchMerchProducts()
      .then(setProducts)
      .catch(() => toast.error("Could not load merch right now"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-muted-foreground text-center py-10">Loading merch...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-10">
        No merch available right now — check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {products.map((product) => (
          <MerchProductCard
            key={product.id}
            product={product}
            onOrder={(p, size) => setSelected({ product: p, size })}
          />
        ))}
      </div>

      <MerchOrderModal
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        product={selected?.product ?? null}
        initialSize={selected?.size}
      />
    </>
  );
};

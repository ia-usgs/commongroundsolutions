// Admin "Merch Products" manager — edit name, description, price, order; toggle availability.
import { useEffect, useState } from "react";
import { Power, Save } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchMerchProducts, updateMerchProduct } from "@/features/merch/api";
import type { MerchProduct } from "@/features/merch/types";

type Draft = { name: string; description: string; price: string; sort_order: string };

export const MerchProductsManager = () => {
  const [products, setProducts] = useState<MerchProduct[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  const load = async () => {
    try {
      const rows = await fetchMerchProducts({ includeInactive: true });
      setProducts(rows);
      setDrafts(
        Object.fromEntries(
          rows.map((p) => [
            p.id,
            {
              name: p.name,
              description: p.description ?? "",
              price: (p.price_cents / 100).toFixed(2),
              sort_order: String(p.sort_order),
            },
          ]),
        ),
      );
    } catch {
      toast.error("Could not load merch products");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setDraft = (id: string, patch: Partial<Draft>) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const save = async (product: MerchProduct) => {
    const draft = drafts[product.id];
    const price = Math.round(Number(draft.price) * 100);
    if (!draft.name.trim() || !Number.isFinite(price) || price < 0) {
      toast.error("Enter a valid name and price");
      return;
    }
    try {
      await updateMerchProduct(product.id, {
        name: draft.name.trim(),
        description: draft.description.trim() || null,
        price_cents: price,
        sort_order: Number(draft.sort_order) || 0,
      } as Partial<MerchProduct>);
      toast.success("Product updated");
      load();
    } catch {
      toast.error("Could not update product");
    }
  };

  const toggle = async (product: MerchProduct) => {
    try {
      await updateMerchProduct(product.id, { active: !product.active });
      toast.success(product.active ? "Product hidden" : "Product is live");
      load();
    } catch {
      toast.error("Could not update product");
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl sm:text-2xl uppercase tracking-widest text-foreground">
        Merch Products
      </h2>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-sm">No products yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {products.map((product) => {
            const draft = drafts[product.id];
            if (!draft) return null;
            return (
              <div key={product.id} className="border border-border p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{product.slug}</span>
                  <Badge variant={product.active ? "default" : "outline"}>
                    {product.active ? "Live" : "Hidden"}
                  </Badge>
                </div>

                <div>
                  <Label htmlFor={`name-${product.id}`}>Name</Label>
                  <Input
                    id={`name-${product.id}`}
                    value={draft.name}
                    onChange={(e) => setDraft(product.id, { name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor={`desc-${product.id}`}>Description</Label>
                  <Textarea
                    id={`desc-${product.id}`}
                    rows={2}
                    value={draft.description}
                    onChange={(e) => setDraft(product.id, { description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`price-${product.id}`}>Price (USD)</Label>
                    <Input
                      id={`price-${product.id}`}
                      value={draft.price}
                      onChange={(e) => setDraft(product.id, { price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`sort-${product.id}`}>Display order</Label>
                    <Input
                      id={`sort-${product.id}`}
                      value={draft.sort_order}
                      onChange={(e) => setDraft(product.id, { sort_order: e.target.value })}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Sizes: {product.sizes.join(", ") || "—"}
                </p>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => save(product)}>
                    <Save className="h-4 w-4" />
                    <span className="ml-2">Save</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggle(product)}>
                    <Power className="h-4 w-4" />
                    <span className="ml-2">{product.active ? "Hide" : "Show"}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

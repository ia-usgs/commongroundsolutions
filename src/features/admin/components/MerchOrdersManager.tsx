// Admin "Merch Orders" manager — review orders, mark paid/shipped/cancelled, delete.
import { useEffect, useState } from "react";
import { PackageCheck, RefreshCw, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCents } from "@/features/signups/discounts";
import {
  deleteMerchOrder,
  fetchMerchOrders,
  updateMerchOrderStatus,
} from "@/features/merch/api";
import type { MerchOrderRow, MerchOrderStatus } from "@/features/merch/types";

const STATUS_VARIANT: Record<MerchOrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  paid: "default",
  shipped: "secondary",
  cancelled: "destructive",
};

export const MerchOrdersManager = () => {
  const [orders, setOrders] = useState<MerchOrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setOrders(await fetchMerchOrders());
    } catch {
      toast.error("Could not load merch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: MerchOrderStatus) => {
    try {
      await updateMerchOrderStatus(id, status);
      toast.success(`Order marked ${status}`);
      load();
    } catch {
      toast.error("Could not update order");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await deleteMerchOrder(id);
      toast.success("Order deleted");
      load();
    } catch {
      toast.error("Could not delete order");
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl sm:text-2xl uppercase tracking-widest text-foreground">
          Merch Orders
        </h2>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">No merch orders yet.</p>
      ) : (
        <div className="border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="align-top">
                    <div className="font-medium">
                      {order.first_name} {order.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">{order.email}</div>
                    {order.phone && (
                      <div className="text-xs text-muted-foreground">{order.phone}</div>
                    )}
                  </TableCell>
                  <TableCell className="align-top">{order.product_name}</TableCell>
                  <TableCell className="align-top">{order.size}</TableCell>
                  <TableCell className="align-top">{order.quantity}</TableCell>
                  <TableCell className="align-top text-xs">
                    {order.fulfillment === "ship" ? (
                      <div>
                        <div className="uppercase tracking-wider">Ship</div>
                        <div className="text-muted-foreground">
                          {order.ship_address_line1}
                          {order.ship_address_line2 ? `, ${order.ship_address_line2}` : ""}
                          <br />
                          {order.ship_city}, {order.ship_state} {order.ship_postal_code}
                        </div>
                      </div>
                    ) : (
                      <span className="uppercase tracking-wider">Pickup</span>
                    )}
                  </TableCell>
                  <TableCell className="align-top">{formatCents(order.total_cents)}</TableCell>
                  <TableCell className="align-top capitalize">{order.payment_method}</TableCell>
                  <TableCell className="align-top font-mono text-xs">
                    {order.reference_code}
                  </TableCell>
                  <TableCell className="align-top">
                    <Badge variant={STATUS_VARIANT[order.status]} className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex justify-end gap-1">
                      {order.status === "pending" && (
                        <Button size="sm" variant="outline" onClick={() => setStatus(order.id, "paid")}>
                          Paid
                        </Button>
                      )}
                      {order.status !== "shipped" && order.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatus(order.id, "shipped")}
                          title="Mark shipped"
                        >
                          <PackageCheck className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatus(order.id, "cancelled")}
                          title="Cancel order"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => remove(order.id)}
                        title="Delete order"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

import { z } from "zod";

export const merchOrderFormSchema = z
  .object({
    first_name: z.string().trim().min(1, "First name is required").max(100),
    last_name: z.string().trim().min(1, "Last name is required").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
    size: z.string().min(1, "Select a size"),
    quantity: z.number().int().min(1).max(2, "Limit 2 per item and size"),
    fulfillment: z.enum(["pickup", "ship"]),
    ship_address_line1: z.string().trim().max(200),
    ship_address_line2: z.string().trim().max(200),
    ship_city: z.string().trim().max(120),
    ship_state: z.string().trim().max(80),
    ship_postal_code: z.string().trim().max(20),
    payment_method: z.enum(["zelle", "venmo"]),
    notes: z.string().trim().max(2000),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment !== "ship") return;
    const required: Array<[keyof typeof data, string]> = [
      ["ship_address_line1", "Street address is required"],
      ["ship_city", "City is required"],
      ["ship_state", "State is required"],
      ["ship_postal_code", "ZIP code is required"],
    ];
    for (const [field, message] of required) {
      if (!String(data[field] ?? "").trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
      }
    }
  });

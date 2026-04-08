import { z } from "zod";

const nullableDateTime = z
  .string()
  .datetime()
  .nullable()
  .optional();

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Coupon code must be at least 3 characters.")
      .max(50, "Coupon code is too long.")
      .regex(
        /^[A-Za-z0-9_-]+$/,
        "Coupon code can contain letters, numbers, dash, underscore only.",
      ),
    description: z.string().max(300).optional().or(z.literal("")),
    discount_type: z.enum(["percentage", "fixed"]),
    discount_value: z.coerce.number().positive("Discount value must be greater than 0."),
    min_order_total: z.coerce.number().min(0).default(0),
    max_discount_amount: z.coerce.number().positive().nullable().optional(),
    usage_limit: z.coerce.number().int().positive().nullable().optional(),
    starts_at: nullableDateTime,
    ends_at: nullableDateTime,
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) =>
      data.discount_type !== "percentage" || data.discount_value <= 100,
    {
      message: "Percentage discount cannot exceed 100.",
      path: ["discount_value"],
    },
  )
  .refine(
    (data) =>
      !data.starts_at ||
      !data.ends_at ||
      new Date(data.starts_at) <= new Date(data.ends_at),
    {
      message: "End date must be after start date.",
      path: ["ends_at"],
    },
  );

export const updateCouponSchema = createCouponSchema.partial();

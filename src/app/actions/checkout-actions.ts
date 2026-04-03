"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `DB-${y}${m}${d}-${random}`;
}

export async function createOrderFromCartAction(formData: FormData) {
  const paymentMethodRaw = formData.get("payment_method");
  const paymentMethod =
    paymentMethodRaw === "bank_transfer" ? "bank_transfer" : "cod";

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Please log in first." };
  }

  await supabase.from("profiles" as never).upsert({
    id: user.id,
    email: user.email,
  } as never);

  const { data: cart, error: cartError } = await supabase
    .from("carts" as never)
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const cartRow = cart as { id: string } | null;

  if (cartError || !cartRow) {
    return { error: "Cart not found." };
  }

  const { data: cartItems, error: cartItemsError } = await supabase
    .from("cart_items" as never)
    .select(
      `
      id,
      quantity,
      product_id,
      products (
        id,
        seller_id,
        name,
        slug,
        sku,
        price,
        thumbnail_url
      )
    `,
    )
    .eq("cart_id", cartRow.id);

  const cartItemRows = cartItems as any[] | null;

  if (cartItemsError) {
    return { error: cartItemsError.message };
  }

  if (!cartItemRows || cartItemRows.length === 0) {
    return { error: "Your cart is empty." };
  }

  const { data: address, error: addressError } = await supabase
    .from("addresses" as never)
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const addressRow = address as
    | {
        id: string;
        recipient_name: string | null;
        phone: string | null;
        address_line_1: string | null;
        address_line_2: string | null;
        city: string | null;
        state: string | null;
        postal_code: string | null;
        country: string | null;
      }
    | null;

  if (addressError) {
    return { error: addressError.message };
  }

  if (!addressRow) {
    return { error: "Please add a delivery address first." };
  }

  let subtotal = 0;

  const normalizedItems = cartItemRows
    .map((item: any) => {
      const product = item.products;

      if (!product) return null;

      const unitPrice = Number(product.price || 0);
      const quantity = Number(item.quantity || 1);
      const lineTotal = unitPrice * quantity;

      subtotal += lineTotal;

      return {
        product_id: product.id,
        seller_id: product.seller_id ?? null,
        product_name: product.name,
        product_slug: product.slug,
        product_image_url: product.thumbnail_url,
        sku: product.sku ?? null,
        unit_price: unitPrice,
        quantity,
        line_total: lineTotal,
      };
    })
    .filter(Boolean);

  if (normalizedItems.length === 0) {
    return { error: "No valid products found in cart." };
  }

  const shippingFee = 0;
  const discountAmount = 0;
  const totalAmount = subtotal + shippingFee - discountAmount;
  const orderNumber = generateOrderNumber();

  const { data: newOrder, error: orderError } = await supabase
    .from("orders" as never)
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      address_id: addressRow.id,
      shipping_full_name: addressRow.recipient_name,
      shipping_phone: addressRow.phone,
      shipping_address_line_1: addressRow.address_line_1,
      shipping_address_line_2: addressRow.address_line_2,
      shipping_city: addressRow.city,
      shipping_state: addressRow.state,
      shipping_postal_code: addressRow.postal_code,
      shipping_country: addressRow.country ?? "Sri Lanka",
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
    } as never)
    .select("id, order_number")
    .single();

  const createdOrder = newOrder as { id: string; order_number: string } | null;

  if (orderError || !createdOrder) {
    return { error: orderError?.message || "Failed to create order." };
  }

  const orderItemsPayload = normalizedItems.map((item: any) => ({
    order_id: createdOrder.id,
    ...item,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items" as never)
    .insert(orderItemsPayload as never);

  if (orderItemsError) {
    return { error: orderItemsError.message };
  }

  const { error: clearCartError } = await supabase
    .from("cart_items" as never)
    .delete()
    .eq("cart_id", cartRow.id);

  if (clearCartError) {
    return { error: clearCartError.message };
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/orders");
  revalidatePath("/account");

  redirect(`/order-success?order=${createdOrder.order_number}`);
}
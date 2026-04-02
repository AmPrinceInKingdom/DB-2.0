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

  // ensure profile exists
  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
  });

  // get cart
  const { data: cart, error: cartError } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (cartError || !cart) {
    return { error: "Cart not found." };
  }

  // get cart items
  const { data: cartItems, error: cartItemsError } = await supabase
    .from("cart_items")
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
    `
    )
    .eq("cart_id", cart.id);

  if (cartItemsError) {
    return { error: cartItemsError.message };
  }

  if (!cartItems || cartItems.length === 0) {
    return { error: "Your cart is empty." };
  }

  // get address
  const { data: address, error: addressError } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (addressError) {
    return { error: addressError.message };
  }

  if (!address) {
    return { error: "Please add a delivery address first." };
  }

  let subtotal = 0;

  const normalizedItems = cartItems
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
    .from("orders")
    .insert({
      user_id: user.id,
      order_number: orderNumber,
      address_id: address.id,
      shipping_full_name: address.recipient_name,
      shipping_phone: address.phone,
      shipping_address_line_1: address.address_line_1,
      shipping_address_line_2: address.address_line_2,
      shipping_city: address.city,
      shipping_state: address.state,
      shipping_postal_code: address.postal_code,
      shipping_country: address.country ?? "Sri Lanka",
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
    })
    .select("id, order_number")
    .single();

  if (orderError || !newOrder) {
    return { error: orderError?.message || "Failed to create order." };
  }

  const orderItemsPayload = normalizedItems.map((item: any) => ({
    order_id: newOrder.id,
    ...item,
  }));

  const { error: orderItemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (orderItemsError) {
    return { error: orderItemsError.message };
  }

  const { error: clearCartError } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id);

  if (clearCartError) {
    return { error: clearCartError.message };
  }

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/orders");
  revalidatePath("/account");

  redirect(`/order-success?order=${newOrder.order_number}`);
}
export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  billingStreet: string;
  billingApartment: string;
  billingCity: string;
  billingDistrict: string;
  billingPostalCode: string;

  sameAsBilling: boolean;

  shippingStreet: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingPostalCode: string;

  orderNote: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutFormData, string>>;

export type PaymentMethod = "cod" | "card" | "bank";

export type CartProductItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderStatus = "pending" | "confirmed" | "processing";

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;

  customer: CheckoutFormData;
  paymentMethod: PaymentMethod;

  items: CartProductItem[];

  subtotal: number;
  shipping: number;
  total: number;
};
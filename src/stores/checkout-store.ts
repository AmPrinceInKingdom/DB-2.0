"use client";

import { create } from "zustand";

export type PaymentMethod =
  | "cod"
  | "card"
  | "bank"
  | null;

interface CheckoutState {
  // customer info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // address
  address: string;
  city: string;
  postalCode: string;
  country: string;

  // notes
  notes: string;

  // payment
  paymentMethod: PaymentMethod;

  // actions
  setCustomerInfo: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) => void;

  setAddress: (data: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }) => void;

  setNotes: (notes: string) => void;

  setPaymentMethod: (method: PaymentMethod) => void;

  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",

  address: "",
  city: "",
  postalCode: "",
  country: "",

  notes: "",

  paymentMethod: null,

  setCustomerInfo: (data) =>
    set({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    }),

  setAddress: (data) =>
    set({
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
    }),

  setNotes: (notes) => set({ notes }),

  setPaymentMethod: (method) =>
    set({ paymentMethod: method }),

  resetCheckout: () =>
    set({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      notes: "",
      paymentMethod: null,
    }),
}));
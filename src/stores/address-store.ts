import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

type AddressInput = {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
};

type AddressStore = {
  addresses: Address[];
  hasHydrated: boolean;
  addAddress: (input: AddressInput) => void;
  updateAddress: (id: string, input: AddressInput) => void;
  deleteAddress: (id: string) => { deletedDefault: boolean };
  setDefaultAddress: (id: string) => void;
  resetAddresses: () => void;
  setHasHydrated: (value: boolean) => void;
};

const defaultAddresses: Address[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+94 77 123 4567",
    line1: "123 Main Street",
    line2: "Apartment 4B",
    city: "Colombo",
    postalCode: "00100",
    country: "Sri Lanka",
    isDefault: true,
  },
];

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: defaultAddresses,
      hasHydrated: false,

      addAddress: (input) => {
        const nextId = Date.now().toString();
        const currentAddresses = get().addresses;

        const newAddress: Address = {
          id: nextId,
          name: input.name,
          phone: input.phone,
          line1: input.line1,
          line2: input.line2 || undefined,
          city: input.city,
          postalCode: input.postalCode,
          country: input.country,
          isDefault: currentAddresses.length === 0,
        };

        set({
          addresses: [newAddress, ...currentAddresses],
        });
      },

      updateAddress: (id, input) => {
        set({
          addresses: get().addresses.map((address) =>
            address.id === id
              ? {
                  ...address,
                  name: input.name,
                  phone: input.phone,
                  line1: input.line1,
                  line2: input.line2 || undefined,
                  city: input.city,
                  postalCode: input.postalCode,
                  country: input.country,
                }
              : address
          ),
        });
      },

      deleteAddress: (id) => {
        const currentAddresses = get().addresses;
        const target = currentAddresses.find((address) => address.id === id);
        const remaining = currentAddresses.filter((address) => address.id !== id);

        if (target?.isDefault && remaining.length > 0) {
          set({
            addresses: remaining.map((address, index) => ({
              ...address,
              isDefault: index === 0,
            })),
          });

          return { deletedDefault: true };
        }

        set({ addresses: remaining });
        return { deletedDefault: Boolean(target?.isDefault) };
      },

      setDefaultAddress: (id) => {
        set({
          addresses: get().addresses.map((address) => ({
            ...address,
            isDefault: address.id === id,
          })),
        });
      },

      resetAddresses: () => {
        set({
          addresses: defaultAddresses,
        });
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: "deal-bazaar-address-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
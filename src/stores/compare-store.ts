import { create } from "zustand";

export type CompareItem = {
  id: number;
  slug: string;
  name: string;
  category?: string;
  price: string | number;
  oldPrice?: string | number;
  image: string;
  description?: string;
  inStock?: boolean;
};

type CompareStore = {
  items: CompareItem[];
  isDrawerOpen: boolean;
  maxItems: number;

  addItem: (product: CompareItem) => {
    success: boolean;
    message: string;
  };

  removeItem: (productId: number) => void;
  clear: () => void;
  isInCompare: (productId: number) => boolean;

  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
};

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  isDrawerOpen: false,
  maxItems: 4,

  addItem: (product) => {
    const { items, maxItems } = get();

    const alreadyExists = items.some((item) => item.id === product.id);

    if (alreadyExists) {
      return {
        success: false,
        message: "This product is already in compare.",
      };
    }

    if (items.length >= maxItems) {
      return {
        success: false,
        message: `You can compare up to ${maxItems} products.`,
      };
    }

    set({
      items: [...items, product],
      isDrawerOpen: true,
    });

    return {
      success: true,
      message: "Product added to compare.",
    };
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  clear: () => {
    set({
      items: [],
      isDrawerOpen: false,
    });
  },

  isInCompare: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  openDrawer: () => {
    set({ isDrawerOpen: true });
  },

  closeDrawer: () => {
    set({ isDrawerOpen: false });
  },

  toggleDrawer: () => {
    set((state) => ({
      isDrawerOpen: !state.isDrawerOpen,
    }));
  },
}));
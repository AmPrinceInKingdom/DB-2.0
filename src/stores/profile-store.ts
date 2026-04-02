import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProfileState = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
};

type ProfileStore = {
  profile: ProfileState;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  updateProfile: (nextProfile: ProfileState) => void;
  resetProfile: () => void;
};

export const defaultProfileState: ProfileState = {
  firstName: "Dushan",
  lastName: "",
  displayName: "Dushan",
  email: "dushan@example.com",
  phone: "",
  avatar: "",
  bio: "",
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: defaultProfileState,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      updateProfile: (nextProfile) =>
        set({
          profile: {
            ...nextProfile,
          },
        }),

      resetProfile: () =>
        set({
          profile: defaultProfileState,
        }),
    }),
    {
      name: "deal-bazaar-profile-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
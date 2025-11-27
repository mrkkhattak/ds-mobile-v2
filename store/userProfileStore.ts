import { create } from "zustand";

type UserProfile = {
  id: string;
  user_id: string;
  household_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  created_at: string;
  updated_at: string;
};

type UserStore = {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  clearProfile: () => void;
};

export const useUserProfileStore = create<UserStore>((set) => ({
  profile: null,

  setProfile: (profile) => set({ profile }),

  updateProfile: (data) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...data } : null,
    })),

  clearProfile: () => set({ profile: null }),
}));

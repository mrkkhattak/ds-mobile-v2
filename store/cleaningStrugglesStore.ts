// store/cleaningStruggleStore.ts
import { create } from "zustand";

type CleaningStruggleState = {
  struggles: string[];
  otherText: string;
  setStruggles: (items: string[]) => void;
  setOtherText: (text: string) => void;
  reset: () => void;
};

export const useCleaningStruggleStore = create<CleaningStruggleState>(
  (set) => ({
    struggles: [],
    otherText: "",
    setStruggles: (items) => set({ struggles: items }),
    setOtherText: (text) => set({ otherText: text }),
    reset: () => set({ struggles: [], otherText: "" }),
  })
);

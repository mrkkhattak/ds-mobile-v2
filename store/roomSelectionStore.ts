import { create } from "zustand";

type RoomSelectionState = {
  selectedRooms: string[];
  setSelectedRooms: (rooms: string[]) => void;
  reset: () => void;
};

export const useRoomSelectionStore = create<RoomSelectionState>((set) => ({
  selectedRooms: [],
  setSelectedRooms: (rooms) => set({ selectedRooms: rooms }),
  reset: () => set({ selectedRooms: [] }),
}));

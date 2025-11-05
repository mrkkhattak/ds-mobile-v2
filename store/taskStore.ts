import { create } from "zustand";

type TaskStoreType = {
  selectedTask: string[];
  setSelectedTask: (rooms: string[]) => void;
  reset: () => void;
};

export const useTaskStore = create<TaskStoreType>((set) => ({
  selectedTask: [],
  setSelectedTask: (task) => set({ selectedTask: task }),
  reset: () => set({ selectedTask: [] }),
}));

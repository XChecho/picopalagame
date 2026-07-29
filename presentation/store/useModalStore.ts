import { create } from "zustand";

interface ModalState {
  viewModalNewGame: boolean;

  openModalNewGame: () => void;
  closeModalNewGame: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  viewModalNewGame: false,

  openModalNewGame: () => set({ viewModalNewGame: true }),
  closeModalNewGame: () => set({ viewModalNewGame: false }),
}));

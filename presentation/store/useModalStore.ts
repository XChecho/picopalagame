import { create } from "zustand";

interface ModalState {
  viewModalNewGame: boolean;
  viewModalDifficulty: boolean;

  openModalNewGame: () => void;
  closeModalNewGame: () => void;
  openModalDifficulty: () => void;
  closeModalDifficulty: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  viewModalNewGame: false,
  viewModalDifficulty: false,

  openModalNewGame: () => set({ viewModalNewGame: true }),
  closeModalNewGame: () => set({ viewModalNewGame: false }),
  openModalDifficulty: () => set({ viewModalDifficulty: true }),
  closeModalDifficulty: () => set({ viewModalDifficulty: false }),
}));

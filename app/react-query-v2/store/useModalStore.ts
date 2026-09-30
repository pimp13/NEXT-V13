import { create } from "zustand";

export type ModalType =
  | "create-user"
  | "edit-user"
  | "delete-user"
  | "create-role";


export type ModalStore = {
  openModal: ModalType | null;
  selectedId: string | number | null;

  open: (
    modal: ModalType,
    id?: string | number | null
  ) => void;

  close: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  selectedId: null,

  open: (modal, id = null) => {
    set({
      openModal: modal,
      selectedId: id,
    });
  },

  close: () => {
    set({
      openModal: null,
      selectedId: null,
    });
  },
}));
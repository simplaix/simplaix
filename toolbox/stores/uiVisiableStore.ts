import { create } from 'zustand';

interface UiVisiableStore {
  visiableUIs: Set<string>;
  addVisiableUI: (ui: string) => void;
  removeVisiableUI: (ui: string) => void;
}

export const useUiVisiableStore = create<UiVisiableStore>((set) => ({
  visiableUIs: new Set(),
  addVisiableUI: (ui) => set((state) => ({
    visiableUIs: new Set(state.visiableUIs).add(ui)
  })),
  removeVisiableUI: (ui) => set((state) => {
    const newChecked = new Set(state.visiableUIs);
    newChecked.delete(ui);
    return { visiableUIs: newChecked };
  }),
}));

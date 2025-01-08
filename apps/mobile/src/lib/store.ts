import { LazyStore } from "@tauri-apps/plugin-store";

export const setupStore = () => {
  const store = new LazyStore("store.bin", {
    autoSave: true,
  });
  return store;
};

import type { LazyStore } from "@tauri-apps/plugin-store";
import { createContext, useContext } from "react";

interface TauriApis {
  store: null | LazyStore;
}

export const SystemTrayContext = createContext<TauriApis>({
  store: null,
});

export const useSystemTray = () => {
  return useContext(SystemTrayContext);
};

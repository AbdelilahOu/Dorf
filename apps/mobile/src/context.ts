import type { LazyStore } from "@tauri-apps/plugin-store";
import { createContext, useContext } from "react";

interface TauriApis {
  store: null | LazyStore;
}

export const TauriApisContext = createContext<TauriApis>({
  store: null,
});

export const TauriApisProvider = TauriApisContext.Provider;

export const useTauriApis = () => {
  return useContext(TauriApisContext);
};

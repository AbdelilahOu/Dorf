import { fetch } from "@tauri-apps/plugin-http";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_SERVER_URL,
  fetchOptions: {
    customFetchImpl: fetch,
  },
});

import { fetch } from "@tauri-apps/plugin-http";
import { createAuthClient } from "better-auth/react";
import { SERVER_URL } from "../../env";

export const authClient = createAuthClient({
  baseURL: SERVER_URL,
  fetchOptions: {
    customFetchImpl: fetch,
  },
});

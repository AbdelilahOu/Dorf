import { Toaster } from "@dorf/ui/toaster";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import type { LazyStore } from "@tauri-apps/plugin-store";
import type { SelectUser } from "@dorf/api/src/db/schema";

interface RouteContext {
  queryClient: QueryClient;
  store: LazyStore;
}

export const rootRoute = createRootRouteWithContext<RouteContext>()({
  component: RootComponent,
  beforeLoad: async ({ location, context }) => {
    if (location.pathname === "/") {
      throw redirect({
        to: "/app",
        search: {
          redirect: location.href,
        },
      });
    }
    if (
      !location.pathname.startsWith("/app/auth") &&
      !location.pathname.startsWith("/onboarding")
    ) {
      const [token, user] = await Promise.allSettled([
        context.store.get<string>("token"),
        context.store.get<SelectUser>("user"),
      ]);

      const userExists = user.status === "fulfilled" && user.value;
      const tokenExists = token.status === "fulfilled" && token.value;

      if (!userExists && !tokenExists) {
        throw redirect({
          to: "/onboarding",
          search: {
            redirect: location.href,
          },
        });
      }
    }
  },
});

function RootComponent() {
  return (
    <>
      <div className="grainy-light relative flex h-[100vh] flex-col">
        <main className="h-full">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </>
  );
}

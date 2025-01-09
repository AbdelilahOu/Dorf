import { Toaster } from "@dorf/ui/toaster";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import type { LazyStore } from "@tauri-apps/plugin-store";
import BottomNavigation from "../components/bottom-navigation";

interface RouteContext {
  queryClient: QueryClient;
  store: LazyStore;
}

export const rootRoute = createRootRouteWithContext<RouteContext>()({
  component: RootComponent,
  beforeLoad: async ({ location, context }) => {
    if (!location.pathname.startsWith("/auth")) {
      const [token, user] = await Promise.all([
        context.store?.get<string>("token"),
        context.store?.get<any>("user"),
      ]);
      if (!user && !token) {
        throw redirect({
          to: "/auth/signin",
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
        <main className="h-full p-2">
          <Outlet />
        </main>
        <BottomNavigation />
        <Toaster />
      </div>
    </>
  );
}

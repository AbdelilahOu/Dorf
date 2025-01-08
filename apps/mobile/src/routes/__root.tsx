import { Toaster } from "@dorf/ui/toaster";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, redirect } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Navigation from "../components/navigation-bar";
import { useSystemTray } from "../context";

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  beforeLoad: async ({ location }) => {
    const { store } = useSystemTray();
    const [token, user] = await Promise.all([
      store?.get("token"),
      store?.get("user"),
    ]);
    if (!user && !token) {
      throw redirect({
        to: "/auth/signin",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RootComponent() {
  return (
    <>
      <div className="relative flex h-[100vh] flex-col">
        <Navigation />
        <main className="h-full p-2">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </>
  );
}

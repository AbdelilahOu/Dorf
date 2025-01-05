import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import Navigation from "../components/navigation-bar";

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="flex h-[100vh] flex-col">
        <Navigation />
        <main className="h-full p-2">
          <Outlet />
        </main>
      </div>
    </>
  );
}

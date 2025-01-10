import { Outlet, createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "../app-layout";

export const authLayoutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "auth",
  component: AuthLayoutRouteComponent,
});

function AuthLayoutRouteComponent() {
  return (
    <div className="flex h-full w-full flex-col">
      <Outlet />
    </div>
  );
}

import { Outlet, createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
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

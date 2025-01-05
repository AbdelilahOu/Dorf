import { createRoute, Outlet } from "@tanstack/react-router";
import { rootRoute } from "../__root";

export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "auth",
  component: AuthLayoutRouteComponent,
});

function AuthLayoutRouteComponent() {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
}

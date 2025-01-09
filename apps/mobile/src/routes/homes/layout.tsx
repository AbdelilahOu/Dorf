import { Outlet, createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

export const homesLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "homes",
  component: HomesLayoutRouteComponent,
});

function HomesLayoutRouteComponent() {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
}

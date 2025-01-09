import { Outlet, createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

export const readingsLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "readings",
  component: ReadingsLayoutRouteComponent,
});

function ReadingsLayoutRouteComponent() {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
}

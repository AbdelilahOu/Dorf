import { Button } from "@dorf/ui/button";
import { Icons } from "@dorf/ui/icons";
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
      <div className="h-11 w-full">
        <Button size={"icon"} variant={"ghost"}>
          <Icons.ChevronLeft />
        </Button>
      </div>
      <Outlet />
    </div>
  );
}

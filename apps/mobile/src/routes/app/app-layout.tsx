import { Outlet, createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";
import { Toaster } from "@dorf/ui/toaster";
import { BottomNavigation } from "../../components/bottom-navigation";
import { TopNavigation } from "../../components/top-navigation";
import { useTauriApis } from "../../context";
import { useQuery } from "@tanstack/react-query";
import type { SelectUser } from "@dorf/api/src/db/schema";

export const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "app",
  component: AppLayoutRouteComponent,
});

function AppLayoutRouteComponent() {
  const { store } = useTauriApis();
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const user = await store?.get<SelectUser>("user");
      return { user };
    },
  });
  return (
    <div className="grainy-light relative flex h-[100vh] flex-col">
      <TopNavigation user={data?.user} />
      <main className="px-2 pt-11 pb-12">
        <Outlet />
      </main>
      <BottomNavigation user={data?.user} />
      <Toaster />
    </div>
  );
}

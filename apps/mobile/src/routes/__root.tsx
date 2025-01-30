import { Toaster } from "@dorf/ui/toaster";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import type { LazyStore } from "@tauri-apps/plugin-store";
import type { SelectUser } from "@dorf/api/src/db/schema";

interface RouteContext {
  queryClient: QueryClient;
  store: LazyStore;
}

const PUBLIC_PAGES = ["/app/auth", "/onboarding", "/verify-email"];

export const rootRoute = createRootRouteWithContext<RouteContext>()({
  beforeLoad: async ({ location, context }) => {
    const { pathname, href } = location;
    if (pathname === "/") {
      throw redirect({
        to: "/app",
        search: {
          redirect: href,
        },
      });
    }

    const IsPublicPage = PUBLIC_PAGES.some((page) => pathname.startsWith(page));

    console.log(IsPublicPage, pathname);

    if (!IsPublicPage) {
      const [token, user] = await Promise.allSettled([
        context.store.get<string>("token"),
        context.store.get<SelectUser>("user"),
      ]);

      const userExists = user.status === "fulfilled" && user.value;
      const tokenExists = token.status === "fulfilled" && token.value;

      if (!userExists && !tokenExists) {
        throw redirect({
          to: "/onboarding",
          search: {
            redirect: href,
          },
        });
      }

      console.log(userExists && !user.value?.emailVerified);

      if (userExists && !user.value?.emailVerified) {
        throw redirect({
          to: "/verify-email",
          search: {
            redirect: href,
          },
        });
      }
    }
  },
  component: () => {
    return (
      <>
        <div className="relative flex h-[100vh] flex-col bg-slate-50">
          <main className="h-full">
            <Outlet />
          </main>
          <Toaster />
        </div>
      </>
    );
  },
});

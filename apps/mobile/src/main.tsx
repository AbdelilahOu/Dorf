import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import "@dorf/ui/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { DefaultErrorComponent } from "./components/error";
import { SystemTrayContext } from "./context";
import { setupStore } from "./lib/store";
import { indexRoute } from "./routes";
import { rootRoute } from "./routes/__root";
import { authLayoutRoute } from "./routes/auth/layout";
import { signInRoute } from "./routes/auth/signin";
import { signUpRoute } from "./routes/auth/signup";

const queryClient = new QueryClient();

const routeTree = rootRoute.addChildren([
  indexRoute,
  authLayoutRoute.addChildren([signInRoute, signUpRoute]),
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: DefaultErrorComponent,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  const store = setupStore();

  root.render(
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <SystemTrayContext.Provider value={{ store }}>
          <RouterProvider router={router} />
        </SystemTrayContext.Provider>
      </NuqsAdapter>
    </QueryClientProvider>,
  );
}

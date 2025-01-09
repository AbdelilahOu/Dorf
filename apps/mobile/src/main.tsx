import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import "@dorf/ui/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { DefaultErrorComponent } from "./components/error";
import { TauriApisContext } from "./context";
import { setupStore } from "./lib/store";
import { indexRoute } from "./routes";
import { rootRoute } from "./routes/__root";
import { authLayoutRoute } from "./routes/auth/layout";
import { signInRoute } from "./routes/auth/signin";
import { signUpRoute } from "./routes/auth/signup";
import { homesRoute } from "./routes/homes";
import { homesLayoutRoute } from "./routes/homes/layout";
import { readingsRoute } from "./routes/readings";
import { readingsLayoutRoute } from "./routes/readings/layout";

const queryClient = new QueryClient();
const store = setupStore();

const routeTree = rootRoute.addChildren([
  indexRoute,
  authLayoutRoute.addChildren([
    signInRoute,
    signUpRoute,
    readingsLayoutRoute.addChildren([readingsRoute]),
    homesLayoutRoute.addChildren([homesRoute]),
  ]),
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: DefaultErrorComponent,
  context: {
    queryClient,
    store,
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

  root.render(
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <TauriApisContext.Provider value={{ store }}>
          <RouterProvider router={router} />
        </TauriApisContext.Provider>
      </NuqsAdapter>
    </QueryClientProvider>,
  );
}

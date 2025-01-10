import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import "@dorf/ui/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { DefaultErrorComponent } from "./components/error";
import { TauriApisProvider } from "./context";
import { setupStore } from "./lib/store";
import { indexRoute } from "./routes/app";
import { rootRoute } from "./routes/__root";
import { appLayoutRoute } from "./routes/app/app-layout";
import { authLayoutRoute } from "./routes/app/auth/layout";
import { signInRoute } from "./routes/app/auth/signin";
import { signUpRoute } from "./routes/app/auth/signup";
import { homesRoute } from "./routes/app/homes";
import { profileRoute } from "./routes/app/profile";
import { readingsRoute } from "./routes/app/readings";
import { settingsRoute } from "./routes/app/settings";
import { onBoardingRoute } from "./routes/onboarding";

const queryClient = new QueryClient();
const store = setupStore();

const routeTree = rootRoute.addChildren([
  onBoardingRoute,
  appLayoutRoute.addChildren([
    indexRoute,
    authLayoutRoute.addChildren([signInRoute, signUpRoute]),
    readingsRoute,
    homesRoute,
    profileRoute,
    settingsRoute,
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
        <TauriApisProvider value={{ store }}>
          <RouterProvider router={router} />
        </TauriApisProvider>
      </NuqsAdapter>
    </QueryClientProvider>,
  );
}

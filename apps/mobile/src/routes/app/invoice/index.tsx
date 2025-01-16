import type { SelectUser } from "@dorf/api/src/db/schema";
import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "../app-layout";

export const invoicesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/invoices",
  component: InvoicesComponent,
  loader: async ({ context }) => {
    const [user, token] = await Promise.all([
      context.store.get<SelectUser>("user"),
      context.store.get<string>("token"),
    ]);
    return {
      user,
      token,
    };
  },
});

function InvoicesComponent() {
  const { user, token } = invoicesRoute.useLoaderData() as {
    user: SelectUser;
    token: string;
  };

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex items-center justify-center">INVOICE</div>
    </div>
  );
}

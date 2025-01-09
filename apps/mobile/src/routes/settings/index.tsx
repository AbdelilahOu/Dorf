import type { SelectUser } from "@dorf/api/src/db/schema";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../__root";

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsComponent,
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

function SettingsComponent() {
  const { user, token } = settingsRoute.useLoaderData() as {
    user: SelectUser;
    token: string;
  };

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex justify-end">
        {JSON.stringify(user)}
        {token}
      </div>
    </div>
  );
}

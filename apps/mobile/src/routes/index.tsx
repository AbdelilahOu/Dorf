import { createRoute, Link } from "@tanstack/react-router";
import { Button } from "@dorf/ui/button";
import { Input } from "@dorf/ui/input";

import { useQueryState } from "nuqs";
import { rootRoute } from "./__root";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});

function HomeComponent() {
  const { data, error } = useQuery({
    queryKey: ["readings"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/readings`,
        {
          method: "GET",
        },
      );
      if (response.status === 200) {
        return await response.json();
      }
      throw new Error("new error");
    },
  });
  return (
    <>
      data: {JSON.stringify(data)}
      error: {JSON.stringify(error)}
    </>
  );
}

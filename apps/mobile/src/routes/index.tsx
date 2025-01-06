import { createRoute, } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { useToast } from "@dorf/ui/hooks/use-toast";
import Readings from "../components/readings/readings";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});

function HomeComponent() {
  const { toast } = useToast();

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

  if (error) {
    toast({
      title: "error while getting readings",
    });
  }

  return <Readings data={data} />;
}

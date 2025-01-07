import { useToast } from "@dorf/ui/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { SERVER_URL } from "../../env";
import Readings from "../components/readings/readings";
import { rootRoute } from "./__root";

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
      try {
        const response = await fetch(`${SERVER_URL}/readings/`, {
          method: "GET",
        });
        if (response.status === 200 || response.statusText === "OK") {
          return await response.json();
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    retry: false,
  });

  return (
    <div>
      <Readings data={data} />
    </div>
  );
}

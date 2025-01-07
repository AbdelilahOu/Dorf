import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { useToast } from "@dorf/ui/hooks/use-toast";
import Readings from "../components/readings/readings";
import { SERVER_URL } from "../../env";

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
      {JSON.stringify(data)}-{JSON.stringify(error)}
      -----------------
      <Readings data={data} />
    </div>
  );
}

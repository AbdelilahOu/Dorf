import { useToast } from "@dorf/ui/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { SERVER_URL } from "../../env";
import Readings from "../components/readings/readings";
import { useSystemTray } from "../context";
import { authClient } from "../lib/auth-client";
import { rootRoute } from "./__root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});

function HomeComponent() {
  const { toast } = useToast();
  const { store } = useSystemTray();

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

  const { data: storeData } = useQuery({
    queryKey: ["token"],
    queryFn: async () => {
      const [user, token] = await Promise.all([
        store?.get("user"),
        store?.get("token"),
      ]);
      return {
        user,
        token,
      };
    },
    retry: false,
  });

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();

      if (error) throw error;

      if (data && !error) {
        return data;
      }
    },
    retry: false,
  });

  return (
    <div>
      ------------------------- token : {JSON.stringify(storeData?.token)}
      ------------------------- session: {JSON.stringify(session)}
      -------------------------
      <Readings data={data} />
      -------------------------
    </div>
  );
}

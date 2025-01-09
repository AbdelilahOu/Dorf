import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@dorf/ui/drawer";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { SERVER_URL } from "../../../env";
import CreateHomeForm from "../../components/homes/create-home-form";
import Homes from "../../components/homes/homes";
import { useTauriApis } from "../../context";
import { homesLayoutRoute } from "./layout";

export const homesRoute = createRoute({
  getParentRoute: () => homesLayoutRoute,
  path: "/",
  component: HomesComponent,
});

function HomesComponent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { store } = useTauriApis();

  const { data, error } = useQuery({
    queryKey: ["homes"],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/homes/`, {
          method: "GET",
        });
        if (response.status === 200 || response.statusText === "OK") {
          return await response.json();
        }
        const data = await response.json();
        toast({ title: data.message, variant: "destructive" });
        return [];
      } catch (error) {
        console.log(error);
        toast({ title: `Error: ${error}`, variant: "destructive" });
        return [];
      }
    },
    retry: false,
  });

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex justify-end">
        <Drawer fixed={true}>
          <DrawerTrigger>Add home</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <CreateHomeForm />
          </DrawerContent>
        </Drawer>
      </div>
      <Homes data={data} />
    </div>
  );
}

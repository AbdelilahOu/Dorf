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
import CreateReadingForm from "../../components/readings/create-reading-form";
import Readings from "../../components/readings/readings";
import { useTauriApis } from "../../context";
import { readingsLayoutRoute } from "./layout";

export const readingsRoute = createRoute({
  getParentRoute: () => readingsLayoutRoute,
  path: "/",
  component: ReadingsComponent,
});

function ReadingsComponent() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { store } = useTauriApis();

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
        <Drawer>
          <DrawerTrigger>Add reading</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <CreateReadingForm />
          </DrawerContent>
        </Drawer>
      </div>
      <Readings data={data} />
    </div>
  );
}

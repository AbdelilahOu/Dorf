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
import { SERVER_URL } from "../../../../env";
import { CreateReadingForm } from "../../../components/readings/create-reading-form";
import { ReadingsTable } from "../../../components/readings/readings-table";
import { useTauriApis } from "../../../context";
import { appLayoutRoute } from "../app-layout";
import { Button } from "@dorf/ui/button";

export const readingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "readings",
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
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        toast({ title: `Error: ${error}`, variant: "destructive" });
        return [];
      }
    },
    retry: false,
  });

  return (
    <div className="h-full w-full">
      <div className="flex justify-end py-2">
        <Drawer>
          <DrawerTrigger>
            <Button>Add reading</Button>
          </DrawerTrigger>
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
      <ReadingsTable data={data || []} />
    </div>
  );
}

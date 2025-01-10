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
import { createRoute } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { SERVER_URL } from "../../../../env";
import { CreateHomeForm } from "../../../components/homes/create-home-form";
import { HomesTable } from "../../../components/homes/homes-table";
import { appLayoutRoute } from "../app-layout";
import { Button } from "@dorf/ui/button";

export const homesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "homes",
  component: HomesComponent,
});

function HomesComponent() {
  const { toast } = useToast();

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
      <div className="flex justify-end py-2">
        <Drawer fixed={true}>
          <DrawerTrigger>
            <Button>Add home</Button>
          </DrawerTrigger>
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
      <HomesTable data={data || []} />
    </div>
  );
}

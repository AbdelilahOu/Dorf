import { Button } from "@dorf/ui/button";
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
import { CreateHouseForm } from "../../../components/houses/create-house-form";
import { HousesTable } from "../../../components/houses/houses-table";
import { appLayoutRoute } from "../app-layout";

export const housesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "houses",
  component: HousesComponent,
});

function HousesComponent() {
  const { toast } = useToast();

  const { data, error } = useQuery({
    queryKey: ["houses"],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/houses/`, {
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
            <Button>Add house</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Are you absolutely sure?</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <CreateHouseForm />
          </DrawerContent>
        </Drawer>
      </div>
      <HousesTable data={data || []} />
    </div>
  );
}

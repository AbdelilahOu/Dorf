import type { SelectHouse } from "@dorf/api/src/db/schema";
import { Button } from "@dorf/ui/button";
import { Drawer } from "@dorf/ui/drawer";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";
import { SERVER_URL } from "../../../../env";
import { CreateHouseForm } from "../../../components/houses/create-house-form";
import { DeleteHouseForm } from "../../../components/houses/delete-house-form";
import { HousesTable } from "../../../components/houses/houses-table";
import { UpdateHouseForm } from "../../../components/houses/update-house-form";
import { appLayoutRoute } from "../app-layout";

export const housesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "houses",
  component: HousesComponent,
});

function HousesComponent() {
  const { toast } = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [whichDrawer, setWichDrawer] = useState<
    "UPDATE_HOUSE" | "DELETE_HOUSE" | "CREATE_HOUSE" | undefined
  >(undefined);
  const [drawerProps, setDrawerProps] = useState<any>({});

  const DRAWERS = {
    CREATE_HOUSE: CreateHouseForm,
    UPDATE_HOUSE: UpdateHouseForm,
    DELETE_HOUSE: DeleteHouseForm,
  };

  const { data, error } = useQuery({
    queryKey: ["houses"],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/houses/`, {
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

  function handleOpenDrawer(drawer: string, house?: any) {
    setWichDrawer(drawer as "UPDATE_HOUSE" | "DELETE_HOUSE" | "CREATE_HOUSE");
    setDrawerProps(house);
    setOpenDrawer(true);
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-end py-2">
        <Button onClick={() => handleOpenDrawer("CREATE_HOUSE")}>
          Add house
        </Button>
      </div>
      <HousesTable
        data={data || []}
        onDelete={(id) => handleOpenDrawer("DELETE_HOUSE", { id })}
        onUpdate={(house: SelectHouse) =>
          handleOpenDrawer("UPDATE_HOUSE", house)
        }
      />
      <Drawer
        open={openDrawer}
        defaultOpen={openDrawer}
        onOpenChange={(open) => setOpenDrawer(open)}
      >
        {whichDrawer &&
          (() => {
            const DrawerComponent = DRAWERS[whichDrawer];

            return <DrawerComponent {...drawerProps} />;
          })()}
      </Drawer>
    </div>
  );
}

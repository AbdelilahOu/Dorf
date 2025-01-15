import type { SelectReading } from "@dorf/api/src/db/schema";
import { Button } from "@dorf/ui/button";
import { Drawer } from "@dorf/ui/drawer";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";
import { SERVER_URL } from "../../../../env";
import { CreateReadingForm } from "../../../components/readings/create-reading-form";
import { DeleteReadingForm } from "../../../components/readings/delete-reading-form";
import { ReadingsTable } from "../../../components/readings/readings-table";
import { UpdateReadingForm } from "../../../components/readings/update-reading-form";
import { appLayoutRoute } from "../app-layout";

export const readingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "readings",
  component: ReadingsComponent,
});

function ReadingsComponent() {
  const { toast } = useToast();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [whichDrawer, setWichDrawer] = useState<
    "UPDATE_READING" | "DELETE_READING" | "CREATE_READING" | undefined
  >(undefined);
  const [drawerProps, setDrawerProps] = useState<any>({});

  const DRAWERS = {
    CREATE_READING: CreateReadingForm,
    UPDATE_READING: UpdateReadingForm,
    DELETE_READING: DeleteReadingForm,
  };

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

  function handleOpenDrawer(drawer: string, reading?: any) {
    setWichDrawer(
      drawer as "UPDATE_READING" | "DELETE_READING" | "CREATE_READING",
    );
    setDrawerProps(reading);
    setOpenDrawer(true);
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-end py-2">
        <Button onClick={() => handleOpenDrawer("CREATE_READING")}>
          Add reading
        </Button>
      </div>
      <ReadingsTable
        data={data || []}
        onDelete={(id) => handleOpenDrawer("DELETE_READING", { id })}
        onUpdate={(reading: SelectReading) =>
          handleOpenDrawer("UPDATE_READING", reading)
        }
      />
      <Drawer
        fixed={true}
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

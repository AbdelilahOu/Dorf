import type { SelectUser } from "@dorf/api/src/db/schema";
import { Button } from "@dorf/ui/button";
import { Drawer } from "@dorf/ui/drawer";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { createRoute } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";
import { SERVER_URL } from "../../../../env";
import {
  CreateWaterMeterForm,
  DeleteWaterMeterForm,
  WaterMeters,
  UpdateWaterMeterForm,
} from "../../../components/water-meter";
import { appLayoutRoute } from "../app-layout";
import type { SelectWaterMeterType } from "@dorf/api/src/routes/water-meters";

export const waterMetersRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "water-meters",
  component: WaterMetersComponent,
  loader: async ({ context }) => {
    const token = await context.store.get<string>("token");
    return {
      token,
    };
  },
});

function WaterMetersComponent() {
  const { toast } = useToast();
  const { user, token } = waterMetersRoute.useLoaderData() as {
    user: SelectUser;
    token: string;
  };

  const [openDrawer, setOpenDrawer] = useState(false);
  const [whichDrawer, setWichDrawer] = useState<
    "UPDATE_METER" | "DELETE_METER" | "CREATE_METER" | undefined
  >(undefined);
  const [drawerProps, setDrawerProps] = useState<any>({});

  const DRAWERS = {
    CREATE_METER: CreateWaterMeterForm,
    UPDATE_METER: UpdateWaterMeterForm,
    DELETE_METER: DeleteWaterMeterForm,
  };

  const { data, error } = useQuery({
    queryKey: ["water-meters"],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/water-meters/`, {
          method: "GET",
          headers: new Headers({ Authorization: `Bearer ${token}` }),
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

  function handleOpenDrawer(
    drawer: string,
    waterMeter?: Partial<SelectWaterMeterType>,
  ) {
    setWichDrawer(drawer as "UPDATE_METER" | "DELETE_METER" | "CREATE_METER");
    setDrawerProps({ waterMeter, token });
    setOpenDrawer(true);
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-end py-2">
        <Button onClick={() => handleOpenDrawer("CREATE_METER")}>
          Add waterMeter
        </Button>
      </div>
      <WaterMeters
        data={data || []}
        onDelete={(id) => handleOpenDrawer("DELETE_METER", { id })}
        onUpdate={(waterMeter: SelectWaterMeterType) =>
          handleOpenDrawer("UPDATE_METER", waterMeter)
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

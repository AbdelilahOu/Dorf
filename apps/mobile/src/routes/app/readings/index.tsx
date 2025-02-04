import { Button } from "@dorf/ui/button";
import { Drawer } from "@dorf/ui/drawer";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";
import { SERVER_URL } from "../../../../env";
import {
  CreateReadingForm,
  DeleteReadingForm,
  Readings,
  UpdateReadingForm,
} from "../../../components/readings";
import { appLayoutRoute } from "../app-layout";
import type { SelectReadingType } from "@dorf/api/src/routes/readings";

export const readingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "readings",
  component: ReadingsComponent,
  loader: async ({ context }) => {
    const token = await context.store.get<string>("token");
    return {
      token,
    };
  },
});

function ReadingsComponent() {
  const { toast } = useToast();
  const navigate = useNavigate({ from: "/app/readings" });
  const { token } = readingsRoute.useLoaderData() as {
    token: string;
  };

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
        const response = await fetch(`${SERVER_URL}/api/v1/readings/`, {
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
    reading?: Partial<SelectReadingType>,
  ) {
    setWichDrawer(
      drawer as "UPDATE_READING" | "DELETE_READING" | "CREATE_READING",
    );
    setDrawerProps({ reading, token });
    setOpenDrawer(true);
  }

  function handlePrintInvocie(id: string) {
    navigate({ to: "/app/invoices", search: { id } });
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-end py-2">
        <Button onClick={() => handleOpenDrawer("CREATE_READING")}>
          Add reading
        </Button>
      </div>
      <Readings
        data={data || []}
        onDelete={(id) => handleOpenDrawer("DELETE_READING", { id })}
        onUpdate={(reading: SelectReadingType) =>
          handleOpenDrawer("UPDATE_READING", reading)
        }
        onPrintInvoice={handlePrintInvocie}
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

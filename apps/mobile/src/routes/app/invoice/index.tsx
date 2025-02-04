import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "../app-layout";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SERVER_URL } from "../../../../env";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { fetch } from "@tauri-apps/plugin-http";

const searchParams = z.object({
  id: z.string().optional(),
});

export const invoicesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/invoices",
  component: InvoicesComponent,
  loader: async ({ context }) => {
    const token = await context.store.get<string>("token");
    return {
      token,
    };
  },
  validateSearch: searchParams,
});

function InvoicesComponent() {
  const { toast } = useToast();
  const { token } = invoicesRoute.useLoaderData() as {
    token: string;
  };
  const { id } = invoicesRoute.useSearch();

  const { data } = useQuery({
    queryKey: ["invoice"],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/readings/${id}`, {
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
        return {};
      }
    },
    enabled: !!id,
  });

  return (
    <div className="h-full w-full">
      <div className="mb-4 flex items-center justify-center">INVOICE: {id}</div>
      {Object.entries(data).map(([key, value]) => {
        return (
          <div key={key}>
            <div>
              {/* @ts-ignore */}
              {key}: {value}
            </div>
            <br />
          </div>
        );
      })}
    </div>
  );
}

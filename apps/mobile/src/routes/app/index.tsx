import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./app-layout";
import { BarChartComponent } from "../../components/overview/bar-chart";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { SERVER_URL } from "../../../env";
import { Card, CardContent, CardHeader, CardTitle } from "@dorf/ui/card";

export const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: WaterMeterComponent,
  loader: async ({ context }) => {
    const token = await context.store.get<string>("token");
    return {
      token,
    };
  },
});

function WaterMeterComponent() {
  const { token } = indexRoute.useLoaderData() as {
    token: string;
  };

  const { data } = useQuery({
    queryKey: ["dashboard-count"],
    queryFn: async () => {
      const response = await fetch(`${SERVER_URL}/api/v1/dashboard/`, {
        method: "GET",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
      const data = await response.json();
      return data;
    },
    initialData: { waterMetersCount: 0, totalWaterConsumption: 0 },
  });
  return (
    <div className="h-full w-full">
      <div className="my-2 flex justify-between gap-x-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>total water meters</CardTitle>
          </CardHeader>
          <CardContent>{data.waterMetersCount}</CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>total water consumed</CardTitle>
          </CardHeader>
          <CardContent>{data.totalWaterConsumption} tons</CardContent>
        </Card>
      </div>
      <BarChartComponent />
    </div>
  );
}

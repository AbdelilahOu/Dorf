import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./app-layout";
import { BarChartComponent } from "../../components/overview/bar-chart";

export const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: WaterMeterComponent,
});

function WaterMeterComponent() {
  return (
    <div className="h-full w-full">
      <BarChartComponent />
    </div>
  );
}

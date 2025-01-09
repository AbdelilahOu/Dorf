import { createRoute } from "@tanstack/react-router";
import { BarChartComponent } from "../components/overview/bar-chart";
import { rootRoute } from "./__root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="h-full w-full">
      <BarChartComponent />
    </div>
  );
}

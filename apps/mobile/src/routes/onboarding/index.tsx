import { createRoute, Link } from "@tanstack/react-router";
import { rootRoute } from "../__root";
// @ts-ignore
import Icon from "../../assets/icon.png";
import { buttonVariants } from "@dorf/ui/button";

export const onBoardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: GettingStartedComponent,
});

function GettingStartedComponent() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between p-2">
      <div className="flex h-full w-full flex-col items-center justify-center">
        <img src={Icon} alt="app icon" />
        <h1 className="font-medium text-2xl">
          جمعية ايت الفرسى للتنمية والتعاور
        </h1>
      </div>
      <Link
        to="/app/auth/signup"
        className={buttonVariants({ variant: "default" })}
      >
        Getting started
      </Link>
    </div>
  );
}

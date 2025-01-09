import { buttonVariants } from "@dorf/ui/button";
import { Icons } from "@dorf/ui/icons";
import { Link } from "@tanstack/react-router";

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 flex min-h-10 items-center justify-between px-8 py-1">
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/"
      >
        <Icons.Home />
      </Link>
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/homes" // Assuming your homes page route is "/homes"
      >
        <Icons.Homes />
      </Link>
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/readings"
      >
        <Icons.MeterReadings />
      </Link>
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/profile"
      >
        <Icons.Profile />
      </Link>
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/"
      >
        <Icons.Settings />
      </Link>
    </div>
  );
}

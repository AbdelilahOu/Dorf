import type { SelectUser } from "@dorf/api/src/db/schema";
import { buttonVariants } from "@dorf/ui/button";
import { Icons } from "@dorf/ui/icons";
import { Link } from "@tanstack/react-router";

export function BottomNavigation({ user }: { user?: SelectUser }) {
  if (!user) return <></>;
  return (
    <div className="fixed bottom-0 flex min-h-10 w-full items-center justify-between px-8 py-1">
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/app"
      >
        <Icons.Home />
      </Link>
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/app/homes"
      >
        <Icons.Homes />
      </Link>
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/app/readings"
      >
        <Icons.MeterReadings />
      </Link>
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/app/profile"
      >
        <Icons.Profile />
      </Link>
      <Link
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        to="/app/settings"
      >
        <Icons.Settings />
      </Link>
    </div>
  );
}

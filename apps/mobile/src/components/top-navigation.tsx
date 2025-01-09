import { Button } from "@dorf/ui/button";
import { Icons } from "@dorf/ui/icons";

export function TopNavigation() {
  return (
    <div className="h-11 w-full">
      <Button size={"icon"} variant={"ghost"}>
        <Icons.ChevronLeft />
      </Button>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@dorf/ui/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="p-2">
      <Button variant={"default"} size={"lg"}>
        Hi
      </Button>
    </div>
  );
}

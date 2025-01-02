import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@dorf/ui/button";
import { Input } from "@dorf/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@dorf/ui/dialog";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="p-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"default"} size={"lg"}>
            Hi
          </Button>
        </DialogTrigger>
        <DialogContent autoFocus={false}>
          <Input />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@dorf/ui/button";
import { Input } from "@dorf/ui/input";

import { useQueryState } from "nuqs";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const [name, setName] = useQueryState("name");
  return (
    <>
      <Input value={name || ""} onChange={(e) => setName(e.target.value)} />
      <Button onClick={() => setName(null)}>Clear</Button>
      <p>Hello, {name || "anonymous visitor"}!</p>
    </>
  );
}

import { createRoute, Link } from "@tanstack/react-router";
import { Button } from "@dorf/ui/button";
import { Input } from "@dorf/ui/input";

import { useQueryState } from "nuqs";
import { rootRoute } from "./__root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});

function HomeComponent() {
  const [name, setName] = useQueryState("name");
  return (
    <>
      <Input value={name || ""} onChange={(e) => setName(e.target.value)} />
      <Button onClick={() => setName(null)}>Clear</Button>
      <p>Hello, {name || "anonymous visitor"}!</p>
      <Link to="/auth/signin">signin</Link>
      <Link to="/auth/signup">signup</Link>
    </>
  );
}

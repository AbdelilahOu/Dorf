import { Link } from "@tanstack/react-router";

export function DefaultErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex w-full flex-col space-y-2">
      <div>{error.message}</div>
      <Link to="/">Go back home</Link>
    </div>
  );
}

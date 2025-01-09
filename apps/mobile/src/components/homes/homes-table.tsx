import type { SelectHome } from "@dorf/api/src/db/schema";

export function HomesTable({ homes }: { homes: SelectHome[] }) {
  if (!homes) return <></>;

  return (
    <div className="flex w-full flex-col space-y-2">
      {homes.map((home: SelectHome) => (
        <div key={home.id}>
          {home.id}-{home.district}
        </div>
      ))}
    </div>
  );
}

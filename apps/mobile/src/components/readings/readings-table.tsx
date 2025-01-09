import type { SelectReading } from "@dorf/api/src/db/schema";

export function ReadingsTable({ readings }: { readings: SelectReading[] }) {
  if (!readings) return <></>;

  return (
    <div className="flex w-full flex-col space-y-2">
      {readings.map((reading: any) => (
        <div key={reading.id}>
          {reading.id}-{reading.amount}
        </div>
      ))}
    </div>
  );
}

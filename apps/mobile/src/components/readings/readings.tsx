import { Button } from "@dorf/ui/button";
import type { SelectReadingType } from "@dorf/api/src/routes/readings";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@dorf/ui/card";
import { Icons } from "@dorf/ui/icons";

interface ReadingsProps {
  data: SelectReadingType[];
  onUpdate: (reading: SelectReadingType) => void;
  onDelete: (id: string) => void;
  onPrintInvoice: (id: string) => void;
}

export function Readings({
  data,
  onDelete,
  onUpdate,
  onPrintInvoice,
}: ReadingsProps) {
  return (
    <div className="min-h-[100vh-5.5rem] space-y-4">
      {data.length > 0 ? (
        data.map((reading) => (
          <Card key={reading.waterMeterId} className="shadow-sm">
            <CardHeader className="px-4 pt-5 pb-1">
              <CardTitle>{reading.waterMeterName}</CardTitle>
              <CardDescription>
                Meter ID: {reading.waterMeterId}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-4 py-1">
              <div className="grid grid-cols-2">
                <div className="flex items-center justify-start">
                  <div className="mr-2 flex items-center gap-2">
                    <Icons.Droplet
                      size={20}
                      className="text-muted-foreground"
                    />
                  </div>
                  <span className="font-semibold">{reading.amount} (ton)</span>
                </div>
                <div className="flex items-center justify-start">
                  <div className="mr-2 flex items-center gap-2">
                    <Icons.Calendar
                      size={20}
                      className="text-muted-foreground"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold">
                      {reading.periodStart
                        ? new Date(reading.periodStart).toLocaleDateString(
                            "fr-fr",
                            {
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                    <Icons.ArrowRight
                      className="mx-3 text-muted-foreground"
                      size={20}
                    />
                    <span className="font-semibold">
                      {reading.periodEnd
                        ? new Date(reading.periodEnd).toLocaleDateString(
                            "fr-fr",
                            {
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-3 gap-2 px-4 py-4">
              <Button
                variant="default"
                // className="col-span-2"
                onClick={() => onPrintInvoice(reading.id)}
              >
                Print Invoice
              </Button>
              <Button variant="outline" onClick={() => onUpdate(reading)}>
                Update
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(reading.waterMeterId)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader className="flex items-center justify-center">
            <CardTitle>
              <span className="text-gray-500">No results.</span>
            </CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

import type { SelectReading } from "@dorf/api/src/db/schema";
import { Button } from "@dorf/ui/button";
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
  data: SelectReading[];
  onUpdate: (reading: SelectReading) => void;
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
    <div className="space-y-4">
      {data.length > 0 ? (
        data.map((reading) => (
          <Card key={reading.waterMeterId} className="shadow-sm">
            <CardHeader className="px-4 pt-5 pb-1">
              <CardTitle>Reading Details</CardTitle>
              <CardDescription>
                Meter ID: {reading.waterMeterId}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-4 py-1">
              <div className="grid grid-cols-2">
                <div className="flex items-center justify-start">
                  <div className="mr-2 flex items-center gap-2">
                    <Icons.Droplet className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>{reading.amount} (ton)</span>
                </div>
                <div className="flex items-center justify-start">
                  <div className="mr-2 flex items-center gap-2">
                    <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>
                    {reading.createdAt
                      ? new Date(reading.createdAt).toLocaleDateString(
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
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 px-4 py-4">
              <Button
                variant="default"
                className="col-span-2"
                onClick={() => onPrintInvoice(reading.waterMeterId)}
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

import type { SelectWaterMeter } from "@dorf/api/src/db/schema";
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

interface WaterMetersTableProps {
  data: SelectWaterMeter[];
  onUpdate: (house: SelectWaterMeter) => void;
  onDelete: (id: string) => void;
}

export function WaterMeters({
  data,
  onDelete,
  onUpdate,
}: WaterMetersTableProps) {
  return (
    <div className="min-h-[100vh] space-y-4">
      {data.length > 0 ? (
        data.map((waterMeter) => (
          <Card key={waterMeter.id} className="shadow-sm">
            <CardHeader className="px-4 pt-5 pb-1">
              <CardTitle>{waterMeter.name}</CardTitle>
              <CardDescription>ID: {waterMeter.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-4 py-1">
              <div className="grid grid-cols-2">
                <div className="flex items-center justify-start">
                  <div className="mr-2 flex items-center gap-2">
                    <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>
                    {waterMeter.createdAt
                      ? new Date(waterMeter.createdAt).toLocaleDateString(
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
              <Button variant="outline" onClick={() => onUpdate(waterMeter)}>
                Update
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(waterMeter.id)}
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

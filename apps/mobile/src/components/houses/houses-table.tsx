import type { SelectHouse } from "@dorf/api/src/db/schema";
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

interface HousesTableProps {
  data: SelectHouse[];
  onUpdate: (house: SelectHouse) => void;
  onDelete: (id: string) => void;
}

export function HousesTable({ data, onDelete, onUpdate }: HousesTableProps) {
  return (
    <div className="space-y-4">
      {data.length > 0 ? (
        data.map((house) => (
          <Card key={house.waterMeterId} className="shadow-sm">
            <CardHeader className="px-4 pt-5 pb-1">
              <CardTitle>{house.name}</CardTitle>
              <CardDescription>ID: {house.waterMeterId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 px-4 py-1">
              <div className="grid grid-cols-2">
                <div className="flex items-center justify-start">
                  <div className="mr-2 flex items-center gap-2">
                    <Icons.MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>{house.district}</span>
                </div>
                <div className="flex items-center justify-start">
                  <div className="mr-2 flex items-center gap-2">
                    <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>
                    {house.createdAt
                      ? new Date(house.createdAt).toLocaleDateString("fr-fr", {
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2 px-4 py-4">
              <Button variant="outline" onClick={() => onUpdate(house)}>
                Update
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDelete(house.waterMeterId)}
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

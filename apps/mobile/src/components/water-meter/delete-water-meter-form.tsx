import { Button } from "@dorf/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@dorf/ui/drawer";
import { Form } from "@dorf/ui/form";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SERVER_URL } from "../../../env";

const updateWaterMeterSchema = z.object({
  waterMeterId: z.string().min(1, { message: "WaterMeter id is required" }),
});

type DeleteWaterMeterSchema = z.infer<typeof updateWaterMeterSchema>;

type Props = {
  token: string;
  waterMeterId: string;
};

export const DeleteWaterMeterForm = ({ waterMeterId, token }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DeleteWaterMeterSchema>({
    resolver: zodResolver(updateWaterMeterSchema),
    defaultValues: {
      waterMeterId,
    },
  });

  const updateWaterMeterMutation = useMutation({
    mutationFn: async (updateWaterMeter: DeleteWaterMeterSchema) => {
      const response = await fetch(
        `${SERVER_URL}/api/v1/api/water-meters/${waterMeterId}`,
        {
          method: "PUT",
          body: JSON.stringify(updateWaterMeter),
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }),
        },
      );
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast({ title: "WaterMeter Deleted" });
      queryClient.invalidateQueries({ queryKey: ["water-meters"] });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
    },
  });

  const onSubmit = (data: DeleteWaterMeterSchema) => {
    updateWaterMeterMutation.mutate(data);
  };

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <DrawerFooter className="p-0">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                close
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={updateWaterMeterMutation.isPending}
            >
              {updateWaterMeterMutation.isPending
                ? "Deleting..."
                : "Delete WaterMeter"}
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </DrawerContent>
  );
};

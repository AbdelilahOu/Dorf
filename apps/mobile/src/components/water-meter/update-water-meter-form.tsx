import { Button } from "@dorf/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@dorf/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dorf/ui/form";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { Input } from "@dorf/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SERVER_URL } from "../../../env";
import type { SelectWaterMeter } from "@dorf/api/src/db/schema";

const updateWaterMeterSchema = z.object({
  id: z.string().min(1, { message: "Water meter ID is required" }),
  district: z.string().min(1, { message: "District is required" }),
  name: z.string().optional(),
});

type UpdateWaterMeterSchema = z.infer<typeof updateWaterMeterSchema>;

type Props = {
  waterMeter: SelectWaterMeter;
  token: string;
};

export const UpdateWaterMeterForm = ({ waterMeter, token }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateWaterMeterSchema>({
    resolver: zodResolver(updateWaterMeterSchema),
    defaultValues: {
      id: waterMeter.id,
      name: waterMeter.name || undefined,
    },
  });

  const updateWaterMeterMutation = useMutation({
    mutationFn: async (updateWaterMeter: UpdateWaterMeterSchema) => {
      const response = await fetch(
        `${SERVER_URL}/api/v1/water-meters/${waterMeter.id}`,
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
      toast({ title: "WaterMeter Updated" });
      queryClient.invalidateQueries({ queryKey: ["water-meters"] });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
    },
  });

  const onSubmit = (data: UpdateWaterMeterSchema) => {
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
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Meter ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Water Meter ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="Enter District" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of the waterMeter</FormLabel>
                <FormControl>
                  <Input placeholder="Enter WaterMeter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DrawerFooter className="p-0">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                close
              </Button>
            </DrawerClose>
            <Button type="submit" disabled={updateWaterMeterMutation.isPending}>
              {updateWaterMeterMutation.isPending
                ? "Updating..."
                : "Update WaterMeter"}
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </DrawerContent>
  );
};

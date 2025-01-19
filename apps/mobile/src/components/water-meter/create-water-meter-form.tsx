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

const createWaterMeterSchema = z.object({
  id: z.string().min(1, { message: "Water meter ID is required" }),
  district: z.string().min(1, { message: "District is required" }),
  name: z.string().min(1, { message: "Nmae of the house hold is required" }),
});

type CreateWaterMeterSchema = z.infer<typeof createWaterMeterSchema>;

type Props = {
  token: string;
};

export const CreateWaterMeterForm = ({ token }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateWaterMeterSchema>({
    resolver: zodResolver(createWaterMeterSchema),
    defaultValues: {
      id: "",
      district: "",
      name: "",
    },
  });

  const createWaterMeterMutation = useMutation({
    mutationFn: async (NewWaterMeter: CreateWaterMeterSchema) => {
      const response = await fetch(`${SERVER_URL}/api/v1/water-meters`, {
        method: "POST",
        body: JSON.stringify(NewWaterMeter),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast({ title: "WaterMeter Created" });
      queryClient.invalidateQueries({ queryKey: ["water-meters"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
    },
  });

  const onSubmit = (data: CreateWaterMeterSchema) => {
    createWaterMeterMutation.mutate(data);
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
                <FormLabel>Name of the house</FormLabel>
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
            <Button type="submit" disabled={createWaterMeterMutation.isPending}>
              {createWaterMeterMutation.isPending
                ? "Creating..."
                : "Create WaterMeter"}
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </DrawerContent>
  );
};

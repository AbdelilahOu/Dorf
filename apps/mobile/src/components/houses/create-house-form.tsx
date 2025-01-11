import { Button } from "@dorf/ui/button";
import { DrawerClose, DrawerFooter } from "@dorf/ui/drawer";
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
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SERVER_URL } from "../../../env";

const createHouseSchema = z.object({
  waterMeterId: z.string().min(1, { message: "Water meter ID is required" }),
  district: z.string().min(1, { message: "District is required" }),
  name: z.string().min(1, { message: "Nmae of the house hold is required" }),
});

type CreateHouseSchema = z.infer<typeof createHouseSchema>;

export const CreateHouseForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CreateHouseSchema>({
    resolver: zodResolver(createHouseSchema),
    defaultValues: {
      waterMeterId: "",
      district: "",
      name: "",
    },
  });

  const createHouseMutation = useMutation({
    mutationFn: async (NewHouse: CreateHouseSchema) => {
      const response = await fetch(`${SERVER_URL}/houses`, {
        method: "POST",
        body: JSON.stringify(NewHouse),
      });
      if (response.status === 201 || response.status === 200) {
        return await response.json();
      }
      const data = await response.json();
      throw new Error(data.message);
    },
    onSuccess: () => {
      toast({ title: "House Created" });
      form.reset();
      navigate({ to: "/app/houses" });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
      console.error(error);
    },
  });

  const onSubmit = (data: CreateHouseSchema) => {
    createHouseMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="waterMeterId"
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
                <Input placeholder="Enter House name" {...field} />
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
          <Button type="submit" disabled={createHouseMutation.isPending}>
            {createHouseMutation.isPending ? "Creating..." : "Create House"}
          </Button>
        </DrawerFooter>
      </form>
    </Form>
  );
};

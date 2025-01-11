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
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SERVER_URL } from "../../../env";

const updateHouseSchema = z.object({
  waterMeterId: z.string().min(1, { message: "Water meter ID is required" }),
  district: z.string().min(1, { message: "District is required" }),
  name: z.string().min(1, { message: "Nmae of the house hold is required" }),
});

type UpdateHouseSchema = z.infer<typeof updateHouseSchema>;

export const UpdateHouseForm: React.FC<{ id: string }> = ({ id }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<UpdateHouseSchema>({
    resolver: zodResolver(updateHouseSchema),
    defaultValues: {
      waterMeterId: "",
      district: "",
      name: "",
    },
  });

  const {
    data: house,
    isPending: houseLoading,
    error: houseError,
  } = useQuery({
    queryKey: ["house", id],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/houses/${id}`, {
          method: "GET",
        });
        if (response.status === 200 || response.statusText === "OK") {
          return await response.json();
        }
        const data = await response.json();
        toast({ title: data.message, variant: "destructive" });
        navigate({ to: "/app/houses" });
        return null;
      } catch (error) {
        console.error(error);
        toast({ title: `Error: ${error}`, variant: "destructive" });
        return null;
      }
    },
    enabled: !!id,
  });

  const updateHouseMutation = useMutation({
    mutationFn: async (updateHouse: UpdateHouseSchema) => {
      const response = await fetch(`${SERVER_URL}/houses/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateHouse),
      });
      if (response.status === 200 || response.status === 201) {
        return await response.json();
      }
      const data = await response.json();
      throw new Error(data.message);
    },
    onSuccess: () => {
      toast({ title: "House Updated" });
      navigate({ to: "/app/houses" });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
      console.error(error);
    },
  });

  const onSubmit = (data: UpdateHouseSchema) => {
    updateHouseMutation.mutate(data);
  };

  if (houseLoading) {
    return <p>Loading house...</p>;
  }

  if (houseError || !house) {
    return <p>Failed to load House</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" disabled={updateHouseMutation.isPending}>
            {updateHouseMutation.isPending ? "Updating..." : "Update House"}
          </Button>
        </DrawerFooter>
      </form>
    </Form>
  );
};

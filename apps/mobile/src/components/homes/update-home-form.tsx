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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dorf/ui/select";
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
  headOfHousehold: z
    .string()
    .min(1, { message: "Head of household is required" }),
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
      headOfHousehold: "",
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
        navigate({ to: "/houses" });
        return null;
      } catch (error) {
        console.error(error);
        toast({ title: `Error: ${error}`, variant: "destructive" });
        return null;
      }
    },
    enabled: !!id,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/users`, {
          method: "GET",
        });
        if (response.status === 200 || response.statusText === "OK") {
          return await response.json();
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    retry: false,
  });

  const updateHouseMutation = useMutation({
    mutationFn: async ({
      waterMeterId,
      district,
      headOfHousehold,
    }: UpdateHouseSchema) => {
      const response = await fetch(`${SERVER_URL}/houses/${id}`, {
        method: "PUT",
        body: JSON.stringify({ waterMeterId, district, headOfHousehold }),
      });
      if (response.status === 200 || response.status === 201) {
        return await response.json();
      }
      const data = await response.json();
      throw new Error(data.message);
    },
    onSuccess: () => {
      toast({ title: "House Updated" });
      navigate({ to: "/houses" });
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
          name="headOfHousehold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Head of Household</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user: { id: string; name: string }) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

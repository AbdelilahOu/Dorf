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
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetch } from "@tauri-apps/plugin-http";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SERVER_URL } from "../../../env";

const createHomeSchema = z.object({
  waterMeterId: z.string().min(1, { message: "Water meter ID is required" }),
  district: z.string().min(1, { message: "District is required" }),
  headOfHousehold: z
    .string()
    .min(1, { message: "Head of household is required" }),
});

type CreateHomeSchema = z.infer<typeof createHomeSchema>;

export const CreateHomeForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CreateHomeSchema>({
    resolver: zodResolver(createHomeSchema),
    defaultValues: {
      waterMeterId: "",
      district: "",
      headOfHousehold: "",
    },
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

  const createHomeMutation = useMutation({
    mutationFn: async (NewHome: CreateHomeSchema) => {
      const response = await fetch(`${SERVER_URL}/homes`, {
        method: "POST",
        body: JSON.stringify(NewHome),
      });
      if (response.status === 201 || response.status === 200) {
        return await response.json();
      }
      const data = await response.json();
      throw new Error(data.message);
    },
    onSuccess: () => {
      toast({ title: "Home Created" });
      form.reset();
      navigate({ to: "/homes" });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
      console.error(error);
    },
  });

  const onSubmit = (data: CreateHomeSchema) => {
    createHomeMutation.mutate(data);
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
          <Button type="submit" disabled={createHomeMutation.isPending}>
            {createHomeMutation.isPending ? "Creating..." : "Create Home"}
          </Button>
        </DrawerFooter>
      </form>
    </Form>
  );
};

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

const createReadingSchema = z.object({
  homeId: z.coerce
    .number()
    .positive({ message: "Home ID must be a positive number" }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number" }),
});

type CreateReadingSchema = z.infer<typeof createReadingSchema>;

export const CreateReadingForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<CreateReadingSchema>({
    resolver: zodResolver(createReadingSchema),
    defaultValues: {
      homeId: undefined,
      amount: undefined,
    },
  });

  const { data: homes } = useQuery({
    queryKey: ["homes"],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/homes`, {
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

  const createReadingMutation = useMutation({
    mutationFn: async ({ homeId, amount }: CreateReadingSchema) => {
      const response = await fetch(`${SERVER_URL}/readings`, {
        method: "POST",
        body: JSON.stringify({ homeId, amount }),
      });
      if (response.status === 201 || response.status === 200) {
        return await response.json();
      }
      const data = await response.json();
      throw new Error(data.message);
    },
    onSuccess: () => {
      toast({ title: "Reading Created" });
      form.reset();
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
      console.error(error);
    },
  });

  const onSubmit = (data: CreateReadingSchema) => {
    createReadingMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        <FormField
          control={form.control}
          name="homeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter homeId" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (m³)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} />
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
          <Button type="submit" disabled={createReadingMutation.isPending}>
            {createReadingMutation.isPending ? "Creating..." : "Create Reading"}
          </Button>
        </DrawerFooter>
      </form>
    </Form>
  );
};

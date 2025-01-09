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

const updateReadingSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number" }),
});

type UpdateReadingSchema = z.infer<typeof updateReadingSchema>;

const UpdateReadingForm: React.FC<{ id: string }> = ({ id }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<UpdateReadingSchema>({
    resolver: zodResolver(updateReadingSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const {
    data: reading,
    isPending: readingLoading,
    error: readingError,
  } = useQuery({
    queryKey: ["reading", id],
    queryFn: async () => {
      try {
        const response = await fetch(`${SERVER_URL}/readings/${id}`, {
          method: "GET",
        });
        if (response.status === 200 || response.statusText === "OK") {
          return await response.json();
        }
        const data = await response.json();
        toast({ title: data.message, variant: "destructive" });
        navigate({ to: "/" });
        return null;
      } catch (error) {
        console.error(error);
        toast({ title: `Error: ${error}`, variant: "destructive" });
        return null;
      }
    },
    enabled: !!id,
  });

  const updateReadingMutation = useMutation({
    mutationFn: async ({ amount }: UpdateReadingSchema) => {
      const response = await fetch(`${SERVER_URL}/readings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ amount }),
      });
      if (response.status === 200 || response.status === 201) {
        return await response.json();
      }
      const data = await response.json();
      throw new Error(data.message);
    },
    onSuccess: () => {
      toast({ title: "Reading Updated" });
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
      console.error(error);
    },
  });

  const onSubmit = (data: UpdateReadingSchema) => {
    updateReadingMutation.mutate(data);
  };

  if (readingLoading) {
    return <p>Loading reading...</p>;
  }

  if (readingError || !reading) {
    return <p>Failed to load Reading</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button type="submit" disabled={updateReadingMutation.isPending}>
            {updateReadingMutation.isPending ? "Updating..." : "Update Reading"}
          </Button>
        </DrawerFooter>
      </form>
    </Form>
  );
};

export default UpdateReadingForm;

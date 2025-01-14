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

export const UpdateReadingForm: React.FC<{ id: string }> = ({ id }) => {
  const { toast } = useToast();

  const form = useForm<UpdateReadingSchema>({
    resolver: zodResolver(updateReadingSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const updateReadingMutation = useMutation({
    mutationFn: async ({ amount }: UpdateReadingSchema) => {
      const response = await fetch(`${SERVER_URL}/readings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ amount }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast({ title: "Reading Updated" });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
    },
  });

  const onSubmit = (data: UpdateReadingSchema) => {
    updateReadingMutation.mutate(data);
  };

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

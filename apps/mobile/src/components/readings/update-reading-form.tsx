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
import type { SelectReading } from "@dorf/api/src/db/schema";

const updateReadingSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number" }),
});

type UpdateReadingSchema = z.infer<typeof updateReadingSchema>;

type Props = {
  reading: SelectReading;
  token: string;
};

export const UpdateReadingForm = ({ reading, token }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateReadingSchema>({
    resolver: zodResolver(updateReadingSchema),
    defaultValues: {
      amount: reading.amount,
    },
  });

  const updateReadingMutation = useMutation({
    mutationFn: async ({ amount }: UpdateReadingSchema) => {
      const response = await fetch(`${SERVER_URL}/readings/${reading.id}`, {
        method: "PUT",
        body: JSON.stringify({ amount }),
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
      toast({ title: "Reading Updated" });
      queryClient.invalidateQueries({ queryKey: ["readings"] });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
    },
  });

  const onSubmit = (data: UpdateReadingSchema) => {
    updateReadingMutation.mutate(data);
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
              {updateReadingMutation.isPending
                ? "Updating..."
                : "Update Reading"}
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </DrawerContent>
  );
};

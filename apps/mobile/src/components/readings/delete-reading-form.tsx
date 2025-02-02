import { Button } from "@dorf/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@dorf/ui/drawer";
import { Form } from "@dorf/ui/form";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SERVER_URL } from "../../../env";

const updateReadingSchema = z.object({
  id: z.string().min(1, { message: "Reading id is required" }),
});

type DeleteReadingSchema = z.infer<typeof updateReadingSchema>;

type Props = {
  token: string;
  id: string;
};

export const DeleteReadingForm = ({ id, token }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DeleteReadingSchema>({
    resolver: zodResolver(updateReadingSchema),
    defaultValues: {
      id,
    },
  });

  const updateReadingMutation = useMutation({
    mutationFn: async (updateReading: DeleteReadingSchema) => {
      const response = await fetch(`${SERVER_URL}/api/v1/readings/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateReading),
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
      toast({ title: "Reading Deleted" });
      queryClient.invalidateQueries({ queryKey: ["readings"] });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
    },
  });

  const onSubmit = (data: DeleteReadingSchema) => {
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
          <DrawerFooter className="p-0">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                close
              </Button>
            </DrawerClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={updateReadingMutation.isPending}
            >
              {updateReadingMutation.isPending
                ? "Deleting..."
                : "Delete Reading"}
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </DrawerContent>
  );
};

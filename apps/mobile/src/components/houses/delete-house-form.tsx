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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SERVER_URL } from "../../../env";

const updateHouseSchema = z.object({
  id: z.string().min(1, { message: "House id is required" }),
});

type DeleteHouseSchema = z.infer<typeof updateHouseSchema>;

export const DeleteHouseForm: React.FC<{ id: string }> = ({ id }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<DeleteHouseSchema>({
    resolver: zodResolver(updateHouseSchema),
    defaultValues: {
      id,
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
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        toast({ title: `Error: ${error}`, variant: "destructive" });
        return {};
      }
    },
    enabled: !!id,
  });

  const updateHouseMutation = useMutation({
    mutationFn: async (updateHouse: DeleteHouseSchema) => {
      const response = await fetch(`${SERVER_URL}/houses/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateHouse),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast({ title: "House Deleted" });
      queryClient.invalidateQueries({ queryKey: ["houses"] });
    },
    onError: (error: any) => {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
    },
  });

  const onSubmit = (data: DeleteHouseSchema) => {
    updateHouseMutation.mutate(data);
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
              disabled={updateHouseMutation.isPending}
            >
              {updateHouseMutation.isPending ? "Deleting..." : "Delete House"}
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </DrawerContent>
  );
};

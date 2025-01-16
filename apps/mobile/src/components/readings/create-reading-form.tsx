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
import { Popover, PopoverContent, PopoverTrigger } from "@dorf/ui/popover";
import { Calendar } from "@dorf/ui/calendar";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { Input } from "@dorf/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetch } from "@tauri-apps/plugin-http";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { SERVER_URL } from "../../../env";
import { Icons } from "@dorf/ui/icons";
import { cn } from "@dorf/ui/utils";

const createReadingSchema = z.object({
  waterMeterId: z.coerce.string(),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number" }),
  readingDate: z.string(),
});

type CreateReadingSchema = z.infer<typeof createReadingSchema>;

type Props = {
  token: string;
};

export const CreateReadingForm = ({ token }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateReadingSchema>({
    resolver: zodResolver(createReadingSchema),
    defaultValues: {
      waterMeterId: undefined,
      amount: undefined,
    },
  });

  const createReadingMutation = useMutation({
    mutationFn: async (reading: CreateReadingSchema) => {
      const response = await fetch(`${SERVER_URL}/readings`, {
        method: "POST",
        body: JSON.stringify({
          waterMeterId: reading.waterMeterId.toString(),
          amount: reading.amount,
          readingDate: reading.readingDate,
        }),
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
      toast({ title: "Reading Created" });
      queryClient.invalidateQueries({ queryKey: ["readings"] });
      form.reset();
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
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <FormField
            control={form.control}
            name="waterMeterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>House</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter waterMeterId"
                    {...field}
                  />
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
          <FormField
            control={form.control}
            name="readingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Reading Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        type="button"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <Icons.Calendar />
                        {field.value ? (
                          new Date(field.value).toLocaleString()
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        // @ts-ignore
                        selected={field.value}
                        onSelect={(v) => field.onChange(v?.toDateString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
              {createReadingMutation.isPending
                ? "Creating..."
                : "Create Reading"}
            </Button>
          </DrawerFooter>
        </form>
      </Form>
    </DrawerContent>
  );
};

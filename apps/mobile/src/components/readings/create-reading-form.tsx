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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dorf/ui/select";
import { cn } from "@dorf/ui/utils";
import { useState } from "react";

const createReadingSchema = z.object({
  waterMeterId: z.coerce.string(),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number" }),
  periodStart: z.string(),
  periodEnd: z.string(),
});

type CreateReadingSchema = z.infer<typeof createReadingSchema>;

type Props = {
  token: string;
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const CreateReadingForm = ({ token }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateReadingSchema>({
    resolver: zodResolver(createReadingSchema),
    defaultValues: {
      waterMeterId: undefined,
      amount: undefined,
      periodStart: undefined,
      periodEnd: undefined,
    },
  });

  const createReadingMutation = useMutation({
    mutationFn: async (reading: CreateReadingSchema) => {
      const response = await fetch(`${SERVER_URL}/api/v1/readings`, {
        method: "POST",
        body: JSON.stringify({
          waterMeterId: reading.waterMeterId.toString(),
          amount: reading.amount,
          periodStart: reading.periodStart,
          periodEnd: reading.periodEnd,
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
    console.log(data);
    createReadingMutation.mutate(data);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handlePeriodChange = (
    field: "periodStart" | "periodEnd",
    month: string,
    year: string,
  ) => {
    const monthIndex = months.indexOf(month);
    const date = new Date(parseInt(year), monthIndex, 1).toISOString();
    form.setValue(field, date);
  };

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Create Reading</DrawerTitle>
        <DrawerDescription>
          Fill in the form to create a new reading.
        </DrawerDescription>
      </DrawerHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <FormField
            control={form.control}
            name="waterMeterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WaterMeter</FormLabel>
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
            name="periodStart"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Period Start</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(year) =>
                        handlePeriodChange(
                          "periodStart",
                          new Date(field.value || Date.now()).toLocaleString(
                            "default",
                            { month: "long" },
                          ),
                          year,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(month) =>
                        handlePeriodChange(
                          "periodStart",
                          month,
                          new Date(field.value || Date.now())
                            .getFullYear()
                            .toString() || new Date().getFullYear().toString(),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="periodEnd"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Period End</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(year) =>
                        handlePeriodChange(
                          "periodEnd",
                          new Date(field.value || Date.now()).toLocaleString(
                            "default",
                            { month: "long" },
                          ),
                          year,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(month) =>
                        handlePeriodChange(
                          "periodEnd",
                          month,
                          new Date(field.value || Date.now())
                            .getFullYear()
                            .toString() || new Date().getFullYear().toString(),
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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

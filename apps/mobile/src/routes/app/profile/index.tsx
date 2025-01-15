import type { SelectUser } from "@dorf/api/src/db/schema";
import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "../app-layout";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@dorf/ui/card";
import { Button } from "@dorf/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dorf/ui/form";
import { Input } from "@dorf/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@dorf/ui/hooks/use-toast";

const profileSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }).optional(),
  fullName: z.string().optional(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

export const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/profile",
  component: ProfileComponent,
  loader: async ({ context }) => {
    const [user, token] = await Promise.all([
      context.store.get<SelectUser>("user"),
      context.store.get<string>("token"),
    ]);
    return {
      user,
      token,
    };
  },
});

function ProfileComponent() {
  const { user, token } = profileRoute.useLoaderData() as {
    user: SelectUser;
    token: string;
  };
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user.email || "",
      fullName: user.name || "",
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    form.reset({
      email: user.email || "",
      fullName: user.name || "",
    });
    setIsEditing(false);
  };

  const onSubmit = async (data: ProfileSchema) => {
    try {
      // here you would perform an api call to update the user with the token
      console.log(data);
      console.log(token);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating user",
      });
    }
  };
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>View and edit your profile details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your first name"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="flex gap-2 p-0">
                {!isEditing ? (
                  <Button type="button" onClick={handleEditClick}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </Button>
                    <Button
                      className=""
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </>
                )}
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

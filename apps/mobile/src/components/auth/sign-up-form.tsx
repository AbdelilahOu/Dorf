import { Button } from "@dorf/ui/button";
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
import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTauriApis } from "../../context";
import {
  type AuthError,
  AuthErrorCodes,
  authClient,
} from "../../lib/auth-client";

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export const SignUpForm: React.FC = () => {
  const { toast } = useToast();
  const { store } = useTauriApis();

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate({ from: "/auth/signup" });

  const signUpMutation = useMutation({
    mutationFn: async ({ name, email, password }: SignUpSchema) => {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: async ({ token, user }) => {
      await store?.set("token", token);
      await store?.set("user", user);
      toast({
        title: "Sign up successful!",
      });

      navigate({ to: "/" });
    },
    onError: (error: AuthError) => {
      toast({
        variant: "destructive",
        title:
          AuthErrorCodes[error?.code]?.ar ||
          "Failed to sign in. Please try again.",
      });
    },
  });

  const onSubmit = (data: SignUpSchema) => {
    signUpMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John Doe" {...field} />
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
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={signUpMutation.isPending}
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

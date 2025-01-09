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

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type SignInSchema = z.infer<typeof signInSchema>;

export const SignInForm: React.FC = () => {
  const { toast } = useToast();
  const { store } = useTauriApis();

  const navigate = useNavigate({ from: "/auth/signin" });

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: SignInSchema) => {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
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
        title: "Sign in successful!",
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

  const onSubmit = (data: SignInSchema) => {
    signInMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          disabled={signInMutation.isPending}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};

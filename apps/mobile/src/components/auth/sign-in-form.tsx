import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dorf/ui/form";
import { Input } from "@dorf/ui/input";
import { Button } from "@dorf/ui/button";
import { authClient } from "../../lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@dorf/ui/hooks/use-toast";
import { useNavigate } from "@tanstack/react-router";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type SignInSchema = z.infer<typeof signInSchema>;

const SignInForm: React.FC = () => {
  const { toast } = useToast();
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
      });
      if (data && !error) {
        return data;
      }
      throw error;
    },
    onSuccess: () => {
      toast({
        title: "Sign in successful!",
      });
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      console.error("Signin error:", error);
      toast({
        variant: "destructive",
        title: "Failed to sign in. Please try again.",
        description: error.message, // Optional: Show error message
      });
    },
  });

  const onSubmit = (data: SignInSchema) => {
    signInMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="mb-6 font-semibold text-2xl">Sign In</h2>
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

export default SignInForm;

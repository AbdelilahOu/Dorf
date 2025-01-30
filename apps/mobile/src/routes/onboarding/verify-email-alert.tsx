import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "../__root";
// @ts-ignore
import Icon from "../../assets/icon.png";
import { Button } from "@dorf/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SERVER_URL } from "../../../env";
import type { SelectUser } from "@dorf/api/src/db/schema";
import { TopNavigation } from "../../components/top-navigation";
import { fetch } from "@tauri-apps/plugin-http";
import { useTauriApis } from "../../context";
import { useToast } from "@dorf/ui/hooks/use-toast";

export const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/verify-email",
  component: VerifyEmailComponent,
  loader: async ({ context }) => {
    const token = await context.store.get<string>("token");
    const user = await context.store.get<string>("user");
    return {
      token,
      user,
    };
  },
});

function VerifyEmailComponent() {
  const { token, user } = verifyEmailRoute.useLoaderData() as {
    token: string;
    user: SelectUser;
  };

  const { store } = useTauriApis();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate({ from: "/verify-email" });

  const sessionMutation = useMutation({
    mutationKey: ["session"],
    mutationFn: async () => {
      const response = await fetch(`${SERVER_URL}/api/v1/users/${user.id}`, {
        method: "PUT",
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }
      return await response.json();
    },
    async onSuccess(data) {
      await store?.set("user", data);
      queryClient.invalidateQueries({ queryKey: "user" });
      if (data.emailVerified) {
        navigate({ to: "/app" });
      }
    },
    onError(error) {
      toast({ title: `Error: ${error.message}`, variant: "destructive" });
      console.log(error);
    },
  });
  return (
    <div className="relative flex h-full w-full flex-col justify-between">
      <TopNavigation user={user} />
      <div className="relative flex h-full w-full flex-col justify-between p-2">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <img src={Icon} alt="app icon" />
          <h1 className="font-medium text-2xl">your email is not verified</h1>
          <p>contact admins +212603539796</p>
        </div>
        <Button onClick={() => sessionMutation.mutate()}>Refresh</Button>
      </div>
    </div>
  );
}

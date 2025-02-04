import { Button } from "@dorf/ui/button";
import { Icons } from "@dorf/ui/icons";
import { useTauriApis } from "../context";
import { useNavigate, useRouter } from "@tanstack/react-router";
import type { SelectUser } from "@dorf/api/src/db/schema";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";

export function TopNavigation({ user }: { user?: SelectUser }) {
  const { store } = useTauriApis();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogOut = async () => {
    await Promise.all([store?.delete("token"), store?.delete("user")]);
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    await authClient.signOut();
    navigate({ to: "/onboarding" });
  };

  const handleOnGoBack = () => {
    user !== undefined
      ? router.history.back()
      : navigate({ to: "/onboarding" });
  };

  return (
    <div className="fixed top-0 flex h-11 min-h-11 w-full items-center justify-between bg-white px-2 py-1 shadow-sm">
      <Button onClick={handleOnGoBack} size={"icon"} variant={"ghost"}>
        <Icons.ChevronLeft />
      </Button>
      <div>{user?.name}</div>
      {user && (
        <Button onClick={handleLogOut} size={"icon"} variant={"ghost"}>
          <Icons.Logout />
        </Button>
      )}
    </div>
  );
}

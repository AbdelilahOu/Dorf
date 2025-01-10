import { Button } from "@dorf/ui/button";
import { Icons } from "@dorf/ui/icons";
import { useTauriApis } from "../context";
import { useNavigate } from "@tanstack/react-router";
import type { SelectUser } from "@dorf/api/src/db/schema";
import { useQueryClient } from "@tanstack/react-query";

export function TopNavigation({ user }: { user?: SelectUser }) {
  const { store } = useTauriApis();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleLogOut = async () => {
    await Promise.all([store?.delete("token"), store?.delete("user")]);
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    navigate({ to: "/onboarding" });
  };
  return (
    <div className="flex h-11 w-full items-center justify-between bg-white">
      <Button size={"icon"} variant={"ghost"}>
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

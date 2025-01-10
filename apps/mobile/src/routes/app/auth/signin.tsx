import { createRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SignInForm } from "../../../components/auth/sign-in-form";
import { authLayoutRoute } from "./layout";

export const signInRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "signin",
  component: SigninRouteComponent,
});

function SigninRouteComponent() {
  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col justify-center">
        <SignInForm />
        <p className="py-2">
          {"if you dont have an account "}
          <Link className="underline" to="/app/auth/signup">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

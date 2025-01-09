import { Link, createRoute } from "@tanstack/react-router";
import { SignUpForm } from "../../components/auth/sign-up-form";
import { authLayoutRoute } from "./layout";

export const signUpRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "signup",
  component: SignupRouteComponent,
});

function SignupRouteComponent() {
  return (
    <div className="h-full w-full">
      <div className="flex h-full w-full flex-col justify-center">
        <SignUpForm />
        <p className="py-2">
          {"if you have an account "}
          <Link className="underline" to="/auth/signin">
            Signin here
          </Link>
        </p>
      </div>
    </div>
  );
}

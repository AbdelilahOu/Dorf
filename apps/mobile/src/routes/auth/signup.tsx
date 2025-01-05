import { createRoute, Link } from "@tanstack/react-router";
import { authLayoutRoute } from "./layout";
import SignUpForm from "../../components/auth/sign-up-form";

export const signUpRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "signup",
  component: SignupRouteComponent,
});

function SignupRouteComponent() {
  return (
    <div>
      <SignUpForm />
      if you have an account <Link to="/auth/signin">Signin here</Link>
    </div>
  );
}

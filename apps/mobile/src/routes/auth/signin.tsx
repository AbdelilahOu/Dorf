import { createRoute } from "@tanstack/react-router";
import { authLayoutRoute } from "./layout";
import SignInForm from "../../components/auth/sign-in-form";
import { Link } from "@tanstack/react-router";

export const signInRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "signin",
  component: SigninRouteComponent,
});

function SigninRouteComponent() {
  return (
    <div>
      <SignInForm />
      <p>
        if you dont have an account <Link to="/auth/signup">Register here</Link>
      </p>
    </div>
  );
}

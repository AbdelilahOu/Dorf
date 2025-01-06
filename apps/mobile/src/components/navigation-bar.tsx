import { Link } from "@tanstack/react-router";

function Navigation() {
  return (
    <div className="h-10 min-h-10 shadow-md">
      <Link to="/auth/signin">signin</Link>
      <Link to="/">home</Link>
    </div>
  );
}

export default Navigation;

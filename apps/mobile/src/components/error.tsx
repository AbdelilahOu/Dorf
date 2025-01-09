import { buttonVariants } from "@dorf/ui/button";
import { Link } from "@tanstack/react-router";

export function DefaultErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="rounded-lg p-8 text-center">
        <h2 className="mb-4 font-bold text-3xl text-red-600">
          Oops! Something went wrong.
        </h2>
        <p className="mb-6 text-gray-700">
          We've encountered an unexpected issue. Please try again or contact
          support if the problem persists.
        </p>

        {error.message && (
          <div className="mb-4 rounded border border-red-200 bg-red-100 p-2 text-red-500 ">
            <p className="font-medium">Error Details:</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}

        <Link
          to="/"
          className={buttonVariants({
            variant: "link",
          })}
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

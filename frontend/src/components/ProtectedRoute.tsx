import { Navigate, Outlet } from "react-router";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { Spinner } from "./ui/spinner";

function ProtectedRoute() {
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        <Spinner className="size-8 " />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

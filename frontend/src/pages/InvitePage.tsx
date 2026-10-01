import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import useAcceptInvitation from "@/hooks/invitation/useAcceptInvitation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const acceptInvitationMutation = useAcceptInvitation();

  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    if (isError || !user || !token) {
      navigate(`/login?redirect=/invite/${token}`, {
        replace: true,
      });
    }
  }, [isLoading, isError, user, token, navigate]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !user || !token) return;

  const handleAcceptInvitation = () => {
    console.log("Reached")
    acceptInvitationMutation.mutate(token, {
      onSuccess: () => {
        toast.success("Invitation accepted succesfully");
        navigate("/home");
      },
      onError: (e) => {
        console.log(e.message);
        toast.error(e.message);
      },
    });
  };

  return (
    <div className="flex flex-col gap-2 items-center min-h-screen min-w-screen content-center">
      <Card className="flex flex-col gap-2 justify-center p-4 md:p-12 items-center w-1/3 m-12">
        <h1>You've been invited to be an accountability partner!</h1>
        <Button onClick={handleAcceptInvitation}>Accept</Button>
      </Card>
    </div>
  );
}

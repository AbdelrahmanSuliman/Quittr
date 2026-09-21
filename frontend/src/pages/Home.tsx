import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useCreateAddiction from "@/hooks/addiction/useCreateAddictions";
import useCreateInvitation from "@/hooks/invitation/useCreateInvitation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useGetAddictions } from "@/hooks/addiction/useGetAddictions";
import AddictionItem from "@/components/AddictionItem";
import type { Addiction } from "@/api/addiction";
import { useDeleteAddiction } from "@/hooks/addiction/useDeleteAddiction";
import useLogout from "@/hooks/auth/useLogout";
import useRenameAddiction from "@/hooks/addiction/useRenameAddiction";
import { toast } from "sonner";

function Home() {
  const [showInvitationScreen, setShowInvitationScreen] = useState(false);
  const [showAddictionCreationDialog, setShowAddictionCreationDialog] =
    useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [currentAddiction, setCurrentAddiction] = useState<Addiction>();

  const createAddictionMutation = useCreateAddiction();
  const deleteAddictionMutation = useDeleteAddiction();
  const createInvitationMutation = useCreateInvitation();
  const getAddictionsQuery = useGetAddictions();
  const getLogoutMutation = useLogout();
  const renameAddictionMutation = useRenameAddiction();

  const onAddictionDeletionSubmit = (addictionId: string) => {
    console.log(addictionId);
    deleteAddictionMutation.mutate(addictionId, {
      onSuccess: () => {
        console.log("Deleted successfully");
        toast.success("Addiction Deleted Successfully!");
      },
      onError: (e) => {
        toast.error(e.message);
        console.log(e.message);
      },
    });
  };

  const onAddictionRenameSubmit = (addictionId: string, newName: string) => {
    console.log("Addiction ID: ", addictionId, "New Name: ", newName);
    renameAddictionMutation.mutate({
      addictionId: addictionId,
      name: newName,
    }, {
      onSuccess: () => {
        console.log("Addiction Renamed Successfully")
        toast.success("Addicition Renamed Succesfully")
      }, 
      onError: (e) => {
        console.log(e.message)
        toast.error(e.message)
      }
    });
  };

  const onLogout = () => {
    getLogoutMutation.mutate();
    toast.info("Logged Out Successfully")
  };

  const onAddictionCreationSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    createAddictionMutation.mutate(name, {
      onSuccess: (addiction) => {
        createInvitationMutation.mutate(addiction.id, {
          onSuccess: (invitation) => {
            setInvitationLink(invitation.invitationLink);
            setShowInvitationScreen(true);
            setShowAddictionCreationDialog(false);
            toast.success("Addiction Created Successfully!")
          },
        });
      },
      onError: (e) => {
        console.log(e.message)
        toast.error(e.message)
      }
    });
  };

  return (
    <div className="min-h-screen w-screen">
      <div className="flex flex-row justify-between items-center px-4">
        <h1 className="text-center p-8 text-4xl font-logo">Quittr</h1>
        <Button onClick={() => onLogout()}>Logout</Button>
      </div>
      <main className="flex flex-col lg:flex-row gap-6 px-12 min-h-screen">
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="flex flex-row justify-between gap-2">
            <h2>Addictions</h2>
            <Dialog
              open={showAddictionCreationDialog}
              onOpenChange={setShowAddictionCreationDialog}
            >
              <DialogTrigger render={<Button>Create Addiction</Button>} />
              <DialogContent>
                <form
                  id="create-addiction-form"
                  onSubmit={onAddictionCreationSubmit}
                >
                  <DialogHeader className="py-4">
                    <DialogTitle>Create Addiction</DialogTitle>

                    <DialogDescription>
                      Create an addiction to start tracking.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="addiction-name"
                      className="text-sm font-medium"
                    >
                      Name
                    </label>

                    <Input
                      id="addiction-name"
                      name="name"
                      placeholder="e.g. Social Media"
                    />
                  </div>

                  <DialogFooter className="mt-4">
                    <DialogClose
                      render={
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      }
                    />
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
              <span className="font-semibold">Your Addictions</span>
              <ChevronDown />
            </CollapsibleTrigger>{" "}
            <CollapsibleContent className="mt-2 space-y-2">
              {getAddictionsQuery.isLoading && <Loader />}
              {getAddictionsQuery.isError && (
                <p className="text-destructive">Failed to fetch addictions</p>
              )}
              {getAddictionsQuery.data?.map((addiction) => (
                <AddictionItem
                  key={addiction.id}
                  addiction={addiction}
                  onSelect={() => setCurrentAddiction(addiction)}
                  onDelete={() => onAddictionDeletionSubmit(addiction.id)}
                  onRename={(newName) =>
                    onAddictionRenameSubmit(addiction.id, newName)
                  }
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        <Card className="lg:w-2/3">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>

          <CardContent>{/* Calendar + Journal */}</CardContent>
        </Card>
      </main>
      <Dialog
        open={showInvitationScreen}
        onOpenChange={setShowInvitationScreen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite an Accountability Partner</DialogTitle>{" "}
            <DialogDescription>
              Share this link with someone you trust. They can use it to join
              this addiction as your accountability partner.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Input value={invitationLink} readOnly className="flex-1" />
            <Button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(invitationLink);
              }}
            >
              Copy
            </Button>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setShowInvitationScreen(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Home;

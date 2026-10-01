import { Card, CardContent } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Pencil } from "lucide-react";
import { useState } from "react";

interface AddictionItemProps {
  addiction: {
    id: string;
    name: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

function AddictionItem({
  addiction,
  isSelected,
  onSelect,
  onDelete,
  onRename,
}: AddictionItemProps) {
  const [showRenameScreen, setShowRenameScreen] = useState(false);
  const [name, setName] = useState(addiction.name);

  if (showRenameScreen) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Rename addiction</h2>
              <p className="text-sm text-muted-foreground">
                Enter a new name for this addiction.
              </p>
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setName(addiction.name);
                  setShowRenameScreen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  onRename(name);
                  setShowRenameScreen(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected ? "border-primary bg-accent" : "hover:bg-accent "
      }`}
      onClick={onSelect}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-medium">{addiction.name}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical />
              </Button>
            }
          />

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setShowRenameScreen(true)
              }}
            >
              <Pencil />
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}

export default AddictionItem;

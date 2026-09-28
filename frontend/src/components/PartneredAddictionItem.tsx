import { Card, CardContent } from "@/components/ui/card";

interface PartneredAddictionItemProps {
  addiction: {
    id: string;
    name: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

function PartneredAddictionItem({
  addiction,
  isSelected,
  onSelect,
}: PartneredAddictionItemProps) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected ? "border-primary bg-accent" : "hover:bg-accent"
      }`}
      onClick={onSelect}
    >
      <CardContent className="flex items-center p-4">
        <div>
          <p className="font-medium">{addiction.name}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PartneredAddictionItem;

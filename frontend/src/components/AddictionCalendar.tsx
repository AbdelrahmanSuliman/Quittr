import { useState } from "react";
import { DatePicker } from "./DatePicker";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useCreateJournalEntry from "@/hooks/journal/useCreateJournalEntry";

interface AddictionCalendarProps {
  addictionId: string;
}

function AddictionCalendar({ addictionId }: AddictionCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [content, setContent] = useState("");
  const [succeeded, setSucceeded] = useState(true);

  const createEntryMutation = useCreateJournalEntry();

  const handleSave = () => {
    if (!date) {
      toast.error("Please select a date before saving.");
      return;
    }
    console.log({
      date: date?.toISOString().split("T")[0],
      content,
      succeeded,
    });
    createEntryMutation.mutate(
      {
        addictionId,
        succeeded,
        content,
        targetDate: date,
      },
      {
        onSuccess: () => {
          toast("Entry Saved Successfully");
        },
        onError: (e) => {
          console.error(e.message);
          toast(e.message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="flex items-center justify-between lg:flex-row flex-col gap-4">
        <DatePicker date={date} setDate={setDate} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSucceeded(!succeeded)}
          className={
            succeeded
              ? "border-green-500 text-green-600"
              : "border-red-500 text-red-600"
          }
        >
          {succeeded ? "Day Succeeded ✓" : "Relapsed / Struggled ✕"}
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How did today go?"
          className="w-full min-h-fit bg-transparent border-none outline-none resize-none focus:ring-0 placeholder:text-muted-foreground/50 text-foreground text-base leading-relaxed"
        />

        <div className="flex justify-end pt-2 border-t border-border/40">
          <Button size="sm" onClick={handleSave}>
            Save Entry
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddictionCalendar;

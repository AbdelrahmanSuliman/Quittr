import { useState } from "react";
import { DatePicker } from "./DatePicker";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useCreateJournalEntry from "@/hooks/journal/useCreateJournalEntry";
import useGetJournalEntryByDate from "@/hooks/journal/useGetJournalEntryByDate";
import useUpdateJournalEntryById from "@/hooks/journal/useUpdateJournalEntryById";

interface AddictionCalendarProps {
  addictionId: string;
}

interface JournalEditorProps {
  addictionId: string;
  selectedDate: string;
  date: Date;
  journalEntry:
    | {
        id: string;
        content?: string | null;
        succeeded?: boolean | null;
      }
    | null
    | undefined;
}

function JournalEditor({
  addictionId,
  selectedDate,
  date,
  journalEntry,
}: JournalEditorProps) {
  const [content, setContent] = useState(journalEntry?.content ?? "");
  const [succeeded, setSucceeded] = useState(journalEntry?.succeeded ?? true);

  const createEntryMutation = useCreateJournalEntry();
  const updateEntryMutation = useUpdateJournalEntryById();

  const handleSave = () => {
    if (!journalEntry) {
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
        },
      );
    } else {
      updateEntryMutation.mutate(
        {
          addictionId,
          entryId: journalEntry.id,
          targetDate: selectedDate,
          content,
          succeeded,
        },
        {
          onSuccess: () => {
            toast("Entry Updated Successfully");
          },
          onError: (e) => {
            console.error(e.message);
            console.log("Addiction ID: ", addictionId);
            toast(e.message);
          },
        },
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between lg:flex-row flex-col gap-4">
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
            {journalEntry ? "Update Entry" : "Save Entry"}
          </Button>
        </div>
      </div>
    </>
  );
}

function AddictionCalendar({ addictionId }: AddictionCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDate = date ? date.toISOString().split("T")[0] : "";

  const { data: journalEntry } = useGetJournalEntryByDate(
    addictionId,
    selectedDate,
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <div className="flex items-center justify-between lg:flex-row flex-col gap-4">
        <DatePicker date={date} setDate={setDate} />
      </div>

      {date ? (
        <JournalEditor
          key={`${selectedDate}-${journalEntry?.id ?? "new"}`}
          addictionId={addictionId}
          selectedDate={selectedDate}
          date={date}
          journalEntry={journalEntry}
        />
      ) : (
        <Button size="sm" disabled>
          Select a date first
        </Button>
      )}
    </div>
  );
}

export default AddictionCalendar;

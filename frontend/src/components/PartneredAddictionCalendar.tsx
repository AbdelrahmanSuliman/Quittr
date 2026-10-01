import { useState } from "react";

import { DatePicker } from "./DatePicker";
import useGetPartneredJournalEntryByDate from "@/hooks/journal/useGetPartneredJournalEntryByDate";

interface PartneredAddictionCalendarProps {
  addictionId: string;
}

function PartneredAddictionCalendar({
  addictionId,
}: PartneredAddictionCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const selectedDate = date ? date.toISOString().split("T")[0] : "";

  console.log("Partnered addiction ID:", addictionId);
  console.log("Selected date:", selectedDate);
  const {
    data: journalEntry,
    isLoading,
    isError,
  } = useGetPartneredJournalEntryByDate(addictionId, selectedDate);

  console.log(journalEntry)

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      <DatePicker date={date} setDate={setDate} />

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading entry...</p>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Failed to fetch journal entry.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-4">
          {journalEntry ? (
            <>
              <div>
                <p
                  className={
                    journalEntry.succeeded ? "text-green-600" : "text-red-600"
                  }
                >
                  {journalEntry.succeeded
                    ? "Day Succeeded ✓"
                    : "Relapsed / Struggled ✕"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Journal Entry</p>

                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {journalEntry.content || "No journal entry for this day."}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No entry for this day.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default PartneredAddictionCalendar;

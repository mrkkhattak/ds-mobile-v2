import { SecondryHeading } from "@/components/ui/Heading";
import React, { useEffect, useState } from "react";

const DateLabel = ({ selectedDate }: { selectedDate: string | Date }) => {
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    if (!selectedDate) return;

    const selected = new Date(selectedDate);
    const today = new Date();

    // Reset times to midnight for comparison
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - selected.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      setLabel("Today");
    } else if (diffDays === 1) {
      setLabel("Yesterday");
    } else {
      // Display full date nicely
      setLabel(selected.toDateString()); // e.g., "Tue Nov 11 2025"
      // Or custom format:
      // setLabel(selected.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }));
    }
  }, [selectedDate]);

  return (
    <SecondryHeading style={{ marginLeft: 40, textAlign: "left" }}>
      {label}
    </SecondryHeading>
  );
};

export default DateLabel;

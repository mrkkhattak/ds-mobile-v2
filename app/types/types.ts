export type WeekRepeat = {
  day: string[];
  weekNumber: string;
};

type MonthRepeat = {
  dayNumber: number | undefined;
  day: string;
  month: string;
};

export type CreateTaskFormValues = {
  name: string;
  room: string;
  type: string;
  repeat: boolean;
  effort: string;
  repeatEvery?: "DAY" | "WEEK" | "MONTH";
  days?: string[]; // e.g. ["M","T"]
  week?: WeekRepeat | null;
  month?: MonthRepeat | null;
};

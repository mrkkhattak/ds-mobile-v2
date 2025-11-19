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
  id?: string | undefined;
  name: string;
  room: string;
  type: string;
  repeat: boolean;
  effort: string;
  repeatEvery?: "DAY" | "WEEK" | "MONTH" | string | undefined;
  days?: string[]; // e.g. ["M","T"]
  week?: WeekRepeat | null;
  month?: MonthRepeat | null;
};

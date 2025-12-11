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
  effort: number;
  repeatEvery?: "DAY" | "WEEK" | "MONTH" | string | undefined;
  days?: string[]; // e.g. ["M","T"]
  week?: WeekRepeat | null;
  month?: MonthRepeat | null;
  assign?: string;
};

export type TablisntType = {
  label: string;
  selectedIcon: React.JSX.Element;
  unselectedIcon: React.JSX.Element;
};

export type UpdateProfileFormValues = {
  firstName: string;
  lastName: string;
  gender: string;
};

export type Member = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  gender: "male" | "female" | "other";
  family_role: "father" | "mother" | "child" | "admin" | "guest";
  household_id: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  household_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  created_at: string;
  updated_at: string;
};

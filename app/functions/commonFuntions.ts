const dayMapping: Record<string, number> = {
  M: 1,
  TU: 2,
  W: 3,
  TH: 4,
  F: 5,
  S: 6,
  SU: 0,
};

const weekDayMapping: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export const getNthWeekdayOfMonth = (
  year: number,
  month: number,
  weekday: number,
  nth: number
): Date | null => {
  const firstDay = new Date(year, month, 1);
  let day = 1 + ((7 + weekday - firstDay.getDay()) % 7); // first weekday in month
  day += (nth - 1) * 7;
  const result = new Date(year, month, day);
  return result.getMonth() === month ? result : null;
};

export const getSelectedDays = (days: string[]) => {
  return days.map((day) => dayMapping[day]);
};

export const generateRepeatingDates = (selectedDays: number[]) => {
  const dates: string[] = [];
  const start = new Date();
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1);

  let current = new Date(start);

  while (current <= end) {
    if (selectedDays.includes(current.getDay())) {
      dates.push(current.toISOString().split("T")[0]); // store YYYY-MM-DD
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const generateRepeatingDatesUnified = (
  repeatEvery: "DAY" | "WEEK" | "MONTH",
  options: {
    days?: string[]; // DAY repeat ["M","W","F"]
    weekDays?: string[]; // WEEK repeat ["monday"]
    weekInterval?: number; // WEEK repeat, e.g., 4
    monthInterval?: number; // MONTH repeat, e.g., 6
    monthWeekday?: string; // MONTH repeat weekday, e.g., "monday"
    monthWeekNumber?: number; // MONTH repeat N-th weekday, e.g., 1
    startDate?: Date;
    endDate?: Date;
  } = {}
): string[] => {
  const start = options.startDate || new Date();
  const end =
    options.endDate ||
    new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  const dates: string[] = [];
  let current = new Date(start);

  // DAY repeat
  if (repeatEvery === "DAY" && options.days?.length) {
    const dayMapping: Record<string, number> = {
      SU: 0,
      S: 6,
      M: 1,
      TU: 2,
      W: 3,
      TH: 4,
      F: 5,
    };
    const selectedDays = options.days.map((d) => dayMapping[d]);
    while (current <= end) {
      if (selectedDays.includes(current.getDay()))
        dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  }

  // WEEK repeat
  else if (
    repeatEvery === "WEEK" &&
    options.weekDays?.length &&
    options.weekInterval
  ) {
    const weekDayMapping: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    const selectedDays = options.weekDays.map(
      (d) => weekDayMapping[d.toLowerCase()]
    );
    while (current <= end) {
      if (selectedDays.includes(current.getDay())) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 7 * options.weekInterval);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }
  }

  // MONTH repeat (Nth weekday every X months)
  else if (
    repeatEvery === "MONTH" &&
    options.monthInterval &&
    options.monthWeekday &&
    options.monthWeekNumber
  ) {
    const weekDayMapping: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    let year = current.getFullYear();
    let month = current.getMonth();

    while (current <= end) {
      const date = getNthWeekdayOfMonth(
        year,
        month,
        weekDayMapping[options.monthWeekday.toLowerCase()],
        options.monthWeekNumber
      );
      if (date && date >= start && date <= end)
        dates.push(date.toISOString().split("T")[0]);
      month += options.monthInterval;
      year += Math.floor(month / 12);
      month = month % 12;
      current = new Date(year, month, 1);
    }
  }

  return dates;
};

export const generateMonthlyRepeatingDates = (
  monthInterval: number,
  monthWeekday: string,
  monthWeekNumber: number,
  startDate: Date = new Date(),
  endDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
): string[] => {
  const weekDayMapping: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const dates: string[] = [];
  let year = startDate.getFullYear();
  let month = startDate.getMonth(); // 0-indexed

  while (true) {
    const date = getNthWeekdayOfMonth(
      year,
      month,
      weekDayMapping[monthWeekday.toLowerCase()],
      monthWeekNumber
    );
    if (!date) break; // shouldn't happen but safety
    if (date > endDate) break;
    if (date >= startDate) dates.push(date.toISOString().split("T")[0]);

    // Move to next interval
    month += monthInterval;
    year += Math.floor(month / 12);
    month = month % 12;
  }

  return dates;
};

// Helper function

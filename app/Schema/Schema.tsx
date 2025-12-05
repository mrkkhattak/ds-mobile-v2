import * as yup from "yup";
export const schema = yup.object({
  name: yup.string().required("Name is required"),
  room: yup.string().required("Room is required"),
  type: yup.string().oneOf(["BOTH", "ADULT", "CHILD"]).required(),
  effort: yup.string().required("Effort is required"),
  repeat: yup.boolean().required(),
  repeatEvery: yup.string().oneOf(["DAY", "WEEK", "MONTH"]).required(),
  assign: yup.string(),
  // DAY mode
  days: yup
    .array()
    .of(yup.string())
    .when(["repeat", "repeatEvery"], {
      is: (repeat: boolean, repeatEvery: string) =>
        repeat && repeatEvery === "DAY",
      then: (schema) =>
        schema.min(1, "Select at least one day").required("Select days"),
      otherwise: (schema) => schema.notRequired().strip(),
    }),

  // WEEK mode
  week: yup
    .object({
      day: yup
        .array()
        .of(yup.string())
        .min(1, "Select at least one day") // <-- require at least one day
        .required("Select days"), // <-- ensure the field exists
      weekNumber: yup.string().required("Select week number"),
    })
    .when(["repeat", "repeatEvery"], {
      is: (repeat: boolean, repeatEvery: string) =>
        repeat && repeatEvery === "WEEK",
      then: (schema) => schema.required("Week selection required"),
      otherwise: (schema) => schema.notRequired().strip(),
    }),
  month: yup
    .object({
      dayNumber: yup.string().required("Select day number").nullable(false),
      day: yup.string().required("Select day").nullable(false),
      month: yup.string().required("Select month").nullable(false),
    })
    .when(["repeat", "repeatEvery"], {
      is: (repeat: boolean, repeatEvery: string) =>
        repeat && repeatEvery === "MONTH",
      then: (schema) => schema.required("Month selection required"),
      otherwise: (schema) => schema.notRequired().strip(),
    }),
});

export const ProfileSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[A-Za-z]+$/, "First name can only contain letters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[A-Za-z]+$/, "Last name can only contain letters"),
  // gender: yup.string().required("Please select a gender"),
});

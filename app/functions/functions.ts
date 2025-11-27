import { supabase } from "@/lib/supabase";
import { CreateTaskFormValues } from "../types/types";
export interface GlobalTask {
  id: string;
  name: string;
  description_us: string;
  description_uk: string;
  description_row: string;
  icon_name: string | null;
  child_friendly: boolean;
  estimated_effort: number;
  points: number;
  room: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface TaskWithAssignment {
  assignment_id: string | null;
  task_id: string;
  task_name: string;
  task_description_us: string;
  task_description_uk: string;
  task_description_row: string;
  icon_name: string | null;
  child_friendly: boolean;
  estimated_effort: number;
  points: number;
  room: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  assign_user_id: string | null;
  assign_user_email: string | null;
  owner_user_id: string | null;
}

export interface SpruceTask {
  id: string;
  assign_user_id: string;
  global_task_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  global_task: GlobalTask | null;
  assigned_user: {
    email: string;
    id: string;
  } | null;
}

export interface SpruceTaskDetails {
  // Assignment info
  id: string;
  assigned_at: string | null;
  updated_at: string | null;
  assign_user_id: string | null;
  assign_user_email: string | null;
  owner_user_id: string | null;
  owner_user_email: string | null;

  // Global task fields
  task_id: string | null;
  task_name: string | null;
  description_us: string | null;
  description_uk: string | null;
  description_row: string | null;
  icon_name: string | null;
  child_friendly: boolean | null;
  estimated_effort: number | null;
  points: number | null;
  room: string | null;
  category: string | null;
  keywords: string[] | null;
  display_names: Record<string, any> | null;
  unique_completions: number | null;
  total_completions: number | null;
  effort_level: number | null;

  // User task fields
  user_task_id?: string;
  user_task_user_id?: string;
  user_task_name?: string;
  user_task_room?: string | null;
  user_task_type?: string | null;
  user_task_effort?: number | null;
  user_task_repeat?: boolean;
  user_task_repeat_every?: string | null;
  user_task_created_at?: string | null;
  user_task_updated_at?: string | null;
}

type CreateTaskResult = {
  data?: any;
  error?: string;
};

export type UserTask = {
  id: string;
  user_id: string;
  name: string;
  room: string | null;
  type: string;
  effort: number;
  repeat: boolean;
  repeat_every: string;
  created_at: string | null;
  updated_at: string | null;
};

export type TaskRepeatDay = {
  day: string;
};

export type TaskRepeatWeek = {
  week_number: number;
  day: string;
};

export type TaskRepeatMonth = {
  day_number: number;
  day: string;
  month_number: number;
};

export type FullTask = UserTask & {
  repeat_days: string[];
  repeat_weekly: TaskRepeatWeek[];
  repeat_monthly: TaskRepeatMonth[];
};
export type TaskResult = {
  data: FullTask | null;
  error: string | null;
};
export async function getGlobalTasks(): Promise<GlobalTask[]> {
  const { data, error } = await supabase
    .from("global_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching global tasks:", error.message);
    throw error;
  }

  return data || [];
}

export type Profile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  created_at: string;
  updated_at: string;
};

// export const fetchAndGroupTasks = async () => {
//   const { data, error } = await supabase
//     .from("global_tasks")
//     .select(
//       `
//       *,
//       task_repeat_days(*),
//       task_repeat_weeks(*),
//       task_repeat_months(*)
//     `
//     )
//     .order("category", { ascending: true });

//   if (error) {
//     console.error("Error fetching tasks:", error);
//     return {};
//   }

//   // Group tasks by category
//   const groupedTasks: Record<string, any[]> = {};

//   data.forEach((task) => {
//     const category = task.category || "Uncategorized";
//     if (!groupedTasks[category]) {
//       groupedTasks[category] = [];
//     }
//     groupedTasks[category].push(task);
//   });

//   console.log("groupedTasks", groupedTasks);
//   return groupedTasks;
// };

export const fetchAndGroupTasks = async (taskType?: string) => {
  let query = supabase
    .from("global_tasks")
    .select(
      `
      *,
      task_repeat_days(*),
      task_repeat_weeks(*),
      task_repeat_months(*)
    `
    )
    .order("category", { ascending: true });

  // Only filter by type if provided
  if (taskType) {
    query = query.eq("type", taskType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    return {};
  }

  // Group by category
  const groupedTasks: Record<string, any[]> = {};

  data.forEach((task) => {
    const category = task.category || "Uncategorized";
    if (!groupedTasks[category]) {
      groupedTasks[category] = [];
    }
    groupedTasks[category].push(task);
  });

  return groupedTasks;
};

export const fetchSpruceTasks = async (
  userId: string,
  scheduledDate?: string
): Promise<{ data?: SpruceTaskDetails[]; error?: string }> => {
  try {
    if (!userId) return { error: "Missing userId" };

    let query = supabase
      .from("spruce_tasks")
      .select(
        `
        id,
        assign_user_id,
        user_id,
        user_task_id,
        scheduled_date,
        created_at,
        updated_at,
        user_task:user_task_id (
          id,
          name,
          room,
          type,
          effort,
          repeat,
          repeat_every,
          user_id,
          created_at,
          updated_at
        ),
        global_task:global_task_id (
          id,
          name,
          description_us,
          description_uk,
          description_row,
          icon_name,
          child_friendly,
          estimated_effort,
          points,
          room,
          category,
          keywords,
          display_names,
          unique_completions,
          total_completions,
          effort_level
        )
      `
      )
      .eq("user_id", userId);

    // Apply date filter if provided
    if (scheduledDate) {
      query = query.eq("scheduled_date", scheduledDate);
    }

    const { data: spruceData, error } = await query.order("scheduled_date", {
      ascending: true,
    });

    if (error) {
      console.error("Error fetching spruce tasks:", error.message);
      return { error: error.message };
    }

    if (!spruceData) return { data: [] };

    const result: SpruceTaskDetails[] = spruceData.map((item: any) => ({
      id: item.id,
      assigned_at: item.created_at,
      updated_at: item.updated_at,
      assign_user_id: item.assign_user_id,
      scheduled_date: item.scheduled_date,
      assign_user_email: null,
      owner_user_id: item.user_id,
      owner_user_email: null,

      // Global task
      task_id: item.global_task?.id ?? null,
      task_name: item.global_task?.name ?? null,
      description_us: item.global_task?.description_us ?? null,
      description_uk: item.global_task?.description_uk ?? null,
      description_row: item.global_task?.description_row ?? null,
      icon_name: item.global_task?.icon_name ?? null,
      child_friendly: item.global_task?.child_friendly ?? null,
      estimated_effort: item.global_task?.estimated_effort ?? null,
      points: item.global_task?.points ?? null,
      room: item.global_task?.room ?? null,
      category: item.global_task?.category ?? null,
      keywords: item.global_task?.keywords ?? null,
      display_names: item.global_task?.display_names ?? null,
      unique_completions: item.global_task?.unique_completions ?? null,
      total_completions: item.global_task?.total_completions ?? null,
      effort_level: item.global_task?.effort_level ?? null,

      // User task
      user_task_id: item.user_task?.id,
      user_task_user_id: item.user_task?.user_id,
      user_task_name: item.user_task?.name,
      user_task_room: item.user_task?.room ?? null,
      user_task_type: item.user_task?.type ?? null,
      user_task_effort: item.user_task?.effort ?? null,
      user_task_repeat: item.user_task?.repeat ?? false,
      user_task_repeat_every: item.user_task?.repeat_every ?? null,
      user_task_created_at: item.user_task?.created_at ?? null,
      user_task_updated_at: item.user_task?.updated_at ?? null,
    }));

    return { data: result };
  } catch (err: any) {
    console.error("Unexpected error fetching spruce tasks:", err);
    return { error: err.message || "Unknown error occurred" };
  }
};

export const AddTaskToSpruce = async (
  global_task_id: string,
  user_id: string,
  scheduledDate: string,
  household_id: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from("spruce_tasks").insert([
      {
        global_task_id,
        user_id,
        scheduled_date: scheduledDate,
        household_id: household_id,
      },
    ]);

    if (error) {
      console.error("Error assigning task:", error.message);
      return false;
    }

    console.log("Task assigned successfully:", data);
    return true;
  } catch (err) {
    console.error("Unexpected error assigning task:", err);
    return false;
  }
};

export const removeSpecificTaskFromSpruce = async ({
  globalTaskId,
  userTaskId,
  userId,
}: {
  globalTaskId?: string;
  userTaskId?: string;
  userId: string;
}): Promise<boolean> => {
  try {
    if (!globalTaskId && !userTaskId) {
      console.error("Either globalTaskId or userTaskId must be provided.");
      return false;
    }

    let query = supabase.from("spruce_tasks").delete().eq("user_id", userId);

    if (globalTaskId) query = query.eq("global_task_id", globalTaskId);
    if (userTaskId) query = query.eq("user_task_id", userTaskId);

    const { error } = await query;

    if (error) {
      console.error("Error removing task:", error.message);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("Unexpected error removing task:", err.message || err);
    return false;
  }
};

export const removeTaskFromSpruce = async ({
  id,
}: {
  id?: string;
}): Promise<boolean> => {
  try {
    if (!id) {
      console.error("Please provide the task ID to delete.");
      return false;
    }

    const { error } = await supabase.from("spruce_tasks").delete().eq("id", id);
    // extra safety so users can't delete others' tasks

    if (error) {
      console.error("Error removing task:", error.message);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("Unexpected error removing task:", err.message || err);
    return false;
  }
};

export const createTask = async (
  data: CreateTaskFormValues
): Promise<CreateTaskResult> => {
  try {
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse.data.user?.id;

    if (!userId) {
      return { error: "User not authenticated" };
    }

    // Insert main task
    const { data: task, error: taskError } = await supabase
      .from("user_task")
      .insert([
        {
          user_id: userId,
          name: data.name,
          room: data.room,
          type: data.type,
          effort: parseInt(data.effort, 10),
          repeat: data.repeat,
          repeat_every: data.repeatEvery,
        },
      ])
      .select()
      .single();

    if (taskError || !task) {
      return { error: taskError?.message || "Failed to create task" };
    }

    const taskId = task.id;

    // DAY mode
    if (data.repeat && data.repeatEvery === "DAY" && data.days?.length) {
      const dayInserts = data.days.map((day) => ({
        task_id: taskId,
        day,
      }));
      const { error } = await supabase
        .from("task_repeat_days")
        .insert(dayInserts);
      if (error) return { error: error.message };
    }

    // WEEK mode
    if (data.repeat && data.repeatEvery === "WEEK" && data.week) {
      const weekInserts = data.week.day.map((day) => ({
        task_id: taskId,
        week_number: parseInt(data.week!.weekNumber, 10),
        day,
      }));
      const { error } = await supabase
        .from("task_repeat_weeks")
        .insert(weekInserts);
      if (error) return { error: error.message };
    }

    // MONTH mode
    if (data.repeat && data.repeatEvery === "MONTH" && data.month) {
      const dayNumber = data.month.dayNumber ?? 1; // default to 1 if undefined
      const monthNumber = parseInt(data.month.month, 10);

      const { error } = await supabase.from("task_repeat_months").insert({
        task_id: taskId,
        day_number: dayNumber,
        day: data.month.day,
        month_number: monthNumber,
      });

      if (error) return { error: error.message };
    }

    return { data: task };
  } catch (err: any) {
    console.error("Error creating task:", err);
    return { error: err.message || "Unknown error occurred" };
  }
};

export const AddUserTaskToSpruce = async (
  userTaskId: string,
  userId: string,
  scheduledDate: string,
  household_id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.from("spruce_tasks").insert([
      {
        user_task_id: userTaskId,
        user_id: userId,
        scheduled_date: scheduledDate,
        household_id: household_id, // ⬅️ new field
      },
    ]);

    if (error) {
      console.error("Error adding user task to spruce:", error.message);
      return { success: false, error: error.message };
    }

    console.log("User task added to spruce successfully:", data);
    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error adding user task to spruce:", err.message);
    return { success: false, error: err.message || "Unknown error" };
  }
};

export async function getTaskById(taskId: string): Promise<TaskResult> {
  if (!taskId) {
    return { data: null, error: "Task ID is required" };
  }

  try {
    // Fetch main task
    const { data: task, error: taskError } = await supabase
      .from("user_task")
      .select("*")
      .eq("id", taskId)
      .single();

    if (taskError) return { data: null, error: taskError.message };
    if (!task) return { data: null, error: "Task not found" };

    // Fetch related records
    const [repeatDaysResult, repeatWeeksResult, repeatMonthsResult] =
      await Promise.all([
        supabase.from("task_repeat_days").select("day").eq("task_id", taskId),
        supabase
          .from("task_repeat_weeks")
          .select("week_number, day")
          .eq("task_id", taskId),
        supabase
          .from("task_repeat_months")
          .select("day_number, day, month_number")
          .eq("task_id", taskId),
      ]);

    // Cast results safely
    const repeatDays = repeatDaysResult.data as TaskRepeatDay[] | null;
    const repeatWeeks = repeatWeeksResult.data as TaskRepeatWeek[] | null;
    const repeatMonths = repeatMonthsResult.data as TaskRepeatMonth[] | null;

    // Optional: check errors
    if (
      repeatDaysResult.error ||
      repeatWeeksResult.error ||
      repeatMonthsResult.error
    ) {
      return {
        data: null,
        error:
          repeatDaysResult.error?.message ??
          repeatWeeksResult.error?.message ??
          repeatMonthsResult.error?.message ??
          "Something went wrong",
      };
    }

    const fullTask: FullTask = {
      ...task,
      repeat_days: repeatDays?.map((d) => d.day) || [],
      repeat_weekly: repeatWeeks || [],
      repeat_monthly: repeatMonths || [],
    };

    return { data: fullTask, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Something went wrong" };
  }
}

export const deleteTaskById = async (
  taskId: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Delete task
    const { error: taskError } = await supabase
      .from("user_task")
      .delete()
      .eq("id", taskId);

    if (taskError) {
      return { success: false, error: taskError.message };
    }

    // Optional: delete related entries in repeat tables
    const { error: daysError } = await supabase
      .from("task_repeat_days")
      .delete()
      .eq("task_id", taskId);

    const { error: weeksError } = await supabase
      .from("task_repeat_weeks")
      .delete()
      .eq("task_id", taskId);

    const { error: monthsError } = await supabase
      .from("task_repeat_months")
      .delete()
      .eq("task_id", taskId);

    const allErrors =
      daysError?.message || weeksError?.message || monthsError?.message;

    return { success: !allErrors, error: allErrors ?? null };
  } catch (err: any) {
    return { success: false, error: err.message || "Something went wrong" };
  }
};

export const deleteSpruceTasksByUserTaskId = async (
  taskId: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase
      .from("spruce_tasks")
      .delete()
      .eq("user_task_id", taskId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message ?? "Something went wrong" };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return { data, error }; // return both for snackbar handling
  } catch (err: any) {
    return { data: null, error: { message: err.message } };
  }
};

export const createUserProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  gender: string,
  household_id?: string,
  familyRole?: string
): Promise<{ data: Profile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        gender,
        household_id: household_id,
        family_role: familyRole,
      })
      .select()
      .maybeSingle();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: { message: err.message } };
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    gender?: string;
    household_id?: string;
    [key: string]: any; // allows future fields
  }
): Promise<{ data: Profile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        gender: updates.gender,
        household_id: updates.household_id,
        ...updates, // spread any other fields if needed
      })
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    return { data, error };
  } catch (err: any) {
    return { data: null, error: { message: err.message } };
  }
};

export const getProfilesByHousehold = async (householdId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("household_id", householdId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message ?? "Unexpected error occurred" };
  }
};

export const fetchSpruceTasksByHouseHoldId = async (
  household_id: string,
  scheduledDate?: string
): Promise<{ data?: SpruceTaskDetails[]; error?: string }> => {
  try {
    if (!household_id) return { error: "Missing houseHold Id" };

    let query = supabase
      .from("spruce_tasks")
      .select(
        `
        id,
        assign_user_id,
        user_id,
        user_task_id,
        scheduled_date,
        created_at,
        updated_at,
        user_task:user_task_id (
          id,
          name,
          room,
          type,
          effort,
          repeat,
          repeat_every,
          user_id,
          created_at,
          updated_at
        ),
        global_task:global_task_id (
          id,
          name,
          description_us,
          description_uk,
          description_row,
          icon_name,
          child_friendly,
          estimated_effort,
          points,
          room,
          category,
          keywords,
          display_names,
          unique_completions,
          total_completions,
          effort_level
        )
      `
      )
      .eq("household_id", household_id);

    // Apply date filter if provided
    if (scheduledDate) {
      query = query.eq("scheduled_date", scheduledDate);
    }

    const { data: spruceData, error } = await query.order("scheduled_date", {
      ascending: true,
    });

    if (error) {
      console.error("Error fetching spruce tasks:", error.message);
      return { error: error.message };
    }

    if (!spruceData) return { data: [] };

    const result: SpruceTaskDetails[] = spruceData.map((item: any) => ({
      id: item.id,
      assigned_at: item.created_at,
      updated_at: item.updated_at,
      assign_user_id: item.assign_user_id,
      scheduled_date: item.scheduled_date,
      assign_user_email: null,
      owner_user_id: item.user_id,
      owner_user_email: null,

      // Global task
      task_id: item.global_task?.id ?? null,
      task_name: item.global_task?.name ?? null,
      description_us: item.global_task?.description_us ?? null,
      description_uk: item.global_task?.description_uk ?? null,
      description_row: item.global_task?.description_row ?? null,
      icon_name: item.global_task?.icon_name ?? null,
      child_friendly: item.global_task?.child_friendly ?? null,
      estimated_effort: item.global_task?.estimated_effort ?? null,
      points: item.global_task?.points ?? null,
      room: item.global_task?.room ?? null,
      category: item.global_task?.category ?? null,
      keywords: item.global_task?.keywords ?? null,
      display_names: item.global_task?.display_names ?? null,
      unique_completions: item.global_task?.unique_completions ?? null,
      total_completions: item.global_task?.total_completions ?? null,
      effort_level: item.global_task?.effort_level ?? null,

      // User task
      user_task_id: item.user_task?.id,
      user_task_user_id: item.user_task?.user_id,
      user_task_name: item.user_task?.name,
      user_task_room: item.user_task?.room ?? null,
      user_task_type: item.user_task?.type ?? null,
      user_task_effort: item.user_task?.effort ?? null,
      user_task_repeat: item.user_task?.repeat ?? false,
      user_task_repeat_every: item.user_task?.repeat_every ?? null,
      user_task_created_at: item.user_task?.created_at ?? null,
      user_task_updated_at: item.user_task?.updated_at ?? null,
    }));

    return { data: result };
  } catch (err: any) {
    console.error("Unexpected error fetching spruce tasks:", err);
    return { error: err.message || "Unknown error occurred" };
  }
};

export const removeTasksByGlobalId = async (
  globalTaskId: string
): Promise<boolean> => {
  try {
    if (!globalTaskId) {
      console.error("globalTaskId must be provided.");
      return false;
    }

    console.log(globalTaskId, "globalTaskId");
    const { error } = await supabase
      .from("spruce_tasks")
      .delete()
      .eq("global_task_id", globalTaskId);

    if (error) {
      console.error("Error removing tasks:", error.message);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("Unexpected error removing tasks:", err.message || err);
    return false;
  }
};

export const removeUserTasksById = async (
  userTaskId: string
): Promise<boolean> => {
  try {
    if (!userTaskId) {
      console.error("userTaskId must be provided.");
      return false;
    }

    console.log(userTaskId, "userTaskId");
    const { error } = await supabase
      .from("spruce_tasks")
      .delete()
      .eq("user_task_id", userTaskId);

    if (error) {
      console.error("Error removing tasks:", error.message);
      return false;
    }

    return true;
  } catch (err: any) {
    console.error("Unexpected error removing tasks:", err.message || err);
    return false;
  }
};

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

export type UserProfile = {
  user_id: string;
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  family_role?: string | null;
  household_id?: string | null;
  email?: string | null;
};

export type SpruceTaskDetails = {
  id: string;
  assigned_at: string | null;
  updated_at: string | null;
  assign_user_id: string | null;
  scheduled_date: string | null;
  assign_user_email: string | null;
  assign_user_profile: UserProfile | null;
  owner_user_id: string | null;
  owner_user_email: string | null;

  // Global task
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
  keywords: string | null;
  display_names: string | null;
  unique_completions: number | null;
  total_completions: number | null;
  effort_level: string | null;

  // User task
  user_task_id: string | null;
  user_task_user_id: string | null;
  user_task_name: string | null;
  user_task_room: string | null;
  user_task_type: string | null;
  user_task_effort: number | null;
  user_task_repeat: boolean;
  user_task_repeat_every: string | null;
  user_task_created_at: string | null;
  user_task_updated_at: string | null;
  user_task_repeat_type: string | null;
  user_task_category: string | null;
  task_status: string | null;
};

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

export interface GlobalPackTask {
  id: string;
  name?: string | null;
  description_us: string;
  description_uk: string;
  description_row: string;
  type?: string | null;
  icon_name?: string | null;
  icon?: string | null;
  room?: string | null;
  category?: string | null;
  effort_level?: number | null;
  estimated_effort?: number | null;
  estimated_time?: number | null;
  points?: number | null;
  child_friendly?: boolean | null;
  child_appropriate?: boolean | null;
  is_active?: boolean | null;
  keywords?: string[] | null;
  display_names?: Record<string, string> | null;
  display_names_us?: string | null;
  display_names_uk?: string | null;
  display_names_row?: string | null;
  unique_completions?: number | null;
  total_completions?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_date?: string | null;
  last_modified?: string | null;
}

export interface PreMadePack {
  id: string;
  name_us: string;
  name_uk: string;
  name_row: string;
  created_at: string;
  updated_at: string;
  description?: string | null;
  category?: string | null;
  region?: string | null;
  status?: string | null;
  taskids?: string; // JSON array of global_task ids
  taskorder?: string; // JSON array for ordering tasks
  selection_count?: number;
  tasks?: GlobalPackTask[]; // populated tasks
}

export interface Household {
  id: string;
  name: string;
  owner_profile_id: string;
  created_at: string;
  updated_at: string;
  spruce_time?: string;
}

export interface HouseholdUpdatePayload {
  name?: string;
  spruce_time?: string;
  owner_profile_id?: string;
  // add any other updatable fields here
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

export async function getGlobalTasks(householdId: string): Promise<any[]> {
  // Fetch global tasks
  const { data: globalTasks, error: globalError } = await supabase
    .from("global_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (globalError) {
    console.error("Error fetching global tasks:", globalError.message);
    throw globalError;
  }

  // Fetch user tasks filtered by household
  const { data: userTasks, error: userError } = await supabase
    .from("user_task")
    .select("*")
    .eq("household_id", householdId)
    .order("created_at", { ascending: false });

  if (userError) {
    console.error("Error fetching user tasks:", userError.message);
    throw userError;
  }

  // Merge both results
  const combined = [...(globalTasks || []), ...(userTasks || [])];

  return combined;
}

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

// export const fetchAndGroupTasks = async (taskType?: string) => {
//   let query = supabase
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

//   // Only filter by type if provided
//   if (taskType) {
//     query = query.eq("type", taskType);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching tasks:", error);
//     return {};
//   }

//   // Group by category
//   const groupedTasks: Record<string, any[]> = {};
//   data.forEach((task) => {
//     const category = task.category || "Uncategorized";
//     if (!groupedTasks[category]) {
//       groupedTasks[category] = [];
//     }
//     groupedTasks[category].push(task);
//   });

//   return groupedTasks;
// };
export interface FilterOptions {
  effort?: number[]; // e.g., [1, 2] to show Low & Medium
  search?: string;
  type?: string;
}

export interface SortOptions {
  days?: "old-new" | "new-old";
  effort?: "low-high" | "high-low";
  name?: "a-z" | "z-a";
}

export const fetchAndGlobalGroupTasks = async (
  taskType?: string,
  sortOptions?: SortOptions,
  filterOptions?: FilterOptions
) => {
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

  if (taskType) {
    query = query.eq("type", taskType);
  }

  // Apply effort filter if provided
  // console.log("---s", filterOptions?.effort?.length);
  if (filterOptions?.effort?.length) {
    query = query.in("effort_level", filterOptions.effort);
  }

  if (filterOptions?.search && filterOptions.search.trim() !== "") {
    query = query.ilike("name", `%${filterOptions.search}%`);
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
    if (!groupedTasks[category]) groupedTasks[category] = [];
    groupedTasks[category].push(task);
  });

  // Apply sorting within each category
  Object.keys(groupedTasks).forEach((category) => {
    groupedTasks[category].sort((a, b) => {
      // Days sorting
      if (sortOptions?.days) {
        const diff =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortOptions.days === "old-new") return diff;
        if (sortOptions.days === "new-old") return -diff;
      }

      // Effort sorting
      if (sortOptions?.effort) {
        const diff = (a.effort_level ?? 0) - (b.effort_level ?? 0);
        if (sortOptions.effort === "low-high") return diff;
        if (sortOptions.effort === "high-low") return -diff;
      }

      // Name sorting
      if (sortOptions?.name) {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOptions.name === "a-z") return nameA.localeCompare(nameB);
        if (sortOptions.name === "z-a") return nameB.localeCompare(nameA);
      }

      return 0;
    });
  });

  return groupedTasks;
};
export const fetchAndGroupGlobalSearchTasks = async (search: string) => {
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

  // Apply effort filter if provided
  // console.log("---s", filterOptions?.effort?.length);

  if (search.trim() !== "") {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    return {};
  }

  // Group by category
  const groupedTasks: Record<string, any[]> = {};
  // data.forEach((task) => {
  //   const category = task.category || "Uncategorized";
  //   if (!groupedTasks[category]) groupedTasks[category] = [];
  //   groupedTasks[category].push(task);
  // });

  return data;
};
export const fetchAndGroupTasks = async (
  taskType?: string,
  sortOptions?: SortOptions,
  filterOptions?: FilterOptions,
  householdId?: string
) => {
  let query = supabase
    .from("user_task")
    .select(
      `
        *,
        task_repeat_days(*),
        task_repeat_weeks(*),
        task_repeat_months(*)
      `
    )
    .order("category", { ascending: true });

  if (householdId) {
    query = query.eq("household_id", householdId);
  }
  if (taskType) {
    query = query.eq("repeat_type", taskType);
  }

  if (filterOptions?.type) {
    query = query.eq("type", filterOptions.type);
  }

  if (filterOptions?.effort?.length) {
    query = query.in("effort", filterOptions.effort);
  }

  if (filterOptions?.search && filterOptions.search.trim() !== "") {
    query = query.ilike("name", `%${filterOptions.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    return {};
  }

  // Group by category
  const groupedTasks: Record<string, any[]> = {};
  data.forEach((task) => {
    const category = task.category || task.room || "Uncategorized";
    if (!groupedTasks[category]) groupedTasks[category] = [];
    groupedTasks[category].push(task);
  });

  // Apply sorting within each category
  Object.keys(groupedTasks).forEach((category) => {
    groupedTasks[category].sort((a, b) => {
      // Days sorting
      if (sortOptions?.days) {
        const diff =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortOptions.days === "old-new") return diff;
        if (sortOptions.days === "new-old") return -diff;
      }

      // Effort sorting
      if (sortOptions?.effort) {
        const diff = (a.effort ?? 0) - (b.effort ?? 0);
        if (sortOptions.effort === "low-high") return diff;
        if (sortOptions.effort === "high-low") return -diff;
      }

      // Name sorting
      if (sortOptions?.name) {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOptions.name === "a-z") return nameA.localeCompare(nameB);
        if (sortOptions.name === "z-a") return nameB.localeCompare(nameA);
      }

      return 0;
    });
  });

  return groupedTasks;
};

export const fetchAndGroupSearchTasks = async (
  search: string,
  householdId?: string
) => {
  let query = supabase
    .from("user_task")
    .select(
      `
        *,
        task_repeat_days(*),
        task_repeat_weeks(*),
        task_repeat_months(*)
      `
    )
    .order("category", { ascending: true });

  if (householdId) {
    query = query.eq("household_id", householdId);
  }

  if (search.trim() !== "") {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    return {};
  }

  return data;
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
  data: CreateTaskFormValues,
  household_id: string
): Promise<CreateTaskResult> => {
  try {
    const userResponse = await supabase.auth.getUser();
    const userId = userResponse.data.user?.id;
    console.log("data", data);
    if (!userId) {
      return { error: "User not authenticated" };
    }
    console.log(data);
    // Insert main task
    const { data: task, error: taskError } = await supabase
      .from("user_task")
      .insert([
        {
          user_id: userId,
          name: data.name,
          room: data.room,
          type: data.type,
          effort: data.effort,
          repeat: data.repeat,
          repeat_every: data.repeatEvery,
          repeat_type: data.repeat === true ? "repeat" : "goto",
          category: data.room,
          household_id: household_id,
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
  household_id: string,
  assign_user_id?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.from("spruce_tasks").insert([
      {
        user_task_id: userTaskId,
        user_id: userId,
        scheduled_date: scheduledDate,
        household_id: household_id,
        assign_user_id: assign_user_id, // ⬅️ new field
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

    // 1️⃣ Fetch tasks
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
        task_status,
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
          updated_at,
          repeat_type,
          category
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

    if (scheduledDate) {
      query = query.eq("scheduled_date", scheduledDate);
    }

    const { data: spruceData, error: spruceError } = await query.order(
      "scheduled_date",
      { ascending: true }
    );

    if (spruceError) {
      console.error("Error fetching spruce tasks:", spruceError.message);
      return { error: spruceError.message };
    }

    if (!spruceData || spruceData.length === 0) return { data: [] };

    // 2️⃣ Collect all assign_user_ids
    const assignUserIds = Array.from(
      new Set(spruceData.map((task) => task.assign_user_id).filter(Boolean))
    );

    // 3️⃣ Fetch profiles info including email (stored in profiles)
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select(
        "user_id, first_name, last_name, gender, family_role, household_id"
      )
      .in("user_id", assignUserIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError.message);
      return { error: profilesError.message };
    }

    // 4️⃣ Map profiles by user_id
    const profilesMap = new Map(profilesData.map((p) => [p.user_id, p]));

    // 5️⃣ Combine data
    const result: SpruceTaskDetails[] = spruceData.map((item: any) => ({
      id: item.id,
      assigned_at: item.created_at,
      updated_at: item.updated_at,
      assign_user_id: item.assign_user_id,
      scheduled_date: item.scheduled_date,
      assign_user_email: profilesMap.get(item.assign_user_id)?.email ?? null,
      assign_user_profile: profilesMap.get(item.assign_user_id) ?? null,
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
      task_status: item.task_status,
      user_task_repeat_type: item.user_task?.repeat_type,
      user_task_category: item.user_task?.category,
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

export async function assignUserToTask(taskId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("spruce_tasks")
      .update({ assign_user_id: userId, updated_at: new Date().toISOString() })
      .eq("id", taskId)
      .select("*")
      .single(); // ensures single row is returned

    if (error) {
      console.log(error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data, error: null };
  } catch (err) {
    return { success: false, data: null, error: (err as Error).message };
  }
}

export async function completeSpruceTask(taskId: string) {
  try {
    // 1️⃣ Get spruce task with related global & user task IDs
    const { data: spruceTask, error: fetchError } = await supabase
      .from("spruce_tasks")
      .select("id, global_task_id, user_task_id")
      .eq("id", taskId)
      .single();

    if (fetchError || !spruceTask) {
      return { success: false, error: "Task not found" };
    }

    const { global_task_id, user_task_id } = spruceTask;
    console.log("global_task_id", global_task_id);
    console.log("spruceTask", spruceTask);
    // 2️⃣ Update spruce task status
    const { error: spruceUpdateError } = await supabase
      .from("spruce_tasks")
      .update({
        task_status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (spruceUpdateError) {
      return { success: false, error: spruceUpdateError.message };
    }

    // 3️⃣ Update Global Task category if exists
    if (global_task_id) {
      await supabase
        .from("global_tasks")
        .update({ category: "completed_task" })
        .eq("id", global_task_id);
    }

    // 4️⃣ Update User Task room (or add field if needed)
    if (user_task_id) {
      await supabase
        .from("user_task")
        .update({ room: "completed_task" }) // customize if needed
        .eq("id", user_task_id);
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export const fetchHouseholdById = async (
  householdId: string
): Promise<{ data?: Household; error?: string }> => {
  try {
    if (!householdId) return { error: "Missing household ID" };

    const { data, error } = await supabase
      .from("households")
      .select("*")
      .eq("id", householdId)
      .single(); // ensures only one row is returned

    if (error) {
      console.error("Error fetching household:", error.message);
      return { error: error.message };
    }

    return { data };
  } catch (err: any) {
    console.error("Unexpected error fetching household:", err);
    return { error: err.message || "Unknown error occurred" };
  }
};

export const updateHousehold = async (
  householdId: string,
  payload: HouseholdUpdatePayload
): Promise<{ data?: any; error?: string }> => {
  try {
    if (!householdId) return { error: "Missing household ID" };
    if (!payload || Object.keys(payload).length === 0)
      return { error: "Nothing to update" };

    const { data, error } = await supabase
      .from("households")
      .update(payload)
      .eq("id", householdId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating household:", error.message);
      return { error: error.message };
    }

    return { data };
  } catch (err: any) {
    console.error("Unexpected error updating household:", err);
    return { error: err.message || "Unknown error occurred" };
  }
};

export const fetchPreMadePacksWithGlobalTasks = async (): Promise<{
  data?: PreMadePack[];
  error?: string;
}> => {
  try {
    // 1️⃣ Get all pre-made packs
    const { data: packs, error: packError } = await supabase
      .from("pre_made_packs")
      .select("*");

    if (packError) return { error: packError.message };
    if (!packs) return { data: [] };

    // 2️⃣ Fetch tasks for each pack
    const result: PreMadePack[] = await Promise.all(
      packs.map(async (pack) => {
        let tasks: GlobalTask[] = [];

        if (pack.taskids) {
          const taskIds: string[] = pack.taskids;

          if (taskIds.length > 0) {
            const { data: taskData, error: taskError } = await supabase
              .from("global_tasks")
              .select("*")
              .in("id", taskIds);

            if (taskError) {
              console.error(
                `Error fetching global tasks for pack ${pack.id}:`,
                taskError.message
              );
            } else if (taskData) {
              const order = pack.taskorder ? pack.taskorder : [];
              tasks = order.length
                ? (order
                    .map((id: string) => taskData.find((t) => t.id === id))
                    .filter(Boolean) as GlobalTask[])
                : taskData;
            }
          }
        }

        return { ...pack, tasks };
      })
    );

    return { data: result };
  } catch (err: any) {
    console.error("Unexpected error fetching pre-made packs:", err);
    return { error: err.message || "Unknown error occurred" };
  }
};

export const fetchRooms = async (
  householdId: string
): Promise<{ label: string; value: string }[] | { error: string }> => {
  try {
    // 1. Fetch GLOBAL rooms
    const { data: globalRooms, error: globalErr } = await supabase
      .from("rooms")
      .select("name_us")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (globalErr) throw globalErr;

    // 2. Fetch HOUSEHOLD rooms
    const { data: householdRooms, error: householdErr } = await supabase
      .from("household_rooms")
      .select("*")
      .eq("active", true)
      .eq("household_id", householdId)
      .order("display_order", { ascending: true });

    if (householdErr) throw householdErr;

    // 3. Merge both arrays
    const combined: any = [...(globalRooms || []), ...(householdRooms || [])];

    // 4. Convert to options format
    console.log(combined);
    const roomOptions = combined.map((room: any) => ({
      label: room.name_us,
      value: room.name_us.replace(/\s+/g, "-"),
      houseRoom: room.household_id ? true : false,
      id: room.id,
    }));

    return roomOptions;
  } catch (err: any) {
    return { error: err.message || "Unknown error" };
  }
};

export async function createHouseholdRoom(roomData: {
  householdId: string;
  name_us: string;
  name_uk?: string;
  name_row?: string;
  icon?: string;
  display_order?: number;
  active?: boolean;
}) {
  try {
    const { householdId, ...fields } = roomData;

    const { data, error } = await supabase
      .from("household_rooms")
      .insert([
        {
          household_id: householdId,
          name_us: fields.name_us,
          name_uk: fields.name_uk ?? fields.name_us,
          name_row: fields.name_row ?? fields.name_us,
          icon: fields.icon ?? "home",
          display_order: fields.display_order ?? 0,
          active: fields.active ?? true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err: any) {
    console.error("Error creating household room:", err.message);
    return { error: err.message };
  }
}

interface UpdateHouseholdRoomProps {
  roomId: string;
  householdId?: string; // optional if you want to update the household relation
  name_us?: string;
  name_uk?: string;
  name_row?: string;
  icon?: string;
  display_order?: number;
  active?: boolean;
}

export const updateHouseholdRoom = async ({
  roomId,
  householdId,
  name_us,
  name_uk,
  name_row,
  icon,
  display_order,
  active,
}: UpdateHouseholdRoomProps) => {
  try {
    const updateData: Record<string, any> = {};

    if (householdId !== undefined) updateData.household_id = householdId;
    if (name_us !== undefined) updateData.name_us = name_us;
    if (name_uk !== undefined) updateData.name_uk = name_uk;
    if (name_row !== undefined) updateData.name_row = name_row;
    if (icon !== undefined) updateData.icon = icon;
    if (display_order !== undefined) updateData.display_order = display_order;
    if (active !== undefined) updateData.active = active;

    const { data, error } = await supabase
      .from("household_rooms")
      .update(updateData)
      .eq("id", roomId)
      .select()
      .single();

    if (error) {
      console.error("Error updating household room:", error.message);
      return { error: error.message };
    }

    return { data };
  } catch (err: any) {
    console.error("Unexpected error updating household room:", err);
    return { error: err.message || "Unknown error" };
  }
};

export const updateHouseholdSettings = async (
  householdId: string,
  updates: {
    groupbyweek?: string;
    weekofstart?: string;
  }
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("households")
      .update({
        ...(updates.groupbyweek && { groupbyweek: updates.groupbyweek }),
        ...(updates.weekofstart && { weekofstart: updates.weekofstart }),
      })
      .eq("id", householdId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const getHouseholdById = async (
  householdId: string
): Promise<{ data?: any; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("households")
      .select("*")
      .eq("id", householdId)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data };
  } catch (err: any) {
    return { error: err.message };
  }
};

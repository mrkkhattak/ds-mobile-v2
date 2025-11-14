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
  assignment_id: string;
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

export const fetchAndGroupTasks = async () => {
  const { data, error } = await supabase
    .from("global_tasks")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching tasks:", error);
    return {};
  }

  // Group tasks by category
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
  userId: string
): Promise<{ data?: SpruceTaskDetails[]; error?: string }> => {
  try {
    const { data: spruceData, error } = await supabase
      .from("spruce_tasks")
      .select(
        `
        id,
        assign_user_id,
        user_id,
        user_task_id,
        user_task:user_task_id (
          id,
          name,
          room,
          type,
          effort,
          repeat,
          repeat_every,
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

    if (error) {
      console.error("Error fetching spruce tasks:", error.message);
      return { error: error.message };
    }

    if (!spruceData) {
      return { data: [] };
    }

    // Map to SpruceTaskDetails type
    const result: SpruceTaskDetails[] = spruceData.map((item: any) => ({
      assignment_id: item.id,
      assigned_at: item.created_at,
      updated_at: item.updated_at,
      assign_user_id: item.assign_user_id,
      assign_user_email: null, // optional, can be populated separately
      owner_user_id: item.user_id,
      owner_user_email: null, // optional, can be populated separately

      task_id: item.global_task?.id || null,
      task_name: item.global_task?.name || null,
      description_us: item.global_task?.description_us || null,
      description_uk: item.global_task?.description_uk || null,
      description_row: item.global_task?.description_row || null,
      icon_name: item.global_task?.icon_name || null,
      child_friendly: item.global_task?.child_friendly || null,
      estimated_effort: item.global_task?.estimated_effort || null,
      points: item.global_task?.points || null,
      room: item.global_task?.room || null,
      category: item.global_task?.category || null,
      keywords: item.global_task?.keywords || null,
      display_names: item.global_task?.display_names || null,
      unique_completions: item.global_task?.unique_completions || null,
      total_completions: item.global_task?.total_completions || null,
      effort_level: item.global_task?.effort_level || null,

      // User task fields
      user_task_id: item.user_task?.id || undefined,
      user_task_name: item.user_task?.name || undefined,
      user_task_room: item.user_task?.room || null,
      user_task_type: item.user_task?.type || null,
      user_task_effort: item.user_task?.effort || null,
      user_task_repeat: item.user_task?.repeat || false,
      user_task_repeat_every: item.user_task?.repeat_every || null,
      user_task_created_at: item.user_task?.created_at || null,
      user_task_updated_at: item.user_task?.updated_at || null,
    }));

    return { data: result };
  } catch (err: any) {
    console.error("Unexpected error fetching spruce tasks:", err);
    return { error: err.message || "Unknown error occurred" };
  }
};

export const AddTaskToSpruce = async (
  global_task_id: string,
  user_id: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from("spruce_tasks").insert([
      {
        global_task_id,
        user_id,
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

export const removeTaskFromSpruce = async ({
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
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.from("spruce_tasks").insert([
      {
        user_task_id: userTaskId,
        user_id: userId,
      },
    ]);

    if (error) {
      console.error("Error adding user task to spruce:", error.message);
      return { success: false, error: error.message };
    }

    console.log("User task added to spruce successfully:", data);
    return { success: true };
  } catch (err: any) {
    console.error(
      "Unexpected error adding user task to spruce:",
      err.message || err
    );
    return { success: false, error: err.message || "Unknown error" };
  }
};

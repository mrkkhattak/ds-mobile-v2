import { supabase } from "@/lib/supabase";
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
  assignment_id: string;
  assigned_at: string;
  updated_at: string;
  assign_user_id: string;
  assign_user_email: string | null;
  owner_user_id: string;
  owner_user_email: string | null;

  task_id: string;
  task_name: string;
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
  display_names: Record<string, any> | null; // JSONB field
  unique_completions: number | null;
  total_completions: number | null;
  effort_level: string | null;
}
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

export const getAssignedSpruceTasks = async (
  user_id: string
): Promise<SpruceTaskDetails[] | null> => {
  const { data, error } = await supabase.rpc("get_spruce_tasks_with_users", {
    assign_id: user_id,
  });

  console.log("data", data);
  if (error) {
    console.error("Error fetching spruce tasks:", error.message);
    return null;
  }

  return data as SpruceTaskDetails[];
};

export const assignTaskToUser = async (
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

export const removeAssignedTask = async (
  globalTaskId: string,
  userId: string
) => {
  try {
    const { error } = await supabase
      .from("spruce_tasks")
      .delete()
      .eq("global_task_id", globalTaskId)
      .eq("user_id", userId); // ✅ fixed column name

    if (error) {
      console.error("Error removing task:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Unexpected error removing task:", err);
    return false;
  }
};

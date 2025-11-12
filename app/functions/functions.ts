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
  owner_user_id: string | null;
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

// ✅ 1. Fetch tasks assigned to a specific user
export async function getAssignedTasks(
  assignUserId: string
): Promise<TaskWithAssignment[]> {
  const { data, error } = await supabase
    .from("spruce_tasks")
    .select(
      `
      id,
      assign_user_id,
      user_id,
      created_at,
      updated_at,
      global_tasks (
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
        is_active,
        created_at,
        updated_at
      )
    `
    )
    .eq("assign_user_id", assignUserId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching assigned tasks:", error.message);
    throw error;
  }

  return (data || []).map((item: any) => ({
    assignment_id: item.id,
    task_id: item.global_tasks.id,
    task_name: item.global_tasks.name,
    task_description_us: item.global_tasks.description_us,
    task_description_uk: item.global_tasks.description_uk,
    task_description_row: item.global_tasks.description_row,
    icon_name: item.global_tasks.icon_name,
    child_friendly: item.global_tasks.child_friendly,
    estimated_effort: item.global_tasks.estimated_effort,
    points: item.global_tasks.points,
    room: item.global_tasks.room,
    category: item.global_tasks.category,
    is_active: item.global_tasks.is_active,
    created_at: item.global_tasks.created_at,
    updated_at: item.global_tasks.updated_at,
    assign_user_id: item.assign_user_id,
    owner_user_id: item.user_id,
  }));
}

// ✅ 2. Fetch all tasks (with assignment info if any)
export async function getAllTasksWithAssignments(): Promise<
  TaskWithAssignment[]
> {
  const { data, error } = await supabase
    .from("global_tasks")
    .select(
      `
      *,
      spruce_tasks (
        id,
        assign_user_id,
        user_id,
        created_at,
        updated_at
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks with assignments:", error.message);
    throw error;
  }

  const result: TaskWithAssignment[] = [];
  (data || []).forEach((task: any) => {
    if (task.spruce_tasks && task.spruce_tasks.length > 0) {
      task.spruce_tasks.forEach((st: any) => {
        result.push({
          assignment_id: st.id,
          task_id: task.id,
          task_name: task.name,
          task_description_us: task.description_us,
          task_description_uk: task.description_uk,
          task_description_row: task.description_row,
          icon_name: task.icon_name,
          child_friendly: task.child_friendly,
          estimated_effort: task.estimated_effort,
          points: task.points,
          room: task.room,
          category: task.category,
          is_active: task.is_active,
          created_at: task.created_at,
          updated_at: task.updated_at,
          assign_user_id: st.assign_user_id,
          owner_user_id: st.user_id,
        });
      });
    } else {
      result.push({
        assignment_id: null,
        task_id: task.id,
        task_name: task.name,
        task_description_us: task.description_us,
        task_description_uk: task.description_uk,
        task_description_row: task.description_row,
        icon_name: task.icon_name,
        child_friendly: task.child_friendly,
        estimated_effort: task.estimated_effort,
        points: task.points,
        room: task.room,
        category: task.category,
        is_active: task.is_active,
        created_at: task.created_at,
        updated_at: task.updated_at,
        assign_user_id: null,
        owner_user_id: null,
      });
    }
  });

  return result;
}

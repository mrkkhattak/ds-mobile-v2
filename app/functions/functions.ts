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

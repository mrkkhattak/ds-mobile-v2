import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sgfcqeuztipsqwteokze.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZmNxZXV6dGlwc3F3dGVva3plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDA5NTEsImV4cCI6MjA3NDI3Njk1MX0.ehRD_lq3LG-1Iz9_KE5RMfT-IwgOfs7zbrfL75X0evE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: "implicit",
  },
});

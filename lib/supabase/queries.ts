import { SpeedTestResult } from "@/types/speed-test";
import { createClient } from "./client";

const LOCAL_STORAGE_KEY = "netpulse_test_history";

export async function saveSpeedTest(result: SpeedTestResult): Promise<SpeedTestResult> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;

      const payload = {
        ...result,
        user_id: userId,
      };

      const { data, error } = await supabase
        .from("speed_tests")
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        saveToLocalStorage(data as SpeedTestResult);
        return data as SpeedTestResult;
      }
    } catch (err) {
      console.warn("Supabase save error, writing to localStorage:", err);
    }
  }

  // LocalStorage Fallback
  saveToLocalStorage(result);
  return result;
}

export async function getSpeedTestHistory(): Promise<SpeedTestResult[]> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user?.id) {
        const { data, error } = await supabase
          .from("speed_tests")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data as SpeedTestResult[];
        }
      }
    } catch (err) {
      console.warn("Supabase history fetch fallback to localStorage:", err);
    }
  }

  return getLocalStorageHistory();
}

export async function getSpeedTestById(id: string): Promise<SpeedTestResult | null> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("speed_tests")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return data as SpeedTestResult;
      }
    } catch (err) {
      console.warn("Supabase query by ID error:", err);
    }
  }

  const localItems = getLocalStorageHistory();
  return localItems.find((item) => item.id === id) || null;
}

export async function deleteSpeedTest(id: string): Promise<boolean> {
  const supabase = createClient();

  if (supabase) {
    try {
      await supabase.from("speed_tests").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  deleteFromLocalStorage(id);
  return true;
}

// LocalStorage Helper Functions
function getLocalStorageHistory(): SpeedTestResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToLocalStorage(result: SpeedTestResult) {
  if (typeof window === "undefined") return;
  try {
    const history = getLocalStorageHistory();
    // Prepend new result
    const updated = [result, ...history.filter((h) => h.id !== result.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (err) {
    console.error("Failed writing to localStorage:", err);
  }
}

function deleteFromLocalStorage(id: string) {
  if (typeof window === "undefined") return;
  try {
    const history = getLocalStorageHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed deleting from localStorage:", err);
  }
}

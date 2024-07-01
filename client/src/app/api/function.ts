import { supabase_auth } from "@/lib/supabaseClient";
import { loggerInfo } from "@/lib/pino";

export async function get_user_id(email: string) {
  const { data, error } = await supabase_auth.from("users").select("id").eq("email", email);

  if (error) {
    console.error(error);
    return null;
  }

  loggerInfo("User ID is successfully retrieved.", { caller: "get_user_id", status: 200 });

  const user_id = data[0].id;

  return user_id;
}

export async function get_user_data(user_id: string) {
  const { data, error } = await supabase_auth.from("users").select("name, image").eq("id", user_id);

  if (error) {
    console.error(error);
    return null;
  }

  loggerInfo("User data is successfully retrieved.", { caller: "get_user_data", status: 200 });

  return data[0];
}
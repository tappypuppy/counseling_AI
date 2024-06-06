import { supabase_auth } from "@/lib/supabaseClient";
import { loggerInfo } from "@/lib/pino";

export async function get_user_id(email: string) {
  const { data, error } = await supabase_auth.from("users").select("id").eq("email", email);

  if (error) {
    console.error(error);
    return null;
  }

  loggerInfo("User ID is successfully retrieved.", { caller: "get_user_id", status: 200 });
  console.log(data[0].id);

  const user_id = data[0].id;

  return user_id;
}
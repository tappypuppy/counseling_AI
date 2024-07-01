import { supabase } from "@/lib/supabaseClient";
import { loggerInfo } from "@/lib/pino";
import { get_user_id } from "@/app/api/function";

export const create_room = async (userEmail: string) => {
  const user_id = await get_user_id(userEmail);

  const { data, error } = await supabase.from("rooms").insert([{ user_id: user_id }]).select();

  console.log("DATA:", data);

  const room_id = data && data[0] ? (data[0] as { id: string }).id : null;

  if (error) {
    console.error(error);
    return { status: "error" };
  }

  loggerInfo("Room is successfully inserted.", { caller: "POST", status: 200 });

  return room_id;

  // const res = await fetch(process.env.API_URL + "/create_room/", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json;charset=UTF-8",
  //   },
  //   body: JSON.stringify({
  //     user_email: userEmail,
  //   }),
  // });
  // return res;
};

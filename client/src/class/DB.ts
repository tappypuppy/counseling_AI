import {
  createClient,
  SupabaseClientOptions,
  SupabaseClient,
} from "@supabase/supabase-js";

interface AuthDatabase {
  next_auth: any;
}

export default class DB {
  public supabaseClient: SupabaseClient;
  private supabaseAuthClient: SupabaseClient<AuthDatabase, "next_auth">;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const options: SupabaseClientOptions<"next_auth"> = {
      db: { schema: "next_auth" },
    };

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const supabase_auth = createClient<AuthDatabase, "next_auth">(
      supabaseUrl,
      supabaseServiceRoleKey,
      options
    );

    this.supabaseClient = supabase;
    this.supabaseAuthClient = supabase_auth;
  }

  async getUserId(userEmail: string): Promise<string> {
    const { data, error } = await this.supabaseAuthClient
      .from("users")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // data = { id: string }
    const userId = data.id;

    return userId;
  }

  async getUserData(userId: string): Promise<{name: string, image: string}> {
    const { data, error } = await this.supabaseAuthClient
      .from("users")
      .select("name, image")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async createRoom(userEmail: string): Promise<string> {
    const userId = await this.getUserId(userEmail);
  
    const { data, error } = await this.supabaseClient
      .from("rooms")
      .insert([{ user_id: userId }])
      .select()
      .single();
  
    if (error) {
      throw new Error(error.message);
    }

    const roomId = data.id
  
    return roomId;
  }


}

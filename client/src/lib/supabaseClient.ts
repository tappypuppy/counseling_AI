/* 
    このファイルは、Supabase クライアントを初期化するためのものです。
    クライアントは、環境変数から URL と匿名キーを使用して初期化されます。
 */

import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';

interface AuthDatabase {
    next_auth: any;
}


const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const options: SupabaseClientOptions<'next_auth'> = { db: { schema: 'next_auth' }};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabase_auth = createClient<AuthDatabase, 'next_auth'>(supabaseUrl, supabaseServiceRoleKey, options);

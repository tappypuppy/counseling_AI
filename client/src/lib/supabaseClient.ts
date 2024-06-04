/* 
    このファイルは、Supabase クライアントを初期化するためのものです。
    クライアントは、環境変数から URL と匿名キーを使用して初期化されます。
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: Tables;
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Tables & Views)
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Tables & Views)
  ? (Tables & Views)[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type Views = Database["public"]["Views"]
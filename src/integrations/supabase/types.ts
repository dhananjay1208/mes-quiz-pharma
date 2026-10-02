// Slim Database type for this app — only the table it actually uses.
// (The automotive donor shipped a full dump of an unrelated project's schema that
// didn't even contain its own table, so its Supabase calls were silently untyped.
// The donor golden master fixed that; keep it fixed here.)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      team_submissions_pharma: {
        Row: {
          id: string;
          created_at: string;
          team_name: string;
          submission_time: string;
          responses: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          team_name: string;
          submission_time: string;
          responses: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          team_name?: string;
          submission_time?: string;
          responses?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

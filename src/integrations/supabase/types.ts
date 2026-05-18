export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      classes: {
        Row: {
          capacity: number
          class_date: string
          course_key: string | null
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          level: string | null
          location: string | null
          name: string
          price_cents: number
          slug: string
          start_time: string | null
          status: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          class_date: string
          course_key?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          level?: string | null
          location?: string | null
          name: string
          price_cents?: number
          slug: string
          start_time?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          class_date?: string
          course_key?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          level?: string | null
          location?: string | null
          name?: string
          price_cents?: number
          slug?: string
          start_time?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          active: boolean
          category: Database["public"]["Enums"]["discount_category"]
          code: string
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          expires_at: string | null
          id: string
          label: string | null
          max_uses: number | null
          updated_at: string
          used_count: number
        }
        Insert: {
          active?: boolean
          category?: Database["public"]["Enums"]["discount_category"]
          code: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          expires_at?: string | null
          id?: string
          label?: string | null
          max_uses?: number | null
          updated_at?: string
          used_count?: number
        }
        Update: {
          active?: boolean
          category?: Database["public"]["Enums"]["discount_category"]
          code?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          expires_at?: string | null
          id?: string
          label?: string | null
          max_uses?: number | null
          updated_at?: string
          used_count?: number
        }
        Relationships: []
      }
      signups: {
        Row: {
          calendar_event_id: string | null
          class_id: string
          confirmed_at: string | null
          created_at: string
          discount_code: string | null
          discount_type: string | null
          discount_value: number | null
          email: string
          expires_at: string
          final_price_cents: number | null
          first_name: string
          id: string
          is_returning_customer: boolean
          last_name: string
          notes: string | null
          original_price_cents: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          phone: string | null
          reference_code: string
          status: Database["public"]["Enums"]["signup_status"]
          updated_at: string
          waiver_governing_state: string | null
          waiver_photo_consent: boolean | null
          waiver_printed_name: string | null
          waiver_signature_name: string | null
          waiver_signed_at: string | null
          waiver_version: string | null
        }
        Insert: {
          calendar_event_id?: string | null
          class_id: string
          confirmed_at?: string | null
          created_at?: string
          discount_code?: string | null
          discount_type?: string | null
          discount_value?: number | null
          email: string
          expires_at?: string
          final_price_cents?: number | null
          first_name: string
          id?: string
          is_returning_customer?: boolean
          last_name: string
          notes?: string | null
          original_price_cents?: number | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          phone?: string | null
          reference_code: string
          status?: Database["public"]["Enums"]["signup_status"]
          updated_at?: string
          waiver_governing_state?: string | null
          waiver_photo_consent?: boolean | null
          waiver_printed_name?: string | null
          waiver_signature_name?: string | null
          waiver_signed_at?: string | null
          waiver_version?: string | null
        }
        Update: {
          calendar_event_id?: string | null
          class_id?: string
          confirmed_at?: string | null
          created_at?: string
          discount_code?: string | null
          discount_type?: string | null
          discount_value?: number | null
          email?: string
          expires_at?: string
          final_price_cents?: number | null
          first_name?: string
          id?: string
          is_returning_customer?: boolean
          last_name?: string
          notes?: string | null
          original_price_cents?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          phone?: string | null
          reference_code?: string
          status?: Database["public"]["Enums"]["signup_status"]
          updated_at?: string
          waiver_governing_state?: string | null
          waiver_photo_consent?: boolean | null
          waiver_printed_name?: string | null
          waiver_signature_name?: string | null
          waiver_signed_at?: string | null
          waiver_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signups_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_returning_customer: { Args: { _email: string }; Returns: boolean }
      get_class_seat_counts: {
        Args: never
        Returns: {
          class_id: string
          confirmed_count: number
          pending_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validate_discount_code: {
        Args: { _code: string }
        Returns: {
          category: string
          code: string
          discount_type: string
          discount_value: number
          reason: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      discount_category: "military" | "leo" | "returning" | "custom"
      discount_type: "percent" | "fixed"
      payment_method: "zelle" | "venmo"
      signup_status: "pending" | "confirmed" | "cancelled" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      discount_category: ["military", "leo", "returning", "custom"],
      discount_type: ["percent", "fixed"],
      payment_method: ["zelle", "venmo"],
      signup_status: ["pending", "confirmed", "cancelled", "expired"],
    },
  },
} as const

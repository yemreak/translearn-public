export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      account_deletion_logs: {
        Row: {
          deleted_at: string
          email: string | null
          id: string
          ip_address: string
          reason: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          deleted_at?: string
          email?: string | null
          id?: string
          ip_address: string
          reason?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          deleted_at?: string
          email?: string | null
          id?: string
          ip_address?: string
          reason?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_tasks: {
        Row: {
          created_at: string
          instruction: string
          task: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          instruction: string
          task: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          instruction?: string
          task?: string
          updated_at?: string
        }
        Relationships: []
      }
      deletion_requests: {
        Row: {
          cancelled: boolean
          id: string
          ip_address: string
          processed: boolean
          processed_at: string | null
          requested_at: string
          scheduled_deletion_date: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          cancelled?: boolean
          id?: string
          ip_address: string
          processed?: boolean
          processed_at?: string | null
          requested_at?: string
          scheduled_deletion_date: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          cancelled?: boolean
          id?: string
          ip_address?: string
          processed?: boolean
          processed_at?: string | null
          requested_at?: string
          scheduled_deletion_date?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      speeches: {
        Row: {
          created_at: string
          credit_cost: number
          duration: number
          language: string | null
          mimetype: string
          path: string
          recorded_at: string
          request_id: string
          tags: string[] | null
          title: string | null
          transcript: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          credit_cost?: number
          duration: number
          language?: string | null
          mimetype: string
          path: string
          recorded_at: string
          request_id: string
          tags?: string[] | null
          title?: string | null
          transcript?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          credit_cost?: number
          duration?: number
          language?: string | null
          mimetype?: string
          path?: string
          recorded_at?: string
          request_id?: string
          tags?: string[] | null
          title?: string | null
          transcript?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speeches_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "user_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_environments: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          user_id: string
          value: string
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      user_histories: {
        Row: {
          created_at: string | null
          duration: number | null
          id: string
          segments: Json | null
          source_language: string
          target_language: string
          transcreation: string | null
          transcribe_segments: Json | null
          transcription: string
          transliteration: string | null
          tts_alignment: Json | null
          tts_audio_base64: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          id?: string
          segments?: Json | null
          source_language: string
          target_language: string
          transcreation?: string | null
          transcribe_segments?: Json | null
          transcription: string
          transliteration?: string | null
          tts_alignment?: Json | null
          tts_audio_base64?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          id?: string
          segments?: Json | null
          source_language?: string
          target_language?: string
          transcreation?: string | null
          transcribe_segments?: Json | null
          transcription?: string
          transliteration?: string | null
          tts_alignment?: Json | null
          tts_audio_base64?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          source_language: string
          target_language: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          source_language?: string
          target_language?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          source_language?: string
          target_language?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_requests: {
        Row: {
          created_at: string
          device: string
          endpoint: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device: string
          endpoint?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device?: string
          endpoint?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_api_key: {
        Args: { user_id: string; name: string }
        Returns: string
      }
      generate_hash: {
        Args: { p: string; i: string }
        Returns: string
      }
      modify_credit_balance: {
        Args: { target_user_id: string; delta: number }
        Returns: undefined
      }
      request_account_deletion: {
        Args: {
          scheduled_days?: number
          client_ip?: string
          client_user_agent?: string
        }
        Returns: Json
      }
    }
    Enums: {
      voice_type: "UPLOADED" | "GENERATED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      voice_type: ["UPLOADED", "GENERATED"],
    },
  },
} as const

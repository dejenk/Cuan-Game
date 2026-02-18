 
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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      community_chat: {
        Row: {
          created_at: string | null
          id: string
          message: string
          player_name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          player_name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          player_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      debts: {
        Row: {
          created_at: string | null
          created_turn: number
          creditor_name: string
          current_balance: number
          due_turn: number | null
          id: string
          interest_rate: number
          is_paid: boolean
          principal_amount: number
          updated_at: string | null
          user_id: string
          weekly_payment: number
        }
        Insert: {
          created_at?: string | null
          created_turn: number
          creditor_name: string
          current_balance: number
          due_turn?: number | null
          id?: string
          interest_rate: number
          is_paid?: boolean
          principal_amount: number
          updated_at?: string | null
          user_id: string
          weekly_payment: number
        }
        Update: {
          created_at?: string | null
          created_turn?: number
          creditor_name?: string
          current_balance?: number
          due_turn?: number | null
          id?: string
          interest_rate?: number
          is_paid?: boolean
          principal_amount?: number
          updated_at?: string | null
          user_id?: string
          weekly_payment?: number
        }
        Relationships: [
          {
            foreignKeyName: "debts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_log: {
        Row: {
          created_at: string | null
          description: string
          event_type: string
          id: string
          impact: Json | null
          is_read: boolean
          title: string
          turn_number: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          event_type: string
          id?: string
          impact?: Json | null
          is_read?: boolean
          title: string
          turn_number: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          event_type?: string
          id?: string
          impact?: Json | null
          is_read?: boolean
          title?: string
          turn_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_state: {
        Row: {
          action_points: number
          cash: number
          created_at: string | null
          credit_score: number
          current_turn: number
          id: string
          mental_health: number
          net_worth: number
          reputation: number
          total_debt: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_points?: number
          cash?: number
          created_at?: string | null
          credit_score?: number
          current_turn?: number
          id?: string
          mental_health?: number
          net_worth?: number
          reputation?: number
          total_debt?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_points?: number
          cash?: number
          created_at?: string | null
          credit_score?: number
          current_turn?: number
          id?: string
          mental_health?: number
          net_worth?: number
          reputation?: number
          total_debt?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_state_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          current_turn: number
          id: string
          net_worth: number
          player_name: string
          rank: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_turn: number
          id?: string
          net_worth: number
          player_name: string
          rank?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_turn?: number
          id?: string
          net_worth?: number
          player_name?: string
          rank?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio: {
        Row: {
          asset_name: string
          asset_type: string
          buy_price: number
          created_at: string | null
          current_price: number
          id: string
          purchased_turn: number
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asset_name: string
          asset_type: string
          buy_price: number
          created_at?: string | null
          current_price: number
          id?: string
          purchased_turn: number
          quantity: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asset_name?: string
          asset_type?: string
          buy_price?: number
          created_at?: string | null
          current_price?: number
          id?: string
          purchased_turn?: number
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string
          id: string
          transaction_type: string
          turn_number: number
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          description: string
          id?: string
          transaction_type: string
          turn_number: number
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          transaction_type?: string
          turn_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vacation_history: {
        Row: {
          cost: number
          created_at: string | null
          description: string | null
          destination: string
          id: string
          mental_gain: number
          reputation_gain: number | null
          turn_number: number
          user_id: string
        }
        Insert: {
          cost: number
          created_at?: string | null
          description?: string | null
          destination: string
          id?: string
          mental_gain: number
          reputation_gain?: number | null
          turn_number: number
          user_id: string
        }
        Update: {
          cost?: number
          created_at?: string | null
          description?: string | null
          destination?: string
          id?: string
          mental_gain?: number
          reputation_gain?: number | null
          turn_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vacation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

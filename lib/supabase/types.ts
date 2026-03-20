export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cash_funds: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          registry_id: string
          target_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          registry_id: string
          target_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          registry_id?: string
          target_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_funds_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "registries"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          amount: number
          cash_fund_id: string
          contributor_name: string
          contributor_user_id: string | null
          created_at: string
          id: string
          is_anonymous: boolean
          message: string | null
        }
        Insert: {
          amount: number
          cash_fund_id: string
          contributor_name: string
          contributor_user_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
        }
        Update: {
          amount?: number
          cash_fund_id?: string
          contributor_name?: string
          contributor_user_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_cash_fund_id_fkey"
            columns: ["cash_fund_id"]
            isOneToOne: false
            referencedRelation: "cash_funds"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      registries: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_location: string | null
          header_image_url: string | null
          id: string
          is_public: boolean
          occasion: Database["public"]["Enums"]["occasion_type"]
          personal_message: string | null
          share_token: string | null
          shipping_address: string | null
          thank_you_note: string | null
          title: string
          updated_at: string
          upi_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_location?: string | null
          header_image_url?: string | null
          id?: string
          is_public?: boolean
          occasion?: Database["public"]["Enums"]["occasion_type"]
          personal_message?: string | null
          share_token?: string | null
          shipping_address?: string | null
          thank_you_note?: string | null
          title: string
          updated_at?: string
          upi_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_location?: string | null
          header_image_url?: string | null
          id?: string
          is_public?: boolean
          occasion?: Database["public"]["Enums"]["occasion_type"]
          personal_message?: string | null
          share_token?: string | null
          shipping_address?: string | null
          thank_you_note?: string | null
          title?: string
          updated_at?: string
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      registry_gifts: {
        Row: {
          created_at: string
          id: string
          is_purchased: boolean
          notes: string | null
          price: number | null
          product_image_url: string | null
          product_name: string
          product_url: string | null
          purchase_message: string | null
          purchased_at: string | null
          purchased_by_name: string | null
          purchased_by_user_id: string | null
          registry_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_purchased?: boolean
          notes?: string | null
          price?: number | null
          product_image_url?: string | null
          product_name: string
          product_url?: string | null
          purchase_message?: string | null
          purchased_at?: string | null
          purchased_by_name?: string | null
          purchased_by_user_id?: string | null
          registry_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_purchased?: boolean
          notes?: string | null
          price?: number | null
          product_image_url?: string | null
          product_name?: string
          product_url?: string | null
          purchase_message?: string | null
          purchased_at?: string | null
          purchased_by_name?: string | null
          purchased_by_user_id?: string | null
          registry_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registry_gifts_registry_id_fkey"
            columns: ["registry_id"]
            isOneToOne: false
            referencedRelation: "registries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_registry: { Args: { registry_id: string }; Returns: boolean }
      get_registry_owner_from_fund: {
        Args: { fund_id: string }
        Returns: string
      }
      get_registry_owner_from_gift: {
        Args: { gift_id: string }
        Returns: string
      }
      is_registry_owner: { Args: { registry_id: string }; Returns: boolean }
    }
    Enums: {
      occasion_type:
        | "wedding"
        | "baby_shower"
        | "housewarming"
        | "birthday"
        | "other"
        | "anniversary"
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

export const Constants = {
  public: {
    Enums: {
      occasion_type: [
        "wedding",
        "baby_shower",
        "housewarming",
        "birthday",
        "other",
        "anniversary",
      ],
    },
  },
} as const

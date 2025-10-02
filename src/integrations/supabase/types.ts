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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      catalogue_items: {
        Row: {
          catalogue_id: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          sku: string | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          catalogue_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          catalogue_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_items_catalogue_id_fkey"
            columns: ["catalogue_id"]
            isOneToOne: false
            referencedRelation: "catalogues"
            referencedColumns: ["id"]
          },
        ]
      }
      catalogues: {
        Row: {
          created_at: string | null
          currency: string
          description: string | null
          id: string
          link_code: string
          name: string
          status: string
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          link_code?: string
          name: string
          status?: string
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          link_code?: string
          name?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      donation_links: {
        Row: {
          created_at: string | null
          currency: string
          current_amount: number | null
          description: string | null
          donations_count: number | null
          goal_amount: number
          id: string
          link_code: string
          redirect_url: string | null
          status: string
          thank_you_message: string | null
          title: string
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          current_amount?: number | null
          description?: string | null
          donations_count?: number | null
          goal_amount: number
          id?: string
          link_code?: string
          redirect_url?: string | null
          status?: string
          thank_you_message?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          current_amount?: number | null
          description?: string | null
          donations_count?: number | null
          goal_amount?: number
          id?: string
          link_code?: string
          redirect_url?: string | null
          status?: string
          thank_you_message?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          description: string | null
          id: string
          link_code: string
          payments_count: number | null
          product_name: string
          redirect_url: string | null
          status: string
          thank_you_message: string | null
          total_amount_collected: number | null
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          link_code?: string
          payments_count?: number | null
          product_name: string
          redirect_url?: string | null
          status?: string
          thank_you_message?: string | null
          total_amount_collected?: number | null
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          link_code?: string
          payments_count?: number | null
          product_name?: string
          redirect_url?: string | null
          status?: string
          thank_you_message?: string | null
          total_amount_collected?: number | null
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bank_account_name: string | null
          bank_account_number: string | null
          bank_name: string | null
          business_address: string | null
          business_name: string | null
          country: string | null
          created_at: string
          currency: string | null
          currency_set_at: string | null
          email: string | null
          full_name: string | null
          id: string
          invoice_footer: string | null
          logo_url: string | null
          mobile_number: string | null
          mobile_provider: string | null
          plan: string | null
          primary_color: string | null
          secondary_color: string | null
          tax_id: string | null
          updated_at: string
          withdrawal_account_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          business_address?: string | null
          business_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          currency_set_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          invoice_footer?: string | null
          logo_url?: string | null
          mobile_number?: string | null
          mobile_provider?: string | null
          plan?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tax_id?: string | null
          updated_at?: string
          withdrawal_account_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          business_address?: string | null
          business_name?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          currency_set_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          invoice_footer?: string | null
          logo_url?: string | null
          mobile_number?: string | null
          mobile_provider?: string | null
          plan?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          tax_id?: string | null
          updated_at?: string
          withdrawal_account_type?: string | null
        }
        Relationships: []
      }
      subscription_links: {
        Row: {
          amount: number
          billing_cycle: string
          created_at: string | null
          currency: string
          description: string | null
          id: string
          link_code: string
          plan_name: string
          redirect_url: string | null
          status: string
          subscribers_count: number | null
          thank_you_message: string | null
          total_revenue: number | null
          trial_days: number | null
          updated_at: string | null
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          amount: number
          billing_cycle: string
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          link_code?: string
          plan_name: string
          redirect_url?: string | null
          status?: string
          subscribers_count?: number | null
          thank_you_message?: string | null
          total_revenue?: number | null
          trial_days?: number | null
          updated_at?: string | null
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          amount?: number
          billing_cycle?: string
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          link_code?: string
          plan_name?: string
          redirect_url?: string | null
          status?: string
          subscribers_count?: number | null
          thank_you_message?: string | null
          total_revenue?: number | null
          trial_days?: number | null
          updated_at?: string | null
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string | null
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          reference: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
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

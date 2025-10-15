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
      announcement_reads: {
        Row: {
          announcement_id: string
          id: string
          read_at: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          id?: string
          read_at?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_name: string | null
          content: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: string
          published_at: string
          target_audience: string
          tenant_id: string | null
          title: string
          view_count: number | null
        }
        Insert: {
          author_name?: string | null
          content: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string
          published_at?: string
          target_audience?: string
          tenant_id?: string | null
          title: string
          view_count?: number | null
        }
        Update: {
          author_name?: string | null
          content?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string
          published_at?: string
          target_audience?: string
          tenant_id?: string | null
          title?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_configs: {
        Row: {
          checkpoints: Json | null
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          expected_deliverables: string[] | null
          features: Json | null
          id: string
          overview: Json
          rubric: Json
          skill_id: string
          status: Database["public"]["Enums"]["capstone_status"] | null
          tenant_id: string | null
          time_estimate: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          checkpoints?: Json | null
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          expected_deliverables?: string[] | null
          features?: Json | null
          id?: string
          overview: Json
          rubric: Json
          skill_id: string
          status?: Database["public"]["Enums"]["capstone_status"] | null
          tenant_id?: string | null
          time_estimate?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          checkpoints?: Json | null
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          expected_deliverables?: string[] | null
          features?: Json | null
          id?: string
          overview?: Json
          rubric?: Json
          skill_id?: string
          status?: Database["public"]["Enums"]["capstone_status"] | null
          tenant_id?: string | null
          time_estimate?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capstone_configs_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capstone_configs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_instances: {
        Row: {
          config_id: string | null
          created_at: string | null
          id: string
          progress: Json | null
          roadmap: Json | null
          skill_id: string
          status: Database["public"]["Enums"]["instance_status"] | null
          template_id: string | null
          tenant_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          config_id?: string | null
          created_at?: string | null
          id?: string
          progress?: Json | null
          roadmap?: Json | null
          skill_id: string
          status?: Database["public"]["Enums"]["instance_status"] | null
          template_id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          config_id?: string | null
          created_at?: string | null
          id?: string
          progress?: Json | null
          roadmap?: Json | null
          skill_id?: string
          status?: Database["public"]["Enums"]["instance_status"] | null
          template_id?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capstone_instances_config_id_fkey"
            columns: ["config_id"]
            isOneToOne: false
            referencedRelation: "capstone_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capstone_instances_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capstone_instances_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "capstone_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capstone_instances_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_submissions: {
        Row: {
          description: string | null
          feedback: string | null
          grade: number | null
          graded_at: string | null
          graded_by: string | null
          id: string
          instance_id: string
          metadata: Json | null
          submission_type: Database["public"]["Enums"]["submission_type"]
          submission_url: string | null
          submitted_at: string | null
          title: string | null
        }
        Insert: {
          description?: string | null
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          instance_id: string
          metadata?: Json | null
          submission_type: Database["public"]["Enums"]["submission_type"]
          submission_url?: string | null
          submitted_at?: string | null
          title?: string | null
        }
        Update: {
          description?: string | null
          feedback?: string | null
          grade?: number | null
          graded_at?: string | null
          graded_by?: string | null
          id?: string
          instance_id?: string
          metadata?: Json | null
          submission_type?: Database["public"]["Enums"]["submission_type"]
          submission_url?: string | null
          submitted_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capstone_submissions_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "capstone_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      capstone_templates: {
        Row: {
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          is_active: boolean | null
          overview: Json
          skill_id: string
          tags: string[] | null
          tenant_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          is_active?: boolean | null
          overview: Json
          skill_id: string
          tags?: string[] | null
          tenant_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          is_active?: boolean | null
          overview?: Json
          skill_id?: string
          tags?: string[] | null
          tenant_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capstone_templates_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capstone_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      career_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_global: boolean | null
          name: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_global?: boolean | null
          name: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_global?: boolean | null
          name?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      career_goal_skills: {
        Row: {
          career_goal_id: string
          created_at: string | null
          id: string
          skill_id: string
        }
        Insert: {
          career_goal_id: string
          created_at?: string | null
          id?: string
          skill_id: string
        }
        Update: {
          career_goal_id?: string
          created_at?: string | null
          id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "career_goal_skills_career_goal_id_fkey"
            columns: ["career_goal_id"]
            isOneToOne: false
            referencedRelation: "career_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_goal_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      career_goals: {
        Row: {
          category_id: string
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          duration_max_months: number
          duration_min_months: number
          icon: string | null
          id: string
          is_active: boolean | null
          is_global: boolean | null
          long_description: string | null
          name: string
          short_description: string | null
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          duration_max_months: number
          duration_min_months: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          long_description?: string | null
          name: string
          short_description?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          duration_max_months?: number
          duration_min_months?: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          long_description?: string | null
          name?: string
          short_description?: string | null
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_goals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "career_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "career_goals_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          content_type: string
          content_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          skill_id: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          tenant_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_type: string
          content_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          skill_id?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tenant_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_type?: string
          content_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          skill_id?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tenant_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          career_goal_id: string
          created_at: string | null
          id: string
          selected_skills: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          career_goal_id: string
          created_at?: string | null
          id?: string
          selected_skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          career_goal_id?: string
          created_at?: string | null
          id?: string
          selected_skills?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_career_goal_id_fkey"
            columns: ["career_goal_id"]
            isOneToOne: false
            referencedRelation: "career_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_sessions: {
        Row: {
          completed: boolean | null
          content_item_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          progress_percentage: number | null
          session_end: string | null
          session_start: string | null
          user_id: string
          watch_time_seconds: number | null
        }
        Insert: {
          completed?: boolean | null
          content_item_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          progress_percentage?: number | null
          session_end?: string | null
          session_start?: string | null
          user_id: string
          watch_time_seconds?: number | null
        }
        Update: {
          completed?: boolean | null
          content_item_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          progress_percentage?: number | null
          session_end?: string | null
          session_start?: string | null
          user_id?: string
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_sessions_content_item_id_fkey"
            columns: ["content_item_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          announcement_notifications: boolean | null
          assignment_notifications: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          grade_notifications: boolean | null
          id: string
          push_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          announcement_notifications?: boolean | null
          assignment_notifications?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          grade_notifications?: boolean | null
          id?: string
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          announcement_notifications?: boolean | null
          assignment_notifications?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          grade_notifications?: boolean | null
          id?: string
          push_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          available_from: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          engagement_score: number | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          phone: string | null
          preferred_role: string | null
          salary_expectation: number | null
          streak_days: number | null
          tenant_id: string | null
          total_watch_time_hours: number | null
          updated_at: string | null
        }
        Insert: {
          available_from?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          engagement_score?: number | null
          id: string
          is_active?: boolean | null
          location?: string | null
          name: string
          phone?: string | null
          preferred_role?: string | null
          salary_expectation?: number | null
          streak_days?: number | null
          tenant_id?: string | null
          total_watch_time_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          available_from?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          engagement_score?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          phone?: string | null
          preferred_role?: string | null
          salary_expectation?: number | null
          streak_days?: number | null
          tenant_id?: string | null
          total_watch_time_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_progress: {
        Row: {
          average_quiz_score: number | null
          capstone_project_requested: boolean | null
          completed_at: string | null
          id: string
          overall_progress_percent: number | null
          skill_id: string
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          average_quiz_score?: number | null
          capstone_project_requested?: boolean | null
          completed_at?: string | null
          id?: string
          overall_progress_percent?: number | null
          skill_id: string
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          average_quiz_score?: number | null
          capstone_project_requested?: boolean | null
          completed_at?: string | null
          id?: string
          overall_progress_percent?: number | null
          skill_id?: string
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_progress_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_hours: number | null
          id: string
          is_active: boolean | null
          is_global: boolean | null
          name: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          name: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"] | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          is_global?: boolean | null
          name?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      student_certifications: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          date_awarded: string
          id: string
          issuing_body: string
          name: string
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          date_awarded: string
          id?: string
          issuing_body: string
          name: string
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          date_awarded?: string
          id?: string
          issuing_body?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          category: string
          description: string
          id: string
          priority: string
          responses: Json | null
          status: string
          submitted_at: string
          tenant_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          description: string
          id?: string
          priority?: string
          responses?: Json | null
          status?: string
          submitted_at?: string
          tenant_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          description?: string
          id?: string
          priority?: string
          responses?: Json | null
          status?: string
          submitted_at?: string
          tenant_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profile_with_role: {
        Row: {
          available_from: string | null
          avatar_url: string | null
          created_at: string | null
          email: string
          engagement_score: number | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          phone: string | null
          preferred_role: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          role_created_at: string | null
          role_tenant_id: string | null
          salary_expectation: number | null
          streak_days: number | null
          tenant_id: string | null
          total_watch_time_hours: number | null
          updated_at: string | null
        }
        Insert: {
          available_from?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email: string
          engagement_score?: number | null
          id: string
          is_active?: boolean | null
          location?: string | null
          name: string
          phone?: string | null
          preferred_role?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          role_created_at?: string | null
          role_tenant_id?: string | null
          salary_expectation?: number | null
          streak_days?: number | null
          tenant_id?: string | null
          total_watch_time_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          available_from?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          engagement_score?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          phone?: string | null
          preferred_role?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          role_created_at?: string | null
          role_tenant_id?: string | null
          salary_expectation?: number | null
          streak_days?: number | null
          tenant_id?: string | null
          total_watch_time_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_with_role_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_with_role_role_tenant_id_fkey"
            columns: ["role_tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_with_role_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          tenant_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          tenant_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_engagement_score: {
        Args: { user_id: string }
        Returns: number
      }
      get_current_user_tenant: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_platform_owners: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          email: string
          name: string
          user_id: string
        }[]
      }
      get_user_profile_robust: {
        Args: { user_id: string }
        Returns: Json
      }
      get_user_profile_with_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          available_from: string
          avatar_url: string
          created_at: string
          email: string
          engagement_score: number
          id: string
          is_active: boolean
          location: string
          name: string
          phone: string
          preferred_role: string
          role: Database["public"]["Enums"]["user_role"]
          role_created_at: string
          role_tenant_id: string
          salary_expectation: number
          streak_days: number
          tenant_id: string
          total_watch_time_hours: number
          updated_at: string
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_role_safe: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["user_role"][]
      }
      get_user_tenant: {
        Args: { _user_id: string }
        Returns: string
      }
      has_current_user_role: {
        Args: { role_name: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      has_platform_owner: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_watch_time: {
        Args: { additional_seconds: number; user_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_platform_owner: {
        Args: Record<PropertyKey, never> | { _user_id: string }
        Returns: boolean
      }
      is_tenant_admin: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
      promote_to_platform_owner: {
        Args: { _user_id: string }
        Returns: undefined
      }
      test_profile_access: {
        Args: { test_user_id: string }
        Returns: Json
      }
      update_user_streak: {
        Args: { user_id: string }
        Returns: number
      }
    }
    Enums: {
      capstone_status: "Draft" | "Published" | "Archived"
      content_status: "Draft" | "Review" | "Published" | "Archived"
      difficulty_level: "Beginner" | "Intermediate" | "Advanced"
      instance_status:
        | "Active"
        | "Completed"
        | "Submitted"
        | "Graded"
        | "Paused"
      notification_type:
        | "info"
        | "success"
        | "warning"
        | "error"
        | "assignment"
        | "grade"
        | "announcement"
      submission_type: "repo" | "report" | "demo" | "assignment"
      user_role: "platform_owner" | "tenant_admin" | "student"
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
      capstone_status: ["Draft", "Published", "Archived"],
      content_status: ["Draft", "Review", "Published", "Archived"],
      difficulty_level: ["Beginner", "Intermediate", "Advanced"],
      instance_status: ["Active", "Completed", "Submitted", "Graded", "Paused"],
      notification_type: [
        "info",
        "success",
        "warning",
        "error",
        "assignment",
        "grade",
        "announcement",
      ],
      submission_type: ["repo", "report", "demo", "assignment"],
      user_role: ["platform_owner", "tenant_admin", "student"],
    },
  },
} as const

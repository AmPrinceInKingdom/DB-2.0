export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone: string | null
          avatar_url: string | null
          role: "customer" | "seller" | "admin"
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: "customer" | "seller" | "admin"
          is_active?: boolean
        }
        Update: {
          full_name?: string | null
          email?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: "customer" | "seller" | "admin"
          is_active?: boolean
        }
      }

      categories: {
        Row: {
          id: string
          parent_id: string | null
          name: string
          slug: string
          description: string | null
          image_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
        }
        Update: {
          name?: string
          slug?: string
        }
      }

      products: {
        Row: {
          id: string
          seller_id: string | null
          category_id: string | null
          name: string
          slug: string
          short_description: string | null
          description: string | null
          sku: string | null
          price: number
          compare_at_price: number | null
          stock_quantity: number
          status: "draft" | "active" | "archived"
          is_featured: boolean
          thumbnail_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          slug: string
          price: number
        }
        Update: {
          name?: string
          price?: number
        }
      }

      carts: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
      }

      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
      }

      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          subtotal: number
          total_amount: number
          order_status: string
          payment_status: string
          created_at: string
          updated_at: string
        }
      }

      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          unit_price: number
          quantity: number
          line_total: number
          created_at: string
        }
      }

      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
      }

      addresses: {
        Row: {
          id: string
          user_id: string
          recipient_name: string
          phone: string
          address_line_1: string
          city: string
          country: string
          created_at: string
          updated_at: string
        }
      }

      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          is_primary: boolean
          created_at: string
        }
      }
    }
  }
}
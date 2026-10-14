/**
 * TypeScript Data Type Definitions for Core Domain Entities
 */

export interface WeightOption {
  label: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryName?: string;
  price: number;
  originalPrice?: number;
  image: string;
  weights: WeightOption[];
  badge?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  shelfLife?: string;
  origin?: string;
  stock?: number;
  status?: 'Active' | 'Inactive';
  active?: boolean;
}

export interface OrderItem {
  id?: string;
  productId?: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  discount_amount?: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refund_pending' | 'refunded';
  items_json: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discount_percent: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  active: boolean;
  expiry_date?: string;
}

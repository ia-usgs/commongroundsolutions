export type PaymentMethod = "zelle" | "venmo";

export type SignupFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  payment_method: PaymentMethod;
  notes: string;
};

export type SignupRow = {
  id: string;
  class_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  payment_method: string;
  reference_code: string;
  status: string; // 'pending' | 'confirmed' | 'cancelled'
  notes: string | null;
  created_at: string;
  expires_at: string;
};

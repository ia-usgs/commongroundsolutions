// Class instance = a scheduled occurrence of a course (DB row in `classes` table).
export type ClassRow = {
  id: string;
  slug: string;
  name: string;
  status: string; // 'open' | 'sold_out' | 'tba' | 'closed'
  capacity: number;
  class_date: string;
  price_cents: number;
  course_key: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
};

export type SeatCount = {
  class_id: string;
  confirmed_count: number;
  pending_count: number;
};

export type SeatAvailability = {
  remaining: number;
  capacity: number;
  full: boolean;
};

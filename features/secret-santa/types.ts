export interface SantaGroup {
  id: string;
  code: string;
  name: string;
  note: string | null;
  budget_amount: number | null;
  exchange_date: string | null;
  status: "open" | "drawn";
  drawn_at: string | null;
  created_at: string;
}

export interface SantaGroupPreview {
  name: string;
  note: string | null;
  budget_amount: number | null;
  exchange_date: string | null;
  status: "open" | "drawn";
  participant_count: number;
  organizer_name: string | null;
}

/** Organiser's view of a participant. The personal token is deliberately not readable. */
export interface SantaParticipant {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface SantaExclusion {
  participant_a: string;
  participant_b: string;
}

export interface SantaWish {
  id: string;
  name: string;
  url: string | null;
  price: number | null;
  image_url: string | null;
  notes: string | null;
}

export interface SantaView {
  group: Pick<SantaGroup, "code" | "name" | "note" | "budget_amount" | "exchange_date" | "status">;
  me: { id: string; name: string };
  participants: { id: string; name: string; is_me: boolean }[];
  my_wishes: SantaWish[];
  match: { name: string; wishes: SantaWish[] } | null;
}

export interface DrawResult {
  ok: true;
  emailConfigured: boolean;
  emailed: number;
  failed: number;
  /** Why sends failed (distinct, up to 3), e.g. "Resend 403: domain not verified". */
  emailErrors?: string[];
  participants: number;
}

export interface NewGroupInput {
  name: string;
  note?: string;
  budget?: string;
  exchangeDate?: string;
}

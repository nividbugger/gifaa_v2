// All Secret Santa data access. The generated Database types intentionally don't include santa_*
// (so removing the feature never touches generated files), hence the untyped client.

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { parsePrice } from "@/shared/gift-payload";
import type {
  DrawResult, NewGroupInput, SantaExclusion, SantaGroup, SantaGroupPreview, SantaParticipant, SantaView, SantaWish,
} from "./types";

const db = () => getSupabaseBrowserClient() as unknown as SupabaseClient;

const FRIENDLY_ERRORS: Record<string, string> = {
  not_found: "We couldn't find that. The link may be wrong or the group was removed.",
  group_closed: "The names have already been drawn, so this group is closed to new people.",
  group_full: "This group is full.",
  already_joined: "That email has already joined this group. Use the personal link you received, or ask the organiser to resend it.",
  too_many_wishes: "That's the maximum number of wishes. Remove one to add another.",
  already_drawn: "The names have already been drawn.",
  not_enough_participants: "You need at least 3 people to draw names.",
  impossible_constraints: "Those \"don't match\" rules make a draw impossible. Remove a rule and try again.",
  not_drawn: "The names haven't been drawn yet.",
};

/** Postgres exceptions and function errors both carry our short codes; turn them into readable text. */
export function friendlyError(error: unknown): string {
  const raw = error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String((error as { message: unknown }).message) : String(error);
  const code = Object.keys(FRIENDLY_ERRORS).find((key) => raw.includes(key));
  return code ? FRIENDLY_ERRORS[code]! : "Something went wrong. Please try again.";
}

async function unwrap<T>(result: PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
  const { data, error } = await result;
  if (error) throw error instanceof Error ? error : new Error(String((error as { message?: string }).message ?? error));
  return data as T;
}

// ---- Organiser (signed in) -------------------------------------------------------------------

export async function createGroup(organizerId: string, input: NewGroupInput): Promise<SantaGroup> {
  return unwrap(
    db().from("santa_groups").insert({
      organizer_id: organizerId,
      name: input.name.trim(),
      note: input.note?.trim() || null,
      budget_amount: parsePrice(input.budget),
      exchange_date: input.exchangeDate || null,
    }).select("*").single()
  );
}

export const listMyGroups = (organizerId: string): Promise<SantaGroup[]> =>
  unwrap(db().from("santa_groups").select("*").eq("organizer_id", organizerId).order("created_at", { ascending: false }));

export const getGroup = (id: string): Promise<SantaGroup> =>
  unwrap(db().from("santa_groups").select("*").eq("id", id).single());

export const listParticipants = (groupId: string): Promise<SantaParticipant[]> =>
  unwrap(db().from("santa_participants").select("id, user_id, name, email, phone, created_at").eq("group_id", groupId).order("created_at"));

export const removeParticipant = async (id: string): Promise<void> => {
  await unwrap(db().from("santa_participants").delete().eq("id", id));
};

export const listExclusions = (groupId: string): Promise<SantaExclusion[]> =>
  unwrap(db().from("santa_exclusions").select("participant_a, participant_b").eq("group_id", groupId));

export const addExclusion = async (groupId: string, a: string, b: string): Promise<void> => {
  await unwrap(db().from("santa_exclusions").insert({ group_id: groupId, participant_a: a, participant_b: b }));
};

export const removeExclusion = async (a: string, b: string): Promise<void> => {
  await unwrap(db().from("santa_exclusions").delete().eq("participant_a", a).eq("participant_b", b));
};

/** Runs on the server (edge function) so the matches never reach the browser. */
export async function runOrganizerAction(groupId: string, action: "draw" | "notify"): Promise<DrawResult> {
  const { data, error } = await db().functions.invoke("santa-draw", { body: { groupId, action } });
  if (error) {
    // supabase-js hides the JSON body of non-2xx responses inside error.context
    const context = (error as { context?: Response }).context;
    const body = context ? await context.json().catch(() => null) : null;
    throw new Error(body?.error ?? error.message);
  }
  return data as DrawResult;
}

// ---- Participant (personal link, no account needed) ------------------------------------------

export const getGroupPreview = (code: string): Promise<SantaGroupPreview | null> =>
  unwrap(db().rpc("santa_group_preview", { p_code: code }));

export const joinGroup = (code: string, name: string, email: string, phone?: string): Promise<string> =>
  unwrap(db().rpc("santa_join", { p_code: code, p_name: name, p_email: email, p_phone: phone || null }));

export const getView = (token: string): Promise<SantaView> => unwrap(db().rpc("santa_view", { p_token: token }));

export const addWish = (token: string, wish: Omit<SantaWish, "id" | "price"> & { price: string }): Promise<string> =>
  unwrap(
    db().rpc("santa_add_wish", {
      p_token: token,
      p_name: wish.name,
      p_url: wish.url,
      p_price: parsePrice(wish.price),
      p_image_url: wish.image_url,
      p_notes: wish.notes,
    })
  );

export const deleteWish = async (token: string, wishId: string): Promise<void> => {
  await unwrap(db().rpc("santa_delete_wish", { p_token: token, p_wish_id: wishId }));
};

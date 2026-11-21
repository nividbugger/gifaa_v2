// Secret Santa organiser actions that need the service role:
//   { groupId, action: "draw" }    run the draw, store matches, email everyone their personal link
//   { groupId, action: "notify" }  re-send the emails for an already-drawn group
// Matches are written with the service role into a table that no client can read.
//
// Email uses the shared sender (supabase/functions/_shared/email). Secrets: RESEND_API_KEY (optional),
// EMAIL_FROM, EMAIL_REPLY_TO, SITE_URL.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { drawAssignments } from "./draw.ts";
import { createEmailSenderFromEnv, sendBatch, siteUrlFromEnv } from "../_shared/email/sender.ts";
import { buildMatchEmail } from "./match-email.ts";

const MIN_PARTICIPANTS = 3;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const siteUrl = siteUrlFromEnv(Deno.env);
  const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const sender = createEmailSenderFromEnv(Deno.env);

  // Identify the caller from their own JWT; never trust a user id sent in the body.
  const caller = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: request.headers.get("Authorization") ?? "" } },
  });
  const { data: userData } = await caller.auth.getUser();
  if (!userData.user) return json({ error: "unauthorized" }, 401);

  let body: { groupId?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  if (!body.groupId || (body.action !== "draw" && body.action !== "notify")) return json({ error: "bad_request" }, 400);

  const { data: group } = await admin.from("santa_groups").select("*").eq("id", body.groupId).maybeSingle();
  if (!group || group.organizer_id !== userData.user.id) return json({ error: "not_found" }, 404);

  const { data: participants } = await admin
    .from("santa_participants")
    .select("id, name, email, token")
    .eq("group_id", group.id);
  if (!participants) return json({ error: "server_error" }, 500);

  if (body.action === "draw") {
    if (group.status !== "open") return json({ error: "already_drawn" }, 409);
    if (participants.length < MIN_PARTICIPANTS) return json({ error: "not_enough_participants", min: MIN_PARTICIPANTS }, 422);

    const { data: exclusions } = await admin.from("santa_exclusions").select("participant_a, participant_b").eq("group_id", group.id);
    const matches = drawAssignments(
      participants.map((p) => p.id),
      (exclusions ?? []).map((e) => [e.participant_a, e.participant_b] as const)
    );
    if (!matches) return json({ error: "impossible_constraints" }, 422);

    // Flip status first with a compare-and-set so two simultaneous clicks can't both draw.
    const { data: locked } = await admin
      .from("santa_groups")
      .update({ status: "drawn", drawn_at: new Date().toISOString() })
      .eq("id", group.id)
      .eq("status", "open")
      .select("id");
    if (!locked?.length) return json({ error: "already_drawn" }, 409);

    const rows = [...matches].map(([giver_id, receiver_id]) => ({ giver_id, receiver_id, group_id: group.id }));
    const { error: insertError } = await admin.from("santa_assignments").insert(rows);
    if (insertError) {
      await admin.from("santa_groups").update({ status: "open", drawn_at: null }).eq("id", group.id);
      return json({ error: "server_error" }, 500);
    }
  } else if (group.status !== "drawn") {
    return json({ error: "not_drawn" }, 409);
  }

  // Email is best-effort: the draw has already succeeded, and everyone can reveal via their link regardless.
  const { sent: emailed, failed } = sender.configured
    ? await sendBatch(
        sender,
        participants.map((p) =>
          buildMatchEmail({
            to: p.email,
            participantName: p.name,
            groupName: group.name,
            link: `${siteUrl}/santa/me/${p.token}`,
            budget: group.budget_amount,
            exchangeDate: group.exchange_date,
          })
        )
      )
    : { sent: 0, failed: 0 };

  return json({ ok: true, emailConfigured: sender.configured, emailed, failed, participants: participants.length });
});

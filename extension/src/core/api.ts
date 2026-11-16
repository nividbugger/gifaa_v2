// Thin PostgREST client. Row-level security on the user's JWT is what authorises every call,
// exactly as in the web app.

import { buildGiftInsert, type GiftFormValues } from "@shared/gift-payload";
import { config } from "./config";
import type { Session } from "./session";

export interface RegistrySummary {
  id: string;
  title: string;
  share_token: string | null;
  occasion: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
  get isAuthError() {
    return this.status === 401 || this.status === 403;
  }
}

async function request(session: Session, path: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(`${config.supabase.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.supabase.anonKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  if (!response.ok) throw new ApiError(response.status, `Request failed (${response.status})`);
  return response;
}

export async function listRegistries(session: Session): Promise<RegistrySummary[]> {
  const query = `registries?select=id,title,share_token,occasion&user_id=eq.${session.userId}&order=created_at.desc`;
  return (await request(session, query)).json();
}

export async function addGift(session: Session, registryId: string, values: GiftFormValues): Promise<void> {
  await request(session, "registry_gifts", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(buildGiftInsert(registryId, values)),
  });
}

export function registryUrl(registry: Pick<RegistrySummary, "share_token">): string {
  return `${config.siteUrl}/registry/${registry.share_token}/edit`;
}

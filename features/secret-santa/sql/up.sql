-- Secret Santa (seasonal feature). Run in the Supabase SQL editor. Undo with down.sql.
-- Everything is prefixed `santa_` so removal is a single script.
--
-- Secrecy model:
--   * Matches live in santa_assignments, which has RLS enabled and NO policies: only the
--     service role (the santa-draw edge function) can read or write it.
--   * Participants identify themselves with a private `token` (their personal link). The
--     organizer can read the participant list but the `token` column is excluded from their grants,
--     so they can never open someone else's link or see a match.
--   * Everything participants do goes through the SECURITY DEFINER functions below.

create table public.santa_groups (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  organizer_id  uuid not null references auth.users(id) on delete cascade,
  name          text not null check (char_length(name) between 1 and 80),
  note          text check (note is null or char_length(note) <= 500),
  budget_amount numeric check (budget_amount is null or budget_amount >= 0),
  exchange_date date,
  status        text not null default 'open' check (status in ('open', 'drawn')),
  drawn_at      timestamptz,
  created_at    timestamptz not null default now()
);

create table public.santa_participants (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.santa_groups(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,
  name       text not null check (char_length(name) between 1 and 60),
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone      text check (phone is null or char_length(phone) <= 20),
  token      uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);
create unique index santa_participants_group_email on public.santa_participants (group_id, lower(email));

create table public.santa_exclusions (
  participant_a uuid not null references public.santa_participants(id) on delete cascade,
  participant_b uuid not null references public.santa_participants(id) on delete cascade,
  group_id      uuid not null references public.santa_groups(id) on delete cascade,
  primary key (participant_a, participant_b),
  check (participant_a <> participant_b)
);

create table public.santa_assignments (
  giver_id    uuid primary key references public.santa_participants(id) on delete cascade,
  receiver_id uuid not null references public.santa_participants(id) on delete cascade,
  group_id    uuid not null references public.santa_groups(id) on delete cascade
);

create table public.santa_wishes (
  id             uuid primary key default gen_random_uuid(),
  group_id       uuid not null references public.santa_groups(id) on delete cascade,
  participant_id uuid not null references public.santa_participants(id) on delete cascade,
  name           text not null check (char_length(name) between 1 and 200),
  url            text check (url is null or url ~* '^https?://'),
  price          numeric check (price is null or price >= 0),
  image_url      text check (image_url is null or image_url ~* '^https?://'),
  notes          text check (notes is null or char_length(notes) <= 300),
  created_at     timestamptz not null default now()
);

alter table public.santa_groups       enable row level security;
alter table public.santa_participants enable row level security;
alter table public.santa_exclusions   enable row level security;
alter table public.santa_assignments  enable row level security;  -- no policies: service role only
alter table public.santa_wishes       enable row level security;  -- no policies: via functions only

create policy "organizer manages own groups" on public.santa_groups
  for all to authenticated
  using (organizer_id = auth.uid()) with check (organizer_id = auth.uid());

create policy "organizer reads participants" on public.santa_participants
  for select to authenticated
  using (exists (select 1 from public.santa_groups g where g.id = group_id and g.organizer_id = auth.uid()));

create policy "organizer removes participants before the draw" on public.santa_participants
  for delete to authenticated
  using (exists (select 1 from public.santa_groups g
                 where g.id = group_id and g.organizer_id = auth.uid() and g.status = 'open'));

create policy "organizer manages exclusions before the draw" on public.santa_exclusions
  for all to authenticated
  using (exists (select 1 from public.santa_groups g where g.id = group_id and g.organizer_id = auth.uid() and g.status = 'open'))
  with check (exists (select 1 from public.santa_groups g where g.id = group_id and g.organizer_id = auth.uid() and g.status = 'open'));

-- Column-level privileges: the organizer must never be able to read `token`.
revoke all on public.santa_participants from anon, authenticated;
grant select (id, group_id, user_id, name, email, phone, created_at) on public.santa_participants to authenticated;
grant delete on public.santa_participants to authenticated;
-- Defence in depth: anonymous visitors only ever use the functions below, never the tables.
revoke all on public.santa_groups, public.santa_exclusions from anon;
revoke all on public.santa_assignments from anon, authenticated;
revoke all on public.santa_wishes from anon, authenticated;

-- ---------------------------------------------------------------------------------------------
-- Participant-facing functions (callable without an account; the token is the credential)
-- ---------------------------------------------------------------------------------------------

create or replace function public.santa_group_preview(p_code text)
returns json language sql security definer set search_path = public stable as $$
  select json_build_object(
    'name', g.name, 'note', g.note, 'budget_amount', g.budget_amount,
    'exchange_date', g.exchange_date, 'status', g.status,
    'participant_count', (select count(*) from santa_participants p where p.group_id = g.id),
    'organizer_name', (select display_name from profiles where id = g.organizer_id))
  from santa_groups g where g.code = p_code;
$$;

create or replace function public.santa_join(p_code text, p_name text, p_email text, p_phone text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  g santa_groups; existing uuid; new_token uuid;
begin
  select * into g from santa_groups where code = p_code;
  if not found then raise exception 'not_found'; end if;

  -- A signed-in user re-joining proves who they are, so hand back their existing link.
  if auth.uid() is not null then
    select token into existing from santa_participants where group_id = g.id and user_id = auth.uid();
    if existing is not null then return existing; end if;
  end if;

  if g.status <> 'open' then raise exception 'group_closed'; end if;
  if (select count(*) from santa_participants where group_id = g.id) >= 50 then raise exception 'group_full'; end if;
  -- An email that already joined must not be able to retrieve that person's link (it would reveal their match).
  if exists (select 1 from santa_participants where group_id = g.id and lower(email) = lower(trim(p_email))) then
    raise exception 'already_joined';
  end if;

  insert into santa_participants (group_id, user_id, name, email, phone)
  values (g.id, auth.uid(), trim(p_name), trim(p_email), nullif(trim(coalesce(p_phone, '')), ''))
  returning token into new_token;
  return new_token;
end $$;

create or replace function public.santa_view(p_token uuid)
returns json language plpgsql security definer set search_path = public stable as $$
declare
  me santa_participants; g santa_groups; result json; receiver santa_participants;
begin
  select * into me from santa_participants where token = p_token;
  if not found then raise exception 'not_found'; end if;
  select * into g from santa_groups where id = me.group_id;

  if g.status = 'drawn' then
    select p.* into receiver from santa_assignments a join santa_participants p on p.id = a.receiver_id where a.giver_id = me.id;
  end if;

  select json_build_object(
    'group', json_build_object('code', g.code, 'name', g.name, 'note', g.note,
             'budget_amount', g.budget_amount, 'exchange_date', g.exchange_date, 'status', g.status),
    'me', json_build_object('id', me.id, 'name', me.name),
    'participants', (select coalesce(json_agg(json_build_object('id', p.id, 'name', p.name, 'is_me', p.id = me.id) order by p.created_at), '[]'::json)
                     from santa_participants p where p.group_id = g.id),
    'my_wishes', (select coalesce(json_agg(w order by w.created_at), '[]'::json)
                  from (select id, name, url, price, image_url, notes, created_at from santa_wishes where participant_id = me.id) w),
    'match', case when receiver.id is null then null else json_build_object(
      'name', receiver.name,
      'wishes', (select coalesce(json_agg(w order by w.created_at), '[]'::json)
                 from (select id, name, url, price, image_url, notes, created_at from santa_wishes where participant_id = receiver.id) w)) end
  ) into result;
  return result;
end $$;

create or replace function public.santa_add_wish(p_token uuid, p_name text, p_url text default null,
  p_price numeric default null, p_image_url text default null, p_notes text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare me santa_participants; new_id uuid;
begin
  select * into me from santa_participants where token = p_token;
  if not found then raise exception 'not_found'; end if;
  if (select count(*) from santa_wishes where participant_id = me.id) >= 10 then raise exception 'too_many_wishes'; end if;
  insert into santa_wishes (group_id, participant_id, name, url, price, image_url, notes)
  values (me.group_id, me.id, trim(p_name), nullif(trim(coalesce(p_url, '')), ''), p_price,
          nullif(trim(coalesce(p_image_url, '')), ''), nullif(trim(coalesce(p_notes, '')), ''))
  returning id into new_id;
  return new_id;
end $$;

create or replace function public.santa_delete_wish(p_token uuid, p_wish_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from santa_wishes w using santa_participants p
  where w.id = p_wish_id and w.participant_id = p.id and p.token = p_token;
end $$;

grant execute on function public.santa_group_preview(text) to anon, authenticated;
grant execute on function public.santa_join(text, text, text, text) to anon, authenticated;
grant execute on function public.santa_view(uuid) to anon, authenticated;
grant execute on function public.santa_add_wish(uuid, text, text, numeric, text, text) to anon, authenticated;
grant execute on function public.santa_delete_wish(uuid, uuid) to anon, authenticated;

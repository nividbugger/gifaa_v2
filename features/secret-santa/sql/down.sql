-- Removes every Secret Santa database object. Safe to run more than once.
drop function if exists public.santa_delete_wish(uuid, uuid);
drop function if exists public.santa_add_wish(uuid, text, text, numeric, text, text);
drop function if exists public.santa_view(uuid);
drop function if exists public.santa_join(text, text, text, text);
drop function if exists public.santa_group_preview(text);
drop table if exists public.santa_wishes;
drop table if exists public.santa_assignments;
drop table if exists public.santa_exclusions;
drop table if exists public.santa_participants;
drop table if exists public.santa_groups;

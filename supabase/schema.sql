-- Qashtota schema. Built for several brands and branches from day one.
-- Run once in a new Supabase project (SQL editor). Nothing here touches other projects.

create table brands (
  id text primary key,                 -- 'qashtota'
  name jsonb not null                  -- {"he": "...", "ar": "...", "en": "...", "ru": "..."}
);

create table branches (
  id text primary key,                 -- 'haifa'
  brand_id text not null references brands(id),
  name jsonb not null,
  address jsonb,
  phone text,
  order_url text                       -- Haat link once known
);

create table categories (
  id text not null,
  branch_id text not null references branches(id),
  name jsonb not null,
  sort int not null default 0,
  primary key (branch_id, id)
);

create table products (
  id text not null,                    -- 'M01'
  branch_id text not null references branches(id),
  category_id text not null,
  slug text not null,
  name jsonb not null,
  price numeric(8,2) not null,
  photo text,
  active boolean not null default true,
  sort int not null default 0,
  primary key (branch_id, id),
  foreign key (branch_id, category_id) references categories(branch_id, id)
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  brand_id text not null references brands(id) default 'qashtota',
  name text,
  birthday date,
  role text not null default 'customer' check (role in ('customer', 'staff', 'owner')),
  branch_id text references branches(id),   -- staff: the branch they work at
  created_at timestamptz not null default now()
);

create table loyalty_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  branch_id text references branches(id),
  points int not null,                 -- positive = earned, negative = redeemed
  amount numeric(8,2),                 -- purchase total in shekels
  reason text not null,                -- 'purchase', 'welcome', 'birthday', 'reward'
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table rewards (
  id text primary key,
  brand_id text not null references brands(id),
  name jsonb not null,
  cost int not null,                   -- points
  active boolean not null default true
);

-- New user: profile + 50 welcome points.
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id) values (new.id);
  insert into loyalty_ledger (user_id, points, reason) values (new.id, 50, 'welcome');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create function is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'owner'));
$$;

-- Staff adds a purchase: 1 shekel = 1 point, tier bonus applied.
create function add_purchase(p_customer uuid, p_amount numeric) returns int language plpgsql security definer set search_path = public as $$
declare total int; pts int; bonus numeric;
begin
  if not is_staff() then raise exception 'not allowed'; end if;
  select coalesce(sum(points) filter (where points > 0), 0) into total from loyalty_ledger where user_id = p_customer;
  bonus := case when total >= 1500 then 1.2 when total >= 500 then 1.1 else 1 end;
  pts := floor(p_amount * bonus);
  insert into loyalty_ledger (user_id, branch_id, points, amount, reason, created_by)
  values (p_customer, (select branch_id from profiles where id = auth.uid()), pts, p_amount, 'purchase', auth.uid());
  return pts;
end $$;

alter table brands enable row level security;
alter table branches enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table profiles enable row level security;
alter table loyalty_ledger enable row level security;
alter table rewards enable row level security;

create policy "public read" on brands for select using (true);
create policy "public read" on branches for select using (true);
create policy "public read" on categories for select using (true);
create policy "public read" on products for select using (true);
create policy "public read" on rewards for select using (active);
create policy "staff write" on products for all using (is_staff()) with check (is_staff());
create policy "own profile" on profiles for select using (id = auth.uid() or is_staff());
create policy "own profile update" on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = 'customer');
create policy "own ledger" on loyalty_ledger for select using (user_id = auth.uid() or is_staff());

insert into brands values ('qashtota', '{"he":"קשטוטה","ar":"قشطوطة","en":"Qashtota","ru":"Каштота"}');
insert into branches (id, brand_id, name, phone) values ('haifa', 'qashtota', '{"he":"חיפה","ar":"حيفا","en":"Haifa","ru":"Хайфа"}', '052-909-0978');

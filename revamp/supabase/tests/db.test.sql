\set ON_ERROR_STOP 1
-- Two customers
insert into auth.users values ('11111111-1111-1111-1111-111111111111','a@test'),('22222222-2222-2222-2222-222222222222','b@test');

create function pg_temp.expect_error(sql text, fragment text) returns void language plpgsql as $$
begin
  begin execute sql; exception when others then
    if position(fragment in sqlerrm) = 0 then raise exception 'expected "%" but got "%"', fragment, sqlerrm; end if;
    return;
  end;
  raise exception 'expected error "%" from: %', fragment, sql;
end $$;
grant execute on function pg_temp.expect_error(text,text) to authenticated, anon;

-- ---- A creates projects as herself
set role authenticated; select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);
insert into projects (name, data) values ('A1','{"pages":[{"id":"p1"}]}'),('A2','{}'),('A3','{}');
select pg_temp.expect_error($$insert into projects (name) values ('A4')$$, 'PROJECT_LIMIT');
select pg_temp.expect_error($$update projects set data='{"pages":[1,2,3,4]}' where name='A1'$$, 'PAGE_LIMIT');
update projects set data='{"pages":[1,2,3]}' where name='A1';
select pg_temp.expect_error($$insert into projects (owner,name) values ('22222222-2222-2222-2222-222222222222','sneaky')$$, 'row-level security');
-- A cannot grant herself Pro or AI credit
select pg_temp.expect_error($$insert into subscriptions (user_id,status) values ('11111111-1111-1111-1111-111111111111','active')$$, 'permission denied');
select pg_temp.expect_error($$select ai_reserve('11111111-1111-1111-1111-111111111111','luna')$$, 'permission denied');
select pg_temp.expect_error($$update ai_usage set used=0$$, 'permission denied');
do $$ begin if (my_account()->>'plan') <> 'free' or (my_account()->>'projects')::int <> 3 then raise exception 'my_account wrong: %', my_account(); end if; end $$;

-- ---- B sees none of A's work and cannot change it
select set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',false);
do $$ begin if (select count(*) from projects) <> 0 then raise exception 'B can see A projects'; end if; end $$;
update projects set name='hacked'; delete from projects;
-- ---- anonymous visitors see nothing
reset role; set role anon; select set_config('request.jwt.claim.sub','',false);
do $$ begin if (select count(*) from projects) <> 0 then raise exception 'anon can see projects'; end if; end $$;
reset role;
do $$ begin if (select count(*) from projects where name='hacked') <> 0 or (select count(*) from projects) <> 3 then raise exception 'B modified A projects'; end if; end $$;

-- ---- Server (service role): allowances
set role service_role;
select pg_temp.expect_error($$select ai_reserve('11111111-1111-1111-1111-111111111111','sol')$$, 'ALLOWANCE_EXHAUSTED');  -- free: no Sol
do $$ declare r uuid; begin
  for i in 1..25 loop r := ai_reserve('11111111-1111-1111-1111-111111111111','luna'); end loop;
  perform ai_finish(r, false);                          -- failed reply is refunded
  r := ai_reserve('11111111-1111-1111-1111-111111111111','luna');
  perform ai_finish(r, true, 1200, 300);
  perform ai_finish(r, false);                          -- finishing twice does nothing
end $$;
select pg_temp.expect_error($$select ai_reserve('11111111-1111-1111-1111-111111111111','luna')$$, 'ALLOWANCE_EXHAUSTED');
do $$ begin if (select used from ai_usage where model='luna') <> 25 then raise exception 'usage should be 25'; end if; end $$;

-- ---- Upgrade to Pro: more projects, pages and Sol
insert into subscriptions (user_id,status,billing_interval) values ('11111111-1111-1111-1111-111111111111','active','year');
select ai_reserve('11111111-1111-1111-1111-111111111111','sol');
reset role; set role authenticated; select set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);
insert into projects (name, data) values ('A4','{"pages":[1,2,3,4,5]}');
do $$ begin if (my_account()->>'plan') <> 'pro' or (my_account()->'used'->>'sol')::int <> 1 then raise exception 'pro account wrong: %', my_account(); end if; end $$;

-- ---- Downgrade: existing work stays editable, but no new projects
reset role; update subscriptions set status='canceled';
set role authenticated;
update projects set name='A4 renamed' where name='A4';
select pg_temp.expect_error($$insert into projects (name) values ('A5')$$, 'PROJECT_LIMIT');
do $$ begin if (select count(*) from projects) <> 4 then raise exception 'downgrade lost projects'; end if; end $$;
reset role;
\echo ALL DATABASE CHECKS PASSED

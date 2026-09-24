#!/usr/bin/env bash
# Tests the migration on a throwaway local Postgres database.
# Usage: PGHOST=... PGPORT=... PGUSER=postgres ./run.sh
set -euo pipefail
cd "$(dirname "$0")"
DB=oakline_test_$$
psql -qX -d postgres -c "create database $DB" >/dev/null
trap 'psql -qX -d postgres -c "drop database if exists $DB" >/dev/null' EXIT
psql -qX -v ON_ERROR_STOP=1 -d $DB -f supabase-stub.sql >/dev/null
psql -qX -v ON_ERROR_STOP=1 -d $DB -f ../migrations/0001_oakline_core.sql >/dev/null
psql -qXAt -v ON_ERROR_STOP=1 -d $DB -f db.test.sql | grep -E "PASSED|ERROR" || true
# Concurrency: 60 simultaneous requests against a 25-request allowance must grant exactly 25.
psql -qX -d $DB -c "insert into auth.users values ('33333333-3333-3333-3333-333333333333','c@test')" >/dev/null
for i in $(seq 60); do psql -qXAt -d $DB -c "set role service_role; select ai_reserve('33333333-3333-3333-3333-333333333333','luna')" >/dev/null 2>&1 & done; wait
USED=$(psql -qXAt -d $DB -c "select used from ai_usage where user_id='33333333-3333-3333-3333-333333333333'")
REQS=$(psql -qXAt -d $DB -c "select count(*) from ai_requests where user_id='33333333-3333-3333-3333-333333333333'")
[ "$USED" = 25 ] && [ "$REQS" = 25 ] && echo "CONCURRENCY CHECK PASSED (60 parallel requests, 25 granted)" || { echo "CONCURRENCY FAILED used=$USED reqs=$REQS"; exit 1; }

# Teacher Account Provisioning

Teacher access is based on an individual `teacher_accounts` row and an eight-hour revocable server session. Teacher names and shared school passwords are not authentication credentials.

## Feature Gate

The account login path is disabled by default. The app keeps using the legacy shared-password login (`SETEUK_LOGIN_PASSWORD` + signed cookie) until you set `TEACHER_ACCOUNTS_ENABLED=true` in the runtime environment **after** completing the prerequisites below. Existing signed-cookie sessions keep working during the transition because session parsing supports both formats; they expire within 12 hours. Teacher data carries over automatically: account provisioning derives the same `teacherKey` (`school::name::subject` slug) the app already uses.

## Prerequisites

1. Apply `supabase/migrations/202607100001_teacher_accounts_and_sessions.sql` to the target Supabase project.
2. Set the service-role environment variables only in the trusted operator shell.
3. Choose a unique login ID and a password of at least 12 characters.

Required variables:

```text
TEACHER_LOGIN_ID
TEACHER_NAME
TEACHER_PASSWORD
TEACHER_ROLE=teacher|admin
SUPABASE_URL or SUPABASE_PROJECT_ID
SUPABASE_SECRET_KEY
```

Optional variables are `TEACHER_SCHOOL` (default `성호중학교`) and `TEACHER_SUBJECT` (default `담당 교과`).

Run:

```powershell
npm run provision:teacher
```

The command prints only non-sensitive account metadata. It never prints the supplied password or derived password hash. Re-running the command for the same school/login ID rotates the password and updates the role.

## Revocation

- Set `teacher_accounts.active = false` to disable login and invalidate the account on the next request.
- Delete rows from `teacher_sessions` for immediate session revocation.
- Changing the account role affects the next authenticated request because session lookup joins the live account row.

## Production Rollout Gate

Do not deploy the new login route until the migration is applied and at least one separately communicated admin account has been provisioned. Keep passwords out of SQL migrations, Git history, logs, and issue trackers.

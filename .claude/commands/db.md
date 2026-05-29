Read `/home/yamane/qualification_website/.env.local` to get `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_MANAGEMENT_API_KEY`.

Extract the project ref from the URL (the subdomain portion, e.g. `https://PROJECTREF.supabase.co` → `PROJECTREF`).

Then execute this SQL against the Supabase database:

```
$ARGUMENTS
```

Use the Supabase Management API via curl:

```bash
curl -s -X POST "https://api.supabase.com/v1/projects/PROJECTREF/database/query" \
  -H "Authorization: Bearer SUPABASE_MANAGEMENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "SQL_HERE"}'
```

Replace `PROJECTREF`, `SUPABASE_MANAGEMENT_API_KEY`, and `SQL_HERE` with the actual values. Escape the SQL properly for JSON.

Display the result in a readable format. If there's an error, show the full error message.

If `SUPABASE_MANAGEMENT_API_KEY` is not present in `.env.local`, tell the user to add it:
- Go to https://supabase.com/dashboard/account/tokens
- Generate a new token
- Add `SUPABASE_MANAGEMENT_API_KEY=<token>` to `.env.local`

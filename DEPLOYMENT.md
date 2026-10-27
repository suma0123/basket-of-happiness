# Vercel deployment

The production Prisma datasource is PostgreSQL. Create a PostgreSQL database, then add these environment variables to the Vercel project:

- `DATABASE_URL` (Neon pooled connection string)
- `DIRECT_URL` (Neon direct, non-pooled connection string for Prisma migrations)
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `ADMIN_SECRET_KEY`

Set Vercel's production app URL for `NEXT_PUBLIC_APP_URL`, use a strong private value for `JWT_SECRET` and `ADMIN_SECRET_KEY`, and use live Razorpay credentials only after enabling live payments in Razorpay.

The Vercel build command is configured in `vercel.json` to run `prisma migrate deploy` before `next build`. The database must be reachable during the build. Do not commit `.env` or paste secrets into source control.

The existing local SQLite database is not copied into PostgreSQL automatically. Export and migrate its data separately if it contains information that must be retained.

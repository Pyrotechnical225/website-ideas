# Switching on accounts, AI and payments

The code is ready. Each service below just needs its keys added to your hosting. Until a service is set up, the site keeps working without it: signed-out editing, local autosave and downloads always work.

**Never paste a secret key into a chat, email or the code.** Put keys only into your hosting's environment settings (secrets).

Your live site address is used below as `https://YOUR-SITE`. Right now that's `https://oakline-digital.abdellatif-salah.chatgpt.site`.

---

## Step 1: Database and accounts (Supabase)

Project: **Oakline** (`zxfocjopkxoansdjojfn`, London).

1. Open the project and go to **SQL Editor → New query**.
2. Paste the whole of `supabase/migrations/0001_oakline_core.sql`, then click **Run**. It should finish with "Success. No rows returned".
3. Go to **Authentication → Sign In / Providers → Email** and check:
   - **Confirm email** is on.
   - **Minimum password length** is 8.
4. Go to **Authentication → URL Configuration**:
   - **Site URL**: `https://YOUR-SITE`
   - **Redirect URLs**: add `https://YOUR-SITE/studio`
5. Go to **Project Settings → API Keys**. You need three values (copy them straight into your hosting, not into chat):

| Hosting secret name | Where to find it |
|---|---|
| `SUPABASE_URL` | Project URL, like `https://zxfocjopkxoansdjojfn.supabase.co` |
| `SUPABASE_ANON_KEY` | The **publishable** key (or the legacy `anon` key) |
| `SUPABASE_SERVICE_ROLE_KEY` | The **secret** key (or the legacy `service_role` key). Keep this private. |

> **Email before launch:** Supabase's built-in email only sends a few messages an hour and is meant for testing. Before real customers sign up, connect your own email sender under **Authentication → Emails → SMTP settings** (for example Resend or Postmark, using a domain you own).

## Step 2: AI suggestions (OpenAI)

1. At platform.openai.com, add a payment method under **Billing**, and set a **monthly budget limit** under **Limits** as a safety net.
2. Create an API key under **API keys** (a project key is best).
3. Check that your account can use the two models under **Limits → Models**. The defaults are `gpt-6-luna` and `gpt-6-sol`.
4. Add these to your hosting:

| Hosting secret name | Value |
|---|---|
| `OPENAI_API_KEY` | Your new key |
| `OAKLINE_LUNA_MODEL` | Only needed if Luna's model ID differs from `gpt-6-luna` |
| `OAKLINE_SOL_MODEL` | Only needed if Sol's model ID differs from `gpt-6-sol` |

AI needs Step 1 as well. Customers must be signed in with a confirmed email, and their allowance is counted in the database. Failed replies are refunded automatically.

## Step 3: Payments (Stripe): use Test mode first

1. In Stripe, turn on **Test mode**.
2. Go to **Product catalogue → Add product**, name it **Oakline Pro**, and give it two recurring prices in GBP:
   - £19.00 every month
   - £180.00 every year

   Copy both **price IDs** (they start with `price_`).
3. Go to **Settings → Billing → Customer portal** and switch it on. Allow customers to cancel and to switch between the two Pro prices.
4. Go to **Developers → Webhooks → Add endpoint**:
   - URL: `https://YOUR-SITE/api/billing/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **signing secret** (it starts with `whsec_`).
5. Add these to your hosting:

| Hosting secret name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | **Developers → API keys → Secret key** (`sk_test_…` while testing) |
| `STRIPE_WEBHOOK_SECRET` | The `whsec_…` signing secret |
| `STRIPE_PRICE_MONTHLY` | The £19/month price ID |
| `STRIPE_PRICE_YEARLY` | The £180/year price ID |

Pro only switches on when Stripe's webhook confirms payment. Reaching the "success" page isn't enough. When you're ready for real payments, repeat step 3 in **live mode** and swap in the live keys and price IDs. Decide how VAT is shown at checkout before going live.

## Step 4: Deploy and check

Build with `npm run build` and deploy `dist/` to the existing Sites project (`.openai/hosting.json` already points at it). Then test on the live site:

- [ ] Create an account, confirm it from the email, and sign in
- [ ] Reset your password from "Forgot your password?"
- [ ] Start a website: the top bar says "Saved to your account"
- [ ] Open it from another browser: it's in "Your projects"
- [ ] Ask for AI ideas: the Luna count goes down by one
- [ ] Upgrade with Stripe's test card `4242 4242 4242 4242`: the account shows **Pro** within a few seconds
- [ ] "Manage billing" opens Stripe's portal, and cancelling shows "Ends …"

## Optional settings

| Name | What it does |
|---|---|
| `PUBLIC_SITE_URL` | Forces the address used in Stripe return links (default: the address the visitor used) |
| `OAKLINE_DEV_ANON_AI=1` | **Local testing only.** Allows Luna without accounts. Never set it on the live site. |

# Oakline Creator: subscription and AI plan

Draft for discussion — 23 September 2026. These are proposed features and prices, not a statement of what is live today. No subscriptions, payments or AI services were activated by creating this plan.

## Product promise

Build a modern website from your own idea, with a flexible editor and optional AI assistance. Start with a blank canvas or import a supported existing project. AI offers directions and scoped changes; users decide what to apply. Download the result and host it elsewhere.

## Launch plans

| Feature | Free | Pro |
|---|---|---|
| Monthly subscription | £0 | £19/month |
| Annual subscription | — | £180/year, paid upfront (£15/month equivalent; £48 saving against 12 monthly payments) |
| Luna allowance | 25 requests/month | 1,000 requests/month |
| Sol allowance | None | 100 requests/month |
| Cloud projects | 3 active projects | 25 active projects |
| Pages per project | 3 | 25 |
| Uploaded asset storage | 100 MB per account | 2 GB per account |
| Blank-canvas visual editor | Included | Included |
| Manual styling, HTML/CSS editing, responsive previews | Included | Included |
| Supported HTML/project import | Included | Included |
| Standalone website and editable project downloads | Unlimited | Unlimited |
| Watermark on downloaded sites | None | None |
| Immediate undo/redo | Included | Included |
| Cloud save | Latest saved version | Latest saved version plus 30-day version history |
| Reusable user-created components and brand settings | Basic editing | Save and reuse across projects |
| AI suggestions and copy assistance | Luna | Luna and Sol |
| Screenshot-based design review and scoped code changes | Not included at launch | Sol, using its allowance |
| Help | Documentation and bug reporting | Documentation plus priority email support; no response-time SLA initially |

The user has approved including both Pro billing options at launch: £19/month or £180/year paid upfront. The annual price is equivalent to £15/month and saves £48 (approximately 21%) versus twelve monthly payments. Both options include the same Pro features and monthly allowances; annual payment does not grant all twelve months of AI allowance upfront. Confirm final checkout tax presentation and validate the end-to-end service before publishing either checkout option.

The paid plan sells more assistance, saved work and convenience. Core manual design tools and exports remain useful on Free. There are no compulsory templates or preset page layouts.

## Allowance rules

- A request is one submitted instruction producing one completed assistant response or one scoped change proposal. Follow-up messages count separately. Applying an existing proposal, undoing, editing manually and exporting do not consume AI requests.
- A Luna request and a Sol request use separate balances. Pro defaults to Luna, and users deliberately choose Sol for deeper work. Show the selected model and cost of one request before submission. Do not silently upgrade a Luna request to Sol.
- Allowances renew monthly. Paid renewals follow the subscription's monthly anniversary, including annual subscribers. Free accounts receive a monthly anniversary reset as well. No rollover initially.
- Failed, cancelled or unusable responses restore the customer's request allowance; provider costs still count against Oakline's internal spending budget. Bound any automatic retries.
- When a model's allowance is exhausted, pause that model until renewal. Pro users may continue with Luna while its balance remains. Manual editing, saving and downloads remain accessible. No automatic overage charges.
- Require a verified account for AI access. Enforce per-account limits, short-term rate limits and platform spending protection on the server. Track usage in a durable database, not browser storage or an in-memory counter.
- Initially bound each request to approximately 8,000 total input tokens and 2,000 total output tokens, including reasoning. The implementation must enforce provider token accounting, including any image inputs and system context. Oversized requests need trimming, a smaller selected scope, or a clearly explained rejection before generation.
- Full-site autonomous rebuilds and unbounded multi-step agents are outside the initial request definition. Scope Sol edits to a selected component or small section.
- On downgrade, users choose up to 3 active projects. Excess projects remain readable and downloadable, with further edits or uploads subject to Free limits. Do not automatically delete work upon downgrade.

## AI integration

Use the OpenAI Responses API server-side, with `gpt-6-luna` as the default and `gpt-6-sol` for Pro's deeper assistance. Keep provider credentials out of the client. The server checks the authenticated user's subscription and allowance for every request; the client cannot grant itself Pro access.

Luna handles briefing questions, suggested information hierarchy, copy, typography and spacing advice. Sol handles more involved critique and scoped HTML/CSS changes. Both follow the user's direction rather than forcing a full layout.

For each new or imported project, ask:

1. Are you creating a new website or editing an existing one?
2. What do you want to make or change?
3. Who is it for, and what should visitors do?
4. What visual direction, colours or references do you have in mind?

Allow users to skip optional questions and work manually. Import means supported files/projects initially; importing an arbitrary live URL or connecting to an external site's CMS is a separate future feature.

Send only the relevant brief, selected elements and a compact page summary. Add a current screenshot and styling context for visual review. Return validated suggestions or restricted edit operations; preview proposed edits and make them reversible. Do not execute arbitrary model-generated scripts in the editor.

Record model, billed token counts, status and estimated provider cost per request. Reserve allowances atomically before a call, then finalise or restore them after completion. Separate user-visible allowances from provider spend accounting. Limit retries and concurrency so repeated or simultaneous requests cannot bypass the budget.

## Cost check

Official standard text pricing checked on 23 September 2026:

- GPT-6 Luna: $0.10 per million input tokens and $0.50 per million output tokens. https://developers.openai.com/api/docs/models/gpt-6-luna
- GPT-6 Sol: $2 per million input tokens and $10 per million output tokens. https://developers.openai.com/api/docs/models/gpt-6-sol

| Usage scenario | Free: all 25 Luna requests | Pro: all 1,000 Luna + 100 Sol requests |
|---|---:|---:|
| 2,000 input + 500 billed output tokens/request | $0.01125 | $1.35 |
| 8,000 input + 2,000 billed output tokens/request | $0.045 | $5.40 |

These are arithmetic scenarios, not measured averages or an all-in spending guarantee. They assume standard uncached text rates and one call per completed request. Output includes reasoning. Image accounting, retries, failed calls, regional premiums, additional tools, taxes, foreign exchange, hosting, storage, payment fees, support and free-user acquisition costs must be measured separately. Do not infer profit by subtracting these USD figures from GBP subscription prices.

The agreed draft prices are £19/month and £180/year. Before taking payments, test representative briefs and inspect actual cost, latency, successful completion rate, edit quality and support burden. Size alone does not establish model quality.

## Build sequence

### Setup progress — 23 September 2026

- Created a new Supabase project named Oakline in the user-selected Pyrotechnical organisation (`kmrenenqohugevcnefnw`).
- Project reference: `zxfocjopkxoansdjojfn`; region: London (`eu-west-2`). Creation returned `ACTIVE_HEALTHY`.
- Supabase quoted $0/month for project creation. Future upgrades or additional services are separate.
- Dashboard: https://supabase.com/dashboard/project/zxfocjopkxoansdjojfn
- Project creation is complete; app tables, auth configuration, storage policies and the website connection are still to be implemented.
- Stripe connection needs reauthentication before billing setup. OpenAI provider connection is also still pending.

1. Accounts and durable projects: verified sign-in, ownership checks, cloud persistence, project/page/storage limits and export access.
2. AI foundation: Luna/Sol configuration, actual provider connection, structured responses, durable request accounting, token caps and spending controls.
3. Pro billing: one Oakline Pro product with two recurring GBP prices (£19 monthly and £180 yearly), subscription checkout, billing portal, verified payment events, server-side entitlements, renewals, cancellation and downgrade behaviour. Annual subscriptions need monthly allowance resets independent of annual invoices. Never grant access based only on a checkout return page.
4. Paid design features: screenshot review, reversible scoped edits, saved brand settings/components and version history.
5. Launch verification: free account flow, upgrade, AI limit exhaustion, concurrent requests, provider failure, renewal, cancellation, downgrade, export, mobile and keyboard accessibility.

The current assistant code already calls the Responses API for structured suggestions and defaults to `gpt-4.1-mini`; it needs updating and live validation. Its current in-memory rate limits do not implement subscription quotas. The subscription system, durable allowances and cloud features above are proposed work, not existing capabilities.

## Later additions

Consider optional AI top-ups only after collecting real usage costs. Keep hosted customer websites, custom domains, e-commerce, image generation, team collaboration and arbitrary-site migration outside the initial paid promise. Scope and price those services separately when their implementation and ongoing costs are understood. Downloaded websites can be hosted with the user's chosen provider.

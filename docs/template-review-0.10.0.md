# Template review — Dazzler 0.10.0

All 30 templates were reviewed against their intended use. The previous library relied heavily on interchangeable headings, short placeholder tables and repeated restaurant hero layouts. This revision gives each category a worked fictional scenario and the information or interaction that its audience needs.

## Document pairs (Word and HTML)

| Category | Context added | Layout / review |
|---|---|---|
| Professional | Launch status, milestone owners, budget, risk and sponsor decision | One-page weekly brief |
| Legal | Counsel question, evidence chronology, gaps, contract issues and research plan | Two-page memo; no invented authorities |
| Business | Defined scope, exclusions, phased deliverables, USD 12,000 fee, 40/40/20 payments and acceptance | Two-page proposal |
| Fun | Game-night schedule, RSVP, what to bring and access/house notes | One-page invitation |
| Family | Seven days of plans, pickups, dinners, shared jobs and shopping | Landscape weekly planner |
| Presentation | Pilot decision, options, measures, rollout and guardrails | Three-page landscape decision handout |
| School | Hypothesis, variables, method, explicitly illustrative results, limitations and reflection | Two-page project report |
| Marketing | Audience, message, approval owners, USD 3,000 allocation, production dates and measurement | Two-page campaign brief |
| Restaurant | Eight dishes in courses, preparation descriptions, prices and service/dietary notes | One-page Word menu; editorial HTML menu |
| Technical | RFC, delivery guarantees, event payload, failure matrix, acceptance and rollback | Two-page technical design |

## Interfaces

| ID | Context and working local behavior |
|---|---|
| webapp-workspace | Project progress, client/owner/deadline, pending decisions, search and new-project dialog |
| webapp-board | Sprint goal, six assigned tasks, priorities, points, assignee filter and stage movement |
| webapp-settings | Profile, notifications, regional settings, unsaved state, discard and local save |
| data-revenue | Gross/refunds/net reconciliation, order totals, period filter, chart, source table and matching CSV |
| data-operations | Support tickets, priority response targets, overdue count, queues, resolution and filtered CSV |
| restaurant-fine-dining | Botanical editorial layout, four-course tasting menu, price, service and visiting details |
| restaurant-cafe | Pickup details, product categories, quantities, subtotal and order review |
| restaurant-reservations | Service days, party size, preferred times, guest needs and request summary; closed days rejected |
| restaurant-menu | Ingredient-led menu, category/search/vegan filters and dietary guidance |
| business-portal | Client decision, versioned deliverables, review briefs, local approval/revision and milestone billing |

## Checks and boundaries

All ten native documents were rendered with installed Word to 17 PDF pages and visually reviewed. All twenty browser templates were reviewed at desktop and mobile widths; automated checks cover overflow, loaded fonts, JavaScript errors, data consistency and applicable interactions. Review found and fixed malformed assignee options, a body/grid class collision and mobile chart overflow. Measured simple-background text contrast passed; this is not complete accessibility certification.

The examples are fictional. UI changes exist only in memory and reset on reload. No real orders, bookings, messages, payments or approvals are submitted. Replace sample facts before delivery. Native fonts are referenced, not embedded. Platform package checks verify contents and helper execution; they do not establish model behavior in other AI hosts.

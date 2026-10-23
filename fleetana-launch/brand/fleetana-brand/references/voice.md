# Fleetana Voice (v2)

## Who is reading
An owner or operations manager whose day is interruptions. A driver is late, a vehicle won't start, a fuel bill looks wrong. They want the answer in one glance, often on a phone, standing in a yard.

## The five rules
1. **Say the thing, then stop.** If a sentence survives deleting its adjectives, delete them.
2. **Name the vehicle, not the asset.** Trucks, vans, pickups, buses, drivers. Never units, assets, nodes or entities.
3. **Numbers over adjectives, and only provable numbers.** "Flagged below 70% of its 30-day average" is right. "Cuts fuel costs 23%" is wrong unless we can show the data.
4. **Second person.** Your fleet, your drivers, your workshop.
5. **Errors explain and instruct.** Say what happened and what to do next.

No emoji and no exclamation marks. A Fleetana rewrite is almost always *shorter* than what it replaces.

## Claim discipline
These rules are learned from the launch reviews. Check every line against `product-truth.md`.

| Instead of | Write | Why |
|---|---|---|
| "alerts you", "notifies you", "30 days' notice" | "flags", "shows", "lists 30 days ahead" | Push goes out only for HIGH/CRITICAL issues and work orders pending approval (`lib/push.ts`) |
| "real-time", "sub-second" | "live", "on one live map" | The map refreshes about every 10 s |
| "service on time", "prevents breakdowns" | "service due by km, engine hours or date" | Reminders tell you; they don't act for you |
| "catches warranty claims" | "warranty periods on record, so you can check before you pay" | No claims workflow exists |
| "every fill-up gets an economy figure" | "every full fill with an odometer reading" | Partial fills and fills without an odometer get none |
| "predictive maintenance", "diagnostics", "route optimisation", "AI" | don't | None of these ship |
| a live map, idle time or driver scores with no qualifier | the same + **"Requires a GPS tracker"** | Tracker hardware is required |
| "free trial", "no setup fees" | "Sign up at fleetana.sa" | Billing isn't in the code |

Show pricing only when someone explicitly asks for it. When you do, show the plan contents next to it: Starter (SAR 299) excludes inspections and work orders.

## Signature lines (approved)
- Get your fleet off spreadsheets. / أخرج أسطولك من جداول البيانات.
- Your whole fleet. One place. / أسطولك كله. في مكان واحد.
- Built for Saudi fleets. / صُمّم للأساطيل السعودية.
- Where does your fleet's money go? / أين تذهب أموال أسطولك؟
- Find the leaks. Fix them. / اكشف الهدر، وأوقفه.
- Log the odometer. We flag the rest. / سجّل قراءة العداد، والباقي علينا.

## Banned vocabulary
leverage · synergy · seamless · cutting-edge · next-generation · revolutionary · AI-powered · real-time · state-of-the-art · operational drag · fleet matrix · supply chain network · asset coordinates · throughput · orchestration · robust · empower · unlock · game-changing · best-in-class · holistic · turnkey · frictionless · precision logistics

## Interface copy
- **Buttons say what happens:** "Add vehicle", "Log fuel", "Create work order". A confirmation repeats the action: "Work order created".
- **Empty states invite action:** "No vehicles yet. Add your first one to start tracking service and fuel."
- **Errors name the cause and the fix:** "Odometer reading is lower than the last one recorded (84,120 km). Check the number."
- **Alerts and notifications lead with the vehicle,** then the fact, then the age: "8834 ب ن م — engine on, stationary 41 minutes."

## Social captions
- The first line carries the hook, because only about 125 characters show.
- Then one or two plain sentences on what the product does, then where to go next.
- Instagram can't link in captions, so say "link in bio". LinkedIn takes the URL inline.
- Use 3–5 hashtags, always including #إدارة_الأساطيل and #FleetManagement. Skip tags so broad they add nothing (#السعودية).
- Every post gets alt text describing what is shown.

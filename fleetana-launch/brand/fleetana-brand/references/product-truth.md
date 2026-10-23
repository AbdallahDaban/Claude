# What Fleetana Actually Does (claims register)

Check every on-screen or written claim against this register. Source: the `fleetana-master` code, Oct 2026. Re-verify after major releases.

## Ships: say it plainly
| Feature | Exact behaviour | Code |
|---|---|---|
| Vehicle registry | Plate, VIN, make/model, type, driver, location, status (Active, In shop, Out of service, Sold, Retired), Istimara, insurance and Fahes expiry dates | `app/(app)/vehicles` |
| Service reminders / PM | Due by meter (km **or engine hours**) and/or time, whichever comes first. Statuses Upcoming, Due soon, Overdue. 36 default tasks seeded per organisation. | `lib/service-reminders.ts` |
| Fuel log + economy | km/L, calculated full fill to full fill. A fill is flagged **Low** when below **70%** of the vehicle's trailing **30-day** average. It needs an odometer reading and an earlier full fill. CSV import (fuel only) and export. | `lib/fuel-economy.ts` |
| Inspections | Custom forms. A failed item needs a note, can carry a photo, and **opens an issue automatically**. | `lib/actions/inspections.ts` |
| Issues | Priorities Low to Critical, comments, photos | `app/(app)/issues` |
| Work orders | WO-000123 numbering. Parts, labour and fee lines. **15% VAT**. Statuses Open → In progress → Pending approval → Completed/Cancelled. | `lib/work-orders.ts` |
| Parts | Stock per location, movements, reorder minimums, "low stock" filter | `app/(app)/parts` |
| Warranty | Period and status on parts, work orders and service entries ("active until …"; "N days left" when 30 or fewer remain). **No claims workflow.** | `lib/warranty.ts` |
| Documents on Home | Istimara, insurance and Fahes expiring within **30 days** | `app/(app)/dashboard` |
| Live map (**tracker**) | Pins Moving, Idle, Parked, No signal (after 15 min). Refreshes about every **10 s**. Trip replay. | `app/(app)/map` |
| Idle time (**tracker**) | Per trip and per day | `lib/telematics/trips.ts` |
| Driver performance (**tracker**) | Score = 100 − (harsh events/100 km × 2 + overspeed/100 km × 4 + collisions × 30). Bands: Excellent ≥90, Good ≥75, Fair ≥55, Poor. Unrated under 25 km. Periods of 7, 30 and 90 days. | `lib/telematics/driver-score.ts` |
| Roles | Admin, Manager, Technician, Driver, Vendor. Audit log for admins. | `prisma/schema.prisma` |
| Bilingual | Full Arabic and English with RTL, light and dark modes | `lib/i18n` |
| Saudi defaults | SAR, 15% VAT, km, litres, Asia/Riyadh time | `prisma/schema.prisma` |
| Push notifications | **Only** HIGH/CRITICAL issues and work orders pending approval, delivered to the mobile app | `lib/push.ts` |

## Partial or absent: don't claim
- **Driver/technician mobile app:** say "on the way".
- **Geofences:** absent.
- **Engine diagnostics, predictive maintenance, route optimisation, AI:** absent.
- **Sub-second tracking:** absent. Say "live".
- **Warranty claims workflow:** absent.
- **Vehicle document uploads:** absent.
- **CSV import beyond fuel:** absent.
- **A cross-module cost report or cost dashboard:** absent.
- **Billing, free trial, plan changes:** not in the code.
- **Notifications for reminders, fuel flags or expiries:** absent.

## Pricing (only when asked)
Pricing comes from the pricing page:
- **Starter:** SAR 299 a month. Up to 15 vehicles and 3 team members. Service and fuel tracking and reminders. **No inspections or work orders.**
- **Professional:** SAR 899 a month. Up to 50 vehicles and 15 team members. Adds digital inspections, work orders, fuel CSV import and receipts.
- **Enterprise:** custom.

VAT treatment of these prices is unconfirmed. Ask before stating it.

## Known inconsistencies to flag to the team
- The landing page claims sub-second latency, route optimisation and engine diagnostics. Its 98.4%, −14% and +8% figures are hard-coded decoration, not data.
- The FAQ says "no hardware to install". That's true except for GPS features.
- The pricing page's Enterprise contact is `sales@fleetana.com`; the rest of the site uses `@fleetana.sa`.
- In the Arabic UI, `daysLeftMany` reads "متبقي {n} يوم". It should be يومًا.

# LEEL Ride Platform

## Full Product, Technical, Security, Operations, and Delivery Documentation

Prepared for: LEEL Ride Project  
Prepared date: May 1, 2026  
Launch market: Abuja, Nigeria  
Initial operating fleet: 50 electric vehicles  
Document status: Strategic development blueprint  

---

## 1. Executive Summary

LEEL Ride is a premium electric taxi and mobility operations platform designed for Abuja. The company will operate its own electric vehicle fleet, employ its drivers directly, and give riders a high level of control over their ride experience. Riders will be able to book trips, view live driver arrival, set music preferences, request AC adjustment, share trips, trigger SOS alerts, make payments, and rate the service.

The first launch should focus on a web-first system that is easy for internal testers and early customers to access using URLs. The same backend will later support Android and iOS apps without rebuilding the entire platform.

The recommended first release includes:

- Admin Web App for company management and live operations.
- Driver Console Web App for company-employed drivers.
- Customer Web App / PWA for booking and ride control.
- Backend API for bookings, dispatch, safety, payments, and fleet operations.
- PostgreSQL/PostGIS database for business data and location intelligence.
- Realtime services for live trip tracking and dispatch updates.
- Secure audit logs and role-based access control.

The system should be built as a scalable modular platform, starting as a well-structured modular monolith and later split into independent services only when traffic and operational complexity justify it.

---

## 2. Business Vision

The goal is to build a premium EV taxi company where riders feel safer, more respected, and more in control than in ordinary ride-hailing services.

The core promise:

- Clean electric vehicles.
- Professional employed drivers.
- Premium comfort.
- Transparent trip tracking.
- Customer control over ride preferences.
- Strong safety monitoring.
- Reliable dispatch and support.
- Corporate-quality service standards.

This is not only a taxi app. It is a full fleet operations platform for an EV mobility company.

---

## 3. Confirmed Product Direction

The following decisions have been agreed during planning:

- Start with 50 vehicles.
- Launch first in Abuja.
- Drivers are company employees, not public freelancers.
- Drivers do not need a separate public driver app.
- Drivers will use a restricted Driver Console, preferably on company-provided phones or tablets.
- Admin team will operate from a web dashboard.
- Customers will first test and use a web app / PWA by URL.
- Android and iOS apps will come later after the tested user experience is proven.
- Backend, database, payment logic, dispatch logic, and trip logic will remain the same when mobile apps are built later.
- Only the customer-facing mobile frontend changes later.

---

## 4. Launch Scope

### 4.1 Phase 1 Scope

Phase 1 should include the core taxi operation:

- Customer registration and login.
- Customer ride booking.
- Pickup and destination selection.
- Ride category selection.
- Music preference selection.
- AC preference selection.
- Quiet ride preference.
- Live driver arrival tracking.
- Admin trip monitoring.
- Manual and semi-automatic dispatch.
- Driver Console for trip execution.
- Trip start and trip completion.
- Trip history.
- Fare calculation.
- Payment integration.
- Customer support workflow.
- SOS safety alert.
- Driver and vehicle management.
- Basic reporting.

### 4.2 Phase 2 Scope

Phase 2 should include stronger operational and premium features:

- Customer subscriptions.
- Corporate accounts.
- Staff transport packages.
- School transport packages.
- Multi-stop trips.
- Wait time billing.
- Hourly booking.
- Airport booking.
- Back-seat screen system.
- In-app advertising.
- In-vehicle screen advertising.
- Advanced maintenance module.
- Advanced analytics dashboard.

### 4.3 Phase 3 Scope

Phase 3 should include scale and expansion:

- Android customer app.
- iOS customer app.
- Automated dispatch optimization.
- Predictive maintenance.
- Charging station optimization.
- Rooftop LED ad management.
- Fleet expansion support.
- Multi-city expansion.
- API integrations with corporate clients.

---

## 5. Recommended Technology Stack

### 5.1 Final Recommended Stack

Admin Web App:

- Next.js
- React
- TypeScript

Customer Web App / PWA:

- Next.js
- React
- TypeScript

Driver Console:

- Next.js
- React
- TypeScript

Backend API:

- NestJS
- TypeScript

Database:

- PostgreSQL
- PostGIS extension for maps, GPS, zones, and distance calculations

Realtime:

- WebSockets
- Optional MQTT later for vehicle devices and tablets

Cache and background jobs:

- Redis
- BullMQ or similar queue system

Object storage:

- AWS S3, Cloudflare R2, DigitalOcean Spaces, or equivalent

Maps:

- Mapbox or Google Maps Platform

Payments:

- Paystack and/or Flutterwave
- MTN MoMo / MoMo PSB where commercially and technically suitable

Later mobile apps:

- React Native / Expo

### 5.2 Why This Stack Fits

This stack is suitable because:

- It uses TypeScript across web, backend, and later mobile.
- Next.js is excellent for web apps, admin dashboards, and PWAs.
- NestJS gives structure to a large backend.
- PostgreSQL is reliable for core business data.
- PostGIS is strong for location-based services.
- Redis supports fast realtime workflows and background processing.
- React Native / Expo later allows Android and iOS apps using the same ecosystem.

### 5.3 What Will Not Be Rebuilt Later

When Android and iOS apps are introduced, the following remain the same:

- Backend API.
- Database.
- Booking logic.
- Dispatch logic.
- Payment logic.
- Customer accounts.
- Driver records.
- Vehicle records.
- Trip records.
- Safety workflow.
- Admin dashboard.
- Driver Console.
- Reporting.

The later mobile app only replaces or complements the customer web frontend.

---

## 6. High-Level System Architecture

### 6.1 Architecture Diagram

```text
                         +----------------------+
                         |   Admin Web App      |
                         |   Operations Team    |
                         +----------+-----------+
                                    |
                                    |
                         +----------v-----------+
                         |                      |
+------------------+     |      Backend API     |     +------------------+
| Customer Web/PWA |---->|  NestJS + TypeScript |<----| Driver Console   |
| Riders           |     |                      |     | Employee Drivers |
+------------------+     +----------+-----------+     +------------------+
                                    |
                    +---------------+----------------+
                    |                                |
          +---------v---------+             +--------v---------+
          | PostgreSQL/PostGIS|             | Redis / Queues   |
          | Core Database     |             | Jobs + Cache     |
          +---------+---------+             +--------+---------+
                    |                                |
          +---------v---------+             +--------v---------+
          | Object Storage    |             | Realtime Gateway |
          | Files, Evidence   |             | WebSockets       |
          +-------------------+             +------------------+
                    |
          +---------v---------+
          | External Services |
          | Maps, SMS, Email, |
          | Payments, KYC     |
          +-------------------+
```

### 6.2 Architecture Principle

Start with a modular monolith backend. This means the backend is deployed as one application, but internally organized into clean modules. This reduces complexity during launch and still allows the system to scale later.

Recommended backend modules:

- Auth Module.
- User Module.
- Driver Module.
- Vehicle Module.
- Booking Module.
- Dispatch Module.
- Trip Module.
- Fare Module.
- Payment Module.
- Safety Module.
- Notification Module.
- Fleet Module.
- Maintenance Module.
- Support Module.
- Audit Module.
- Reporting Module.
- Advertising Module later.

---

## 7. Application Components

### 7.1 Admin Web App

The Admin Web App is the central control platform for the company.

Primary users:

- Super admin.
- Operations manager.
- Dispatch officer.
- Customer support officer.
- Finance officer.
- Fleet manager.
- Maintenance manager.
- Safety officer.
- Marketing/ad manager later.

Main functions:

- View live fleet map.
- Monitor active trips.
- View pending ride requests.
- Assign drivers.
- Reassign trips.
- Track driver route.
- View customer profile.
- View driver profile.
- View vehicle profile.
- Monitor SOS alerts.
- Manage payments and refunds.
- Manage complaints.
- Manage subscriptions later.
- Manage corporate accounts later.
- Generate reports.
- Review audit logs.

### 7.2 Driver Console

The Driver Console is a restricted web interface for employed drivers.

It should run on company-owned devices, preferably mounted safely in each vehicle.

Main functions:

- Login with staff account.
- View assigned trip.
- View pickup location.
- View destination.
- View route guidance link.
- View customer ride preferences.
- See music preference.
- See AC preference.
- See quiet ride request.
- Mark arrival.
- Start trip.
- End trip.
- Report issue.
- Contact dispatch.
- Trigger driver SOS.
- Receive dispatch instructions.

Drivers should not see unnecessary customer private data.

### 7.3 Customer Web App / PWA

The Customer Web App is the first customer-facing product.

It should be mobile-first and installable as a PWA.

Main functions:

- Register.
- Login.
- Verify phone number.
- Set profile.
- Book a ride.
- Select pickup.
- Select destination.
- Select ride class.
- Set music preference.
- Set AC preference.
- Request quiet ride.
- Track driver arrival.
- View driver and vehicle information.
- Pay for ride.
- Share trip.
- Trigger SOS.
- Rate trip.
- Report complaint.
- Report lost item.

### 7.4 Later Customer Mobile Apps

After web testing is stable, Android and iOS apps can be built using React Native / Expo.

Benefits:

- Better push notifications.
- Better GPS support.
- Better app-store presence.
- Better user retention.
- Smoother mobile experience.

The backend remains unchanged.

---

## 8. User Roles and Permissions

### 8.1 Customer

Can:

- Manage own profile.
- Book rides.
- View own trips.
- Pay for rides.
- Rate trips.
- Submit complaints.
- Trigger SOS during active trips.
- Share trip.

Cannot:

- See other customers.
- See internal dispatch notes.
- See driver private information.
- Modify fare or trip records.

### 8.2 Driver

Can:

- View own assigned trips.
- Update trip status.
- View customer ride preferences for active trip.
- Contact dispatch.
- Report issue.
- Trigger driver SOS.

Cannot:

- Pick arbitrary customers without assignment.
- See full customer records.
- Change fare.
- Delete trip history.
- View company-wide data.

### 8.3 Dispatch Officer

Can:

- View live ride requests.
- Assign and reassign drivers.
- Monitor active trips.
- Contact drivers.
- Contact customers through approved channels.
- Escalate incidents.

Cannot:

- Change system settings.
- Delete records.
- Access finance reports unless permitted.

### 8.4 Customer Support Officer

Can:

- View customer tickets.
- View trip summaries.
- Create support notes.
- Escalate complaints.
- Handle lost item reports.

Cannot:

- Override dispatch.
- Access full financial controls.

### 8.5 Fleet Manager

Can:

- Manage vehicles.
- Track maintenance.
- View vehicle mileage.
- View charging status later.
- Mark vehicle unavailable.
- Schedule inspections.

### 8.6 Finance Officer

Can:

- View payments.
- View refunds.
- Reconcile transactions.
- Export financial reports.
- Manage corporate billing later.

### 8.7 Super Admin

Can:

- Manage all roles.
- Configure platform settings.
- View full audit logs.
- Approve sensitive actions.

Super Admin access must use multi-factor authentication.

---

## 9. Customer Ride Control Features

### 9.1 Ride Preferences

Customers should be able to control the ride experience before pickup and during the trip.

Preferences:

- Music genre.
- No music.
- Quiet ride.
- AC level.
- Preferred cabin temperature.
- Conversation preference.
- Assistance required.
- Stop/wait request later.

### 9.2 Music Control

Supported options:

- Afrobeats.
- Gospel.
- Jazz.
- R&B.
- Instrumental.
- No music.
- Driver playlist.
- Customer Bluetooth request later.

Phase 1 implementation:

- Customer selects music preference.
- Driver Console displays the preference.
- Driver follows the request.

Phase 2 implementation:

- Back-seat screen can display music options.
- In-car media system integration can be explored.

### 9.3 AC Control

Direct AC control depends on the EV manufacturer and vehicle API access.

Phase 1 implementation:

- Customer selects AC preference:
  - Low.
  - Medium.
  - High.
  - Warmer.
  - Cooler.
  - Turn off.
- Driver Console receives the request.
- Driver adjusts AC.

Phase 2 implementation:

- If manufacturer provides safe climate API access, AC can be controlled from the customer screen or back-seat tablet.

Safety note:

- The system must not allow vehicle controls that affect driving safety unless officially supported by the manufacturer.

---

## 10. Booking and Trip Lifecycle

### 10.1 Normal Booking Flow

```text
Customer opens app
Customer logs in
Customer enters pickup
Customer enters destination
Customer selects ride class
Customer sets music and AC preference
System estimates fare and ETA
Customer confirms booking
Backend creates trip request
Dispatch assigns driver
Driver receives trip
Customer tracks driver arrival
Driver marks arrived
Customer enters vehicle
Driver starts trip
Trip is monitored live
Driver ends trip
Payment is captured or confirmed
Customer rates ride
Trip is archived
```

### 10.2 Dispatch Flow

Dispatch can be semi-automatic at launch.

The system recommends available drivers based on:

- Distance to pickup.
- Vehicle class.
- Driver duty status.
- Vehicle battery/availability later.
- Current workload.
- Safety/disciplinary status.

Dispatch officer can:

- Accept recommendation.
- Manually assign another driver.
- Reassign if delay occurs.
- Send backup vehicle if needed.

### 10.3 Trip Statuses

Recommended trip statuses:

- Draft.
- Requested.
- Searching.
- Assigned.
- Driver en route.
- Arrived.
- Passenger onboard.
- In progress.
- Waiting.
- Completed.
- Cancelled by customer.
- Cancelled by dispatch.
- Cancelled by driver with approval.
- Failed.
- Under review.

---

## 11. Safety and Security Features

### 11.1 Safety Goals

The system must protect:

- Customers.
- Drivers.
- Vehicles.
- Company staff.
- Company data.
- Payment records.
- Legal evidence.

### 11.2 Customer Safety

Customer safety features:

- Verified phone number.
- Trip sharing link.
- Live trip monitoring.
- Driver details before pickup.
- Vehicle details before pickup.
- Plate number confirmation.
- SOS button.
- Route deviation alert.
- Customer support contact.
- Complaint reporting.
- Lost item reporting.

### 11.3 Driver Safety

Driver safety features:

- Customer identity profile.
- Active trip record.
- Driver SOS.
- Dispatch monitoring.
- Incident report.
- Audio/video recording policy where legally approved.
- Emergency contact workflow.

### 11.4 Tracking Principles

The company should not treat tracking as unlimited surveillance.

Recommended policy:

- Customers are tracked only for active trip and safety-related workflows.
- Driver location is tracked when the driver is on duty.
- Company-owned vehicle location can be tracked at all times for asset protection.
- All tracking must be disclosed in privacy policy and terms of service.
- Staff access to tracking data must be audited.

### 11.5 Incident Investigation

If an incident occurs, the system should preserve:

- Trip ID.
- Customer ID.
- Driver ID.
- Vehicle ID.
- Pickup and destination.
- GPS path.
- Timestamps.
- SOS event logs.
- Support messages.
- Payment reference.
- Device information.
- Camera evidence if available.
- Admin actions taken.

Incident data should be placed under legal hold when necessary.

---

## 12. Security Architecture

### 12.1 Authentication

Customer authentication:

- Phone number OTP.
- Email optional.
- Password or passwordless login.
- Device recognition.

Admin authentication:

- Email and password.
- Multi-factor authentication.
- Strong password policy.
- Session timeout.
- IP/device alerts for suspicious login.

Driver authentication:

- Staff login.
- Device restriction where possible.
- Shift-based access.

### 12.2 Authorization

Use role-based access control:

- Customer.
- Driver.
- Dispatch.
- Support.
- Fleet.
- Finance.
- Admin.
- Super Admin.

Sensitive actions should require permission checks:

- Refund approval.
- Manual fare adjustment.
- User suspension.
- Driver suspension.
- Trip deletion should generally be blocked.
- Exporting reports.
- Viewing incident evidence.

### 12.3 Data Protection

Security controls:

- HTTPS everywhere.
- Passwords hashed using strong algorithms.
- Database encryption at rest where available.
- Object storage encryption.
- Secrets stored in secure environment variables.
- Payment card data handled only by payment providers, not stored directly.
- Audit logs for admin actions.
- Sensitive personal data access limited by role.
- Production database access restricted.

### 12.4 Application Security

Required controls:

- Input validation.
- API rate limiting.
- CSRF protection where needed.
- XSS prevention.
- SQL injection prevention through ORM/query parameterization.
- Secure CORS rules.
- Webhook signature verification.
- Idempotency keys for payments.
- Request logging.
- Error logging without exposing secrets.

### 12.5 Infrastructure Security

Required controls:

- Firewall rules.
- Private database networking where possible.
- Backups.
- Separate dev, staging, and production environments.
- Least-privilege cloud access.
- SSH key or SSO access control.
- Server patching.
- Monitoring alerts.
- Disaster recovery plan.

---

## 13. Privacy and Compliance

### 13.1 Nigeria Data Protection

The project should be designed to comply with Nigeria data protection expectations under the Nigeria Data Protection Act and applicable NDPC guidance.

Practical requirements:

- Clear privacy policy.
- Clear terms of service.
- Consent for location tracking.
- Disclosure of safety monitoring.
- Disclosure of recording where cameras/audio are used.
- Purpose limitation.
- Access control.
- Data retention policy.
- Customer data request process.
- Breach response process.

### 13.2 Camera and Audio Recording

If in-car recording is used:

- Riders must be clearly notified.
- Drivers must be clearly notified.
- Recording purpose must be safety and dispute resolution.
- Access must be restricted.
- Retention must be limited.
- Incident clips must be preserved under legal hold.

Legal review is recommended before audio recording because audio recording rules can be sensitive.

---

## 14. Data Storage and Retention Policy

The following retention schedule is recommended. Final retention periods should be reviewed by legal counsel and adjusted for Nigerian law, insurance requirements, tax requirements, and company policy.

### 14.1 Recommended Retention Schedule

Customer profile:

- Retain while account is active.
- Retain 5 years after account closure where required for legal, fraud, tax, or safety reasons.

Phone/email verification logs:

- 12 to 24 months.

Trip records:

- 7 years recommended for tax, disputes, insurance, and audit.

Payment records:

- 7 years recommended.

Invoices and receipts:

- 7 years recommended.

GPS route history:

- 12 to 24 months for normal trips.
- Longer if linked to incident, dispute, insurance, or legal hold.

Driver location while on duty:

- 12 to 24 months.

Vehicle location:

- 24 months for operational history.
- Longer for accident or insurance cases.

SOS and incident records:

- 5 to 7 years, or according to legal/insurance advice.

Support tickets:

- 3 to 5 years.

Admin audit logs:

- 3 to 7 years depending on sensitivity.

Camera/video footage:

- 30 to 90 days for normal footage.
- 3 to 7 years for incident footage under legal hold.

Application logs:

- 30 to 180 days for normal debug logs.
- Security logs retained 12 to 24 months.

Backups:

- Daily backups retained 30 to 35 days.
- Monthly backups retained 12 months.
- Critical archival backups retained longer if required.

### 14.2 Storage Design

Database storage:

- Customer, trip, driver, vehicle, payment, and operational records.

Object storage:

- Profile photos.
- Driver documents.
- Vehicle documents.
- Insurance documents.
- Receipts.
- Complaint attachments.
- Incident evidence.
- Exported reports.

Video storage:

- Should not be stored in the main database.
- Store in object storage or specialist video storage.
- Use lifecycle policies to delete normal footage automatically.

---

## 15. Database Design Overview

### 15.1 Core Tables

Recommended main tables:

- users.
- customer_profiles.
- drivers.
- staff_accounts.
- vehicles.
- vehicle_classes.
- bookings.
- trips.
- trip_locations.
- trip_events.
- ride_preferences.
- payments.
- refunds.
- wallets later.
- support_tickets.
- complaints.
- sos_events.
- driver_shifts.
- vehicle_status_logs.
- maintenance_records.
- audit_logs.
- notifications.
- corporate_accounts later.
- subscriptions later.
- advertising_campaigns later.

### 15.2 Important Data Relationships

```text
User -> Customer Profile -> Bookings -> Trips -> Payments

Staff Account -> Role -> Admin Actions -> Audit Logs

Driver -> Driver Shift -> Assigned Trips -> Trip Events

Vehicle -> Vehicle Status -> Maintenance Records -> Trip Assignments

Trip -> GPS Points -> Safety Events -> Support Tickets
```

### 15.3 Location Data

PostGIS should be used for:

- Pickup location.
- Destination location.
- Driver live location.
- Vehicle location.
- Service zones.
- Restricted zones.
- Airport zone.
- Distance calculations.
- Nearby driver lookup.
- Route deviation detection.

---

## 16. Realtime Tracking Design

### 16.1 Realtime Events

WebSocket events should include:

- driver.location.updated.
- trip.assigned.
- trip.driver_arriving.
- trip.driver_arrived.
- trip.started.
- trip.waiting.
- trip.completed.
- trip.cancelled.
- customer.preference.updated.
- sos.created.
- dispatch.message.sent.
- payment.status.updated.

### 16.2 GPS Update Frequency

Recommended launch approach:

- Driver/vehicle location update every 5 to 10 seconds during active trip.
- Driver/vehicle location update every 15 to 30 seconds while on duty but idle.
- Lower frequency if battery/data usage becomes an issue.

### 16.3 Map Accuracy

The system should display:

- Driver current location.
- Customer pickup.
- Destination.
- ETA.
- Trip route.
- Route deviation warning.

---

## 17. Payment System

### 17.1 Payment Options

Recommended payment methods:

- Card.
- Bank transfer.
- USSD where available.
- Wallet later.
- MTN MoMo / MoMo PSB where available.
- Corporate monthly invoice later.

### 17.2 Payment Providers

Recommended providers to evaluate:

- Paystack.
- Flutterwave.
- MTN MoMo / MoMo PSB.

Use more than one provider where possible to reduce dependency risk.

### 17.3 Payment Safety

Payment requirements:

- Webhook verification.
- Idempotency.
- Payment reference on every transaction.
- Reconciliation dashboard.
- Failed payment retry.
- Refund workflow.
- Finance approval for manual refund.
- No direct storage of card details.

### 17.4 Payment Timing

Possible options:

- Pre-authorize before trip, capture after trip.
- Pay before trip for fixed bookings.
- Pay after trip for trusted users/corporate accounts.

Recommended launch:

- Use upfront authorization or prepayment for ordinary customer rides.
- Use monthly invoicing for approved corporate clients later.

---

## 18. Fare and Pricing Engine

### 18.1 Pricing Inputs

Fare should consider:

- Ride class.
- Distance.
- Estimated duration.
- Base fare.
- Waiting time.
- Airport surcharge later.
- Peak demand later.
- Toll/parking fees if applicable.
- Corporate discount later.
- Subscription discount later.

### 18.2 Ride Classes

Initial classes:

- Regular.
- Comfort.
- VIP later or limited pilot.

With 50 vehicles, a practical starting distribution could be:

- 30 Regular.
- 15 Comfort.
- 5 VIP or executive vehicles.

This can be adjusted after procurement and demand analysis.

---

## 19. Fleet and Vehicle Management

### 19.1 Vehicle Records

Each vehicle should have:

- Vehicle ID.
- Manufacturer.
- Model.
- Year.
- Plate number.
- VIN.
- Ride class.
- Battery capacity.
- Insurance details.
- Warranty details.
- Current mileage.
- Status.
- Assigned driver.
- Maintenance history.
- Documents.

### 19.2 Vehicle Statuses

Recommended statuses:

- Available.
- Assigned.
- On trip.
- Charging.
- Cleaning.
- Maintenance.
- Inspection required.
- Out of service.
- Retired.

### 19.3 400,000 km Replacement Policy

The 400,000 km replacement rule should be part of the fleet policy, but not the only trigger.

Replacement should consider:

- Mileage.
- Battery health.
- Maintenance cost trend.
- Accident history.
- Interior condition.
- Downtime frequency.
- Customer complaints.
- Manufacturer recommendation.

### 19.4 Maintenance Alerts

System should alert for:

- Service interval due.
- Tyre inspection.
- Brake inspection.
- AC service.
- Battery health check.
- Software diagnostics.
- Insurance expiry.
- Roadworthiness expiry.

---

## 20. Charging Operations

### 20.1 Charging Status

The system should eventually track:

- Battery percentage.
- Estimated range.
- Charging status.
- Charger assigned.
- Charging start time.
- Charging completion estimate.
- Last full charge.

### 20.2 Launch Approach

If vehicle API is unavailable at launch, charging data can be entered manually by fleet staff or drivers through the Driver Console.

Later, integrate directly with:

- Manufacturer fleet API.
- Charger management system.
- IoT telemetry device.

### 20.3 Charging Readiness

Dispatch should avoid assigning vehicles that:

- Have low battery.
- Are due for charging.
- Cannot complete the estimated route safely.
- Are marked for inspection.

---

## 21. Admin Wireframes

### 21.1 Admin Dashboard

```text
+--------------------------------------------------------------+
| LEEL Ride Admin                    Alerts | User | Logout |
+-------------------+------------------------------------------+
| Sidebar           | Live Operations Overview                 |
| - Dashboard       |                                          |
| - Live Trips      |  Active Trips: 18   Available Cars: 24   |
| - Bookings        |  Charging: 5       Maintenance: 3        |
| - Drivers         |  SOS Alerts: 0      Pending Bookings: 4  |
| - Vehicles        |                                          |
| - Customers       | +--------------------------------------+ |
| - Payments        | | Live Map                             | |
| - Support         | | Vehicles, trips, pickup points       | |
| - Reports         | +--------------------------------------+ |
| - Settings        |                                          |
|                   | Recent Events                           |
|                   | Driver arrived | Trip started | Payment |
+-------------------+------------------------------------------+
```

### 21.2 Live Trip Monitor

```text
+--------------------------------------------------------------+
| Live Trip: TRIP-2026-000184                                  |
+------------------------------+-------------------------------+
| Map                          | Trip Details                  |
|                              | Customer: Ada O.              |
| Driver path                  | Driver: Musa A.               |
| Pickup marker                | Vehicle: BYD Sedan ABC-123    |
| Destination marker           | Status: Driver en route       |
|                              | ETA: 7 minutes                |
|                              | Music: Gospel                 |
|                              | AC: Cooler                    |
|                              | Safety: Normal                |
+------------------------------+-------------------------------+
| Actions: Contact Driver | Contact Customer | Reassign | SOS  |
+--------------------------------------------------------------+
```

### 21.3 Booking Queue

```text
+--------------------------------------------------------------+
| Pending Bookings                                             |
+------------+----------+----------+----------+----------------+
| Time       | Customer | Pickup   | Class    | Action         |
+------------+----------+----------+----------+----------------+
| 10:42 AM   | Ada O.   | Wuse 2   | Comfort  | Assign Driver  |
| 10:44 AM   | John K.  | Garki    | Regular  | Assign Driver  |
| 10:45 AM   | Fatima S.| Maitama  | VIP      | Assign Driver  |
+------------+----------+----------+----------+----------------+
```

---

## 22. Customer Web App Wireframes

### 22.1 Customer Home

```text
+--------------------------------+
| LEEL Ride                  |
| Safe premium electric rides    |
+--------------------------------+
| Pickup                         |
| [ Current location         v ] |
|                                |
| Destination                    |
| [ Where are you going?      ]  |
|                                |
| Ride Class                     |
| [ Regular ] [ Comfort ] [ VIP] |
|                                |
| [ Continue ]                   |
+--------------------------------+
```

### 22.2 Ride Preferences

```text
+--------------------------------+
| Ride Preferences               |
+--------------------------------+
| Music                          |
| [ Afrobeats ] [ Gospel ]       |
| [ Jazz ] [ R&B ]               |
| [ Instrumental ] [ No Music ]  |
|                                |
| AC Preference                  |
| [ Cooler ] [ Normal ] [ Warmer]|
|                                |
| Ride Style                     |
| [ Quiet Ride ] [ Conversation ]|
|                                |
| [ Confirm Ride ]               |
+--------------------------------+
```

### 22.3 Driver Arriving

```text
+--------------------------------+
| Driver Arriving                |
+--------------------------------+
| Map                            |
|                                |
| Musa A.                        |
| BYD Electric Sedan             |
| Plate: ABC-123                 |
| ETA: 6 minutes                 |
|                                |
| Music: Gospel                  |
| AC: Cooler                     |
|                                |
| [ Share Trip ] [ SOS ]         |
| [ Cancel Ride ]                |
+--------------------------------+
```

### 22.4 Active Trip

```text
+--------------------------------+
| Trip In Progress               |
+--------------------------------+
| Map and route                  |
| ETA: 18 minutes                |
| Distance left: 7.4 km          |
|                                |
| Preferences                    |
| Music: Gospel      [ Change ]  |
| AC: Cooler         [ Change ]  |
|                                |
| [ Share Trip ] [ SOS ]         |
+--------------------------------+
```

---

## 23. Driver Console Wireframes

### 23.1 Driver Active Assignment

```text
+--------------------------------+
| LEEL Driver Console           |
+--------------------------------+
| Assigned Trip                  |
| Customer: Ada O.               |
| Pickup: Wuse 2                 |
| Destination: Jabi Lake Mall    |
| Ride Class: Comfort            |
|                                |
| Customer Preferences           |
| Music: Gospel                  |
| AC: Cooler                     |
| Ride Style: Quiet              |
|                                |
| [ Open Route ]                 |
| [ Arrived ]                    |
| [ Contact Dispatch ]           |
+--------------------------------+
```

### 23.2 Trip In Progress

```text
+--------------------------------+
| Trip In Progress               |
+--------------------------------+
| Destination: Jabi Lake Mall    |
| ETA: 18 minutes                |
|                                |
| Customer Preferences           |
| Music: Gospel                  |
| AC: Cooler                     |
|                                |
| [ Waiting ] [ Report Issue ]   |
| [ End Trip ]                   |
+--------------------------------+
```

---

## 24. API Design Overview

### 24.1 API Style

Use REST for normal business actions and WebSockets for realtime updates.

REST is suitable for:

- Login.
- Registration.
- Booking.
- Payments.
- Reports.
- Profile management.
- Admin actions.

WebSockets are suitable for:

- Driver location.
- Trip status.
- Admin live map.
- Customer live tracking.
- SOS alerts.

### 24.2 Example REST Endpoints

Auth:

- POST /auth/register
- POST /auth/login
- POST /auth/verify-otp
- POST /auth/logout
- POST /auth/refresh

Customer:

- GET /customers/me
- PATCH /customers/me
- GET /customers/me/trips

Booking:

- POST /bookings/estimate
- POST /bookings
- GET /bookings/:id
- POST /bookings/:id/cancel

Trip:

- GET /trips/:id
- POST /trips/:id/start
- POST /trips/:id/end
- POST /trips/:id/wait
- POST /trips/:id/preferences

Admin:

- GET /admin/dashboard
- GET /admin/bookings/pending
- POST /admin/bookings/:id/assign
- POST /admin/trips/:id/reassign
- GET /admin/trips/live

Driver:

- GET /driver/current-trip
- POST /driver/trips/:id/arrived
- POST /driver/trips/:id/start
- POST /driver/trips/:id/end
- POST /driver/location

Payments:

- POST /payments/initialize
- POST /payments/webhook/paystack
- POST /payments/webhook/flutterwave
- GET /payments/:id

Safety:

- POST /sos
- GET /admin/sos
- POST /admin/sos/:id/resolve

### 24.3 API Security

API requirements:

- JWT or secure session tokens.
- Refresh token rotation.
- Role checks on every protected route.
- Request validation.
- Rate limits.
- Audit logs for sensitive actions.
- Webhook signature validation.

---

## 25. Notifications

### 25.1 Customer Notifications

Customer should receive:

- OTP.
- Booking confirmation.
- Driver assigned.
- Driver arriving.
- Driver arrived.
- Trip started.
- Trip completed.
- Payment receipt.
- Support response.

### 25.2 Driver Notifications

Driver should receive:

- New trip assignment.
- Trip cancelled.
- Customer preference changed.
- Dispatch message.
- Emergency alert.

### 25.3 Admin Notifications

Admin should receive:

- SOS alert.
- Route deviation.
- Trip delay.
- Payment failure.
- Vehicle unavailable.
- Driver issue.

### 25.4 Channels

Recommended channels:

- In-app realtime alerts.
- SMS for OTP and critical notices.
- Email for receipts and reports.
- Push notifications later for mobile apps.
- WhatsApp later if officially integrated and approved.

---

## 26. Hosting and Infrastructure

### 26.1 Environment Structure

Required environments:

- Development.
- Staging.
- Production.

Development:

- Used by developers.
- Test data only.

Staging:

- Used by testers and management.
- Should behave like production.
- Used for UAT before release.

Production:

- Real users.
- Real payments.
- Real trips.
- Strict access control.

### 26.2 Hosting Recommendation

Practical launch option:

- Next.js apps hosted on Vercel or cloud VM.
- NestJS API hosted on AWS, DigitalOcean, Render, Fly.io, or similar.
- PostgreSQL managed database.
- Redis managed service.
- Object storage on S3-compatible service.
- Cloudflare for DNS, SSL, WAF, and CDN.

For stronger production control:

- Use AWS or DigitalOcean with managed PostgreSQL.
- Use containerized deployments.
- Use CI/CD for controlled releases.

### 26.3 Deployment Architecture

```text
Developer pushes code
CI runs tests
CI builds app
Staging deploys automatically
QA tests staging
Approved release goes to production
Monitoring checks health
Rollback available if issue occurs
```

### 26.4 Availability Target

Launch target:

- 99.5% to 99.9% uptime.

Mature target:

- 99.9%+ uptime with better redundancy.

---

## 27. Cost Estimate

All costs are estimates and should be revalidated before purchase. Many providers bill in USD, and NGN equivalent depends on current exchange rate and payment channel.

### 27.1 Development Cost Estimate

Lean MVP:

- NGN 50m to NGN 90m.

Proper production launch system:

- NGN 120m to NGN 250m+.

Advanced full platform with in-car tablets, advertising, subscriptions, corporate portal, and deeper fleet automation:

- NGN 250m+ depending on scope and timeline.

These estimates cover software product development, not vehicle purchase, office, chargers, insurance, or operations.

### 27.2 Monthly Cloud and Software Cost Estimate

Testing / early staging:

- USD 100 to USD 500 per month.

Production launch:

- USD 700 to USD 3,500 per month.

Higher usage / stronger reliability:

- USD 5,000 to USD 15,000+ per month.

### 27.3 Cost Breakdown

Domain:

- USD 10 to USD 25 per year for common domains.

DNS/CDN/security:

- Free to USD 25+ per month at the beginning.
- Higher plans if advanced WAF/security is needed.

Admin/customer web hosting:

- Vercel or similar: from low monthly cost, often per user/team seat.
- VM hosting option: USD 20 to USD 200+ per month.

Backend servers:

- USD 50 to USD 600 per month at launch.
- More for high availability.

Managed PostgreSQL:

- USD 60 to USD 500 per month at launch.
- More as data and availability needs grow.

Redis:

- USD 15 to USD 200 per month at launch.

Object storage:

- USD 5 to USD 100 per month for normal files.
- Video evidence can increase this significantly.

Maps:

- USD 300 to USD 2,000+ per month depending on trip volume and provider.
- Can be lower in testing and higher at scale.

SMS/OTP:

- Highly variable.
- Global SMS providers can be expensive in Nigeria.
- Local SMS/OTP providers or WhatsApp options should be evaluated.

Monitoring/logging:

- USD 50 to USD 300 per month initially.

Payment processing:

- Percentage and fixed fees per transaction.
- Depends on provider and negotiation.

App store accounts later:

- Apple Developer Program: annual fee.
- Google Play Console: one-time registration fee.

### 27.4 Cost Control Strategy

To control cost:

- Start with web/PWA before app stores.
- Avoid heavy video uploads in early phase.
- Use local SMS provider if reliable.
- Cache maps and autocomplete responsibly.
- Store only necessary GPS points.
- Use object storage lifecycle deletion.
- Monitor map API usage daily.
- Keep staging smaller than production.

---

## 28. Build Roadmap

### 28.1 Stage 0 - Product and Technical Finalization

Duration:

- 1 to 2 weeks.

Deliverables:

- Final scope.
- User stories.
- UI/UX direction.
- Technical architecture.
- Data model.
- Security policy.
- Delivery plan.

### 28.2 Stage 1 - UI/UX Design

Duration:

- 2 to 4 weeks.

Deliverables:

- Admin dashboard designs.
- Driver Console designs.
- Customer web app designs.
- Mobile responsive designs.
- Design system.
- Clickable prototype.

### 28.3 Stage 2 - Backend Foundation

Duration:

- 3 to 5 weeks.

Deliverables:

- NestJS project setup.
- Database schema.
- Auth system.
- RBAC.
- Core modules.
- API documentation.
- Audit logging.
- CI/CD setup.

### 28.4 Stage 3 - Admin and Driver Console MVP

Duration:

- 4 to 6 weeks.

Deliverables:

- Admin login.
- Dashboard.
- Driver management.
- Vehicle management.
- Booking queue.
- Trip assignment.
- Driver Console.
- Live status updates.

### 28.5 Stage 4 - Customer Web/PWA MVP

Duration:

- 4 to 6 weeks.

Deliverables:

- Customer registration.
- Booking flow.
- Ride preferences.
- Fare estimate.
- Driver tracking.
- Payment.
- Trip history.
- Ratings.
- Complaints.

### 28.6 Stage 5 - Safety, Payments, and Realtime Hardening

Duration:

- 3 to 5 weeks.

Deliverables:

- SOS workflow.
- Payment webhooks.
- Reconciliation.
- Realtime trip tracking.
- Route deviation alert.
- Notifications.
- Monitoring.

### 28.7 Stage 6 - Testing and Pilot

Duration:

- 4 to 8 weeks.

Deliverables:

- Internal testing.
- Abuja road testing.
- Driver training.
- Dispatch team training.
- Payment testing.
- Load testing.
- Security testing.
- Pilot launch.

### 28.8 Stage 7 - Production Launch

Duration:

- 1 to 2 weeks after pilot approval.

Deliverables:

- Production deployment.
- Support playbook.
- Incident process.
- Monitoring dashboard.
- Launch reporting.

### 28.9 Stage 8 - Mobile Apps

Duration:

- 8 to 16 weeks after web flow is stable.

Deliverables:

- Android customer app.
- iOS customer app.
- Push notifications.
- App store submission.
- Mobile analytics.

---

## 29. Testing Strategy

### 29.1 Functional Testing

Test:

- Registration.
- OTP.
- Login.
- Booking.
- Driver assignment.
- Driver arrival.
- Trip start.
- Trip completion.
- Payment.
- Cancellation.
- SOS.
- Complaint.
- Admin actions.

### 29.2 Realtime Testing

Test:

- Location update speed.
- WebSocket reconnection.
- Trip status sync.
- Admin map updates.
- Customer tracking updates.
- Driver Console updates.

### 29.3 Load Testing

Initial test targets:

- 1,000 concurrent customers browsing.
- 200 concurrent active bookings.
- 100 active trips.
- 50 vehicles sending location updates.
- 20 admin/support users online.

Future test targets:

- 10,000 concurrent customers.
- 1,000 active trips.
- 1,000 vehicles.

### 29.4 Security Testing

Test:

- Unauthorized access.
- Role bypass attempts.
- API rate limits.
- OTP abuse.
- Payment webhook spoofing.
- SQL injection.
- XSS.
- Admin session hijacking.
- File upload abuse.

### 29.5 Field Testing

Field test in Abuja:

- CBD.
- Wuse.
- Garki.
- Maitama.
- Asokoro.
- Jabi.
- Utako.
- Airport Road.

Test:

- GPS accuracy.
- Network dropouts.
- Driver workflow.
- Customer pickup accuracy.
- Trip timing.
- AC/music preference process.
- Dispatch response time.

---

## 30. Monitoring and Support

### 30.1 Monitoring

Monitor:

- API uptime.
- API response time.
- Database performance.
- WebSocket health.
- Payment webhook failures.
- SMS delivery.
- Map API usage.
- Error rate.
- Failed logins.
- SOS alerts.
- Trip assignment delays.

### 30.2 Operational Dashboards

Admin should see:

- Active trips.
- Available cars.
- Delayed pickups.
- Payment failures.
- SOS events.
- Driver online count.
- Vehicle status.
- Customer complaints.

### 30.3 Incident Severity

Severity 1:

- SOS active.
- System down.
- Payment outage during operations.
- Security breach.

Severity 2:

- Major booking failure.
- Multiple trip tracking failures.
- Admin dashboard unavailable.

Severity 3:

- Minor UI bug.
- Single trip sync issue.
- Report export issue.

---

## 31. Team and Resources

### 31.1 Recommended Software Team

Minimum serious team:

- Product manager.
- UI/UX designer.
- Technical lead.
- Backend engineer.
- Frontend engineer.
- QA engineer.
- DevOps/cloud engineer part-time.

Stronger team:

- Product manager.
- UI/UX designer.
- Backend engineer 1.
- Backend engineer 2.
- Frontend engineer 1.
- Frontend engineer 2.
- QA automation engineer.
- DevOps/cloud engineer.
- Security consultant.
- Data analyst later.

### 31.2 Operations Team

Recommended launch operations:

- Operations manager.
- Dispatch officers.
- Customer support officers.
- Fleet manager.
- Maintenance coordinator.
- Finance/reconciliation officer.
- Driver supervisor.
- Safety/compliance officer.

---

## 32. Development Standards

### 32.1 Code Standards

Requirements:

- TypeScript strict mode.
- Consistent linting.
- Automated formatting.
- API validation.
- Unit tests for core logic.
- Integration tests for critical flows.
- Code review before merge.
- No secrets in code.

### 32.2 Git Workflow

Recommended branches:

- main for production.
- staging for UAT.
- feature branches for work.

Release process:

- Pull request.
- Code review.
- Automated tests.
- Staging deploy.
- QA approval.
- Production deploy.

### 32.3 Documentation Standards

Maintain:

- API documentation.
- Database schema documentation.
- Deployment guide.
- Admin user guide.
- Driver Console guide.
- Support playbook.
- Incident response guide.

---

## 33. Risks and Mitigation

### 33.1 GPS Accuracy Risk

Risk:

- Customer pickup and driver tracking may be inaccurate in some areas.

Mitigation:

- Use high-quality map provider.
- Allow pickup notes.
- Allow dispatch adjustment.
- Test Abuja zones heavily.

### 33.2 Network Reliability Risk

Risk:

- Driver devices may lose internet.

Mitigation:

- Reconnection logic.
- Offline-friendly Driver Console.
- SMS/phone fallback.
- Dispatch manual control.

### 33.3 Payment Failure Risk

Risk:

- Payment provider downtime.

Mitigation:

- Use more than one provider.
- Track unpaid trips.
- Reconciliation dashboard.
- Corporate invoicing later.

### 33.4 Security and Privacy Risk

Risk:

- Misuse of customer/driver tracking data.

Mitigation:

- RBAC.
- Audit logs.
- Staff training.
- Privacy policy.
- Data retention policy.
- Legal review.

### 33.5 Operational Discipline Risk

Risk:

- Drivers may not follow music/AC preferences or service standards.

Mitigation:

- Driver Console preference display.
- Customer ratings.
- Complaint workflow.
- Training.
- Supervisor review.

---

## 34. Future Features

Recommended future features:

- Corporate admin portal.
- School transport module.
- Subscription plans.
- Back-seat tablet app.
- QR code booking.
- Hotel and airport partner portals.
- In-app advertising.
- Back-seat screen advertising.
- Rooftop ad scheduling.
- Predictive maintenance.
- EV battery health analytics.
- AI dispatch optimization.
- Customer loyalty program.

---

## 35. Minimum Viable Product Definition

The MVP is successful when:

- Customers can register and book a ride.
- Admin can see and assign ride requests.
- Driver can receive trip details through Driver Console.
- Customer can track assigned driver.
- Driver can start and end trip.
- Customer can pay.
- Admin can monitor the trip.
- SOS can alert the control team.
- Trip history is stored.
- Staff actions are audited.
- The system works reliably with pilot vehicles.

---

## 36. Launch Readiness Checklist

Product:

- Customer booking tested.
- Driver Console tested.
- Admin dashboard tested.
- Payment tested.
- SOS tested.
- Trip tracking tested.

Operations:

- Drivers trained.
- Dispatch trained.
- Support trained.
- Incident response team ready.
- Vehicle assignment process ready.

Security:

- MFA enabled for admins.
- RBAC tested.
- Audit logs enabled.
- Backups enabled.
- Privacy policy published.
- Terms of service published.

Infrastructure:

- Production environment ready.
- Monitoring active.
- Alerts active.
- Backup restore tested.
- Rollback process tested.

Business:

- Fare rules approved.
- Refund policy approved.
- Driver conduct policy approved.
- Customer service scripts ready.
- Insurance and legal policies aligned.

---

## 37. Recommended Next Step

The next step after approving this documentation is to create the detailed product requirements and implementation tickets.

Recommended immediate deliverables:

- Final feature list for Phase 1.
- Final user roles.
- Final database schema.
- UI/UX wireframes in Figma.
- API specification.
- Development sprint plan.
- Cloud architecture setup.
- Security checklist.

---

## 38. Source References

These official sources informed the recommended stack and planning assumptions:

- Next.js PWA documentation: https://nextjs.org/docs/app/guides/progressive-web-apps
- Next.js showcase: https://nextjs.org/showcase
- NestJS documentation: https://docs.nestjs.com/
- NestJS security documentation: https://docs.nestjs.com/security/authentication
- PostgreSQL official site: https://www.postgresql.org/
- PostGIS official site: https://postgis.net/
- React Native documentation: https://reactnative.dev/docs/getting-started
- React Native showcase: https://reactnative.dev/showcase
- Expo documentation: https://docs.expo.dev/
- Redis documentation: https://redis.io/docs/latest/
- Paystack documentation: https://paystack.com/docs/
- Flutterwave documentation: https://developer.flutterwave.com/docs
- MTN MoMo API: https://momoapi.mtn.com/
- MoMo PSB API: https://www.momo.ng/api/
- Mapbox pricing: https://www.mapbox.com/pricing
- Google Maps Platform pricing: https://mapsplatform.google.com/pricing/
- Vercel pricing: https://vercel.com/pricing
- AWS pricing: https://aws.amazon.com/pricing/
- AWS S3 pricing: https://aws.amazon.com/s3/pricing/
- Cloudflare pricing: https://www.cloudflare.com/plans/
- Apple Developer Program: https://developer.apple.com/programs/
- Google Play Console registration: https://support.google.com/googleplay/android-developer/answer/6112435
- Nigeria Data Protection Commission: https://ndpc.gov.ng/

---

## 39. Closing Note

This document defines a practical and scalable plan for building LEEL Ride as a serious electric mobility operation. The recommended approach is intentionally web-first for speed, testing, and lower early friction. It still protects the long-term plan because the backend, database, security, dispatch, payments, and operations logic will remain the foundation when Android and iOS apps are introduced later.


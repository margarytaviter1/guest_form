# Hotel Guest Registration Form

A web-based guest registration form for hotel check-in. Guests fill out personal details, travel dates, and room preferences. Data is validated client-side and server-side, then persisted to PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Next.js 14 (App Router) |
| Forms | Formik 2.x |
| Validation | Yup 1.x (shared client + server schema) |
| Styling | Plain CSS (globals.css) |
| API | Next.js Route Handlers (REST) |
| Database | PostgreSQL 16 |
| Infrastructure | Docker Compose |
| Language | TypeScript 5.x |

## Data Model – `guests` table

| Column | Type | Constraints |
|--------|------|------------|
| id | SERIAL | PK |
| first_name | VARCHAR(50) | NOT NULL |
| last_name | VARCHAR(50) | NOT NULL |
| email | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(30) | NOT NULL |
| id_number | VARCHAR(50) | NOT NULL |
| nationality | VARCHAR(100) | NOT NULL |
| check_in_date | DATE | NOT NULL |
| check_out_date | DATE | NOT NULL, must be > check_in_date |
| number_of_guests | INTEGER | NOT NULL, 1–10 |
| room_preference | VARCHAR(20) | NOT NULL, enum: single/double/suite/family |
| special_requests | TEXT | nullable |
| agree_to_terms | BOOLEAN | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, default NOW() |

## Validation Rules (Yup)

- **firstName / lastName**: required, 2–50 chars, trimmed
- **email**: required, valid email format
- **phone**: required, matches international phone regex `^\+?[0-9\s\-()]{7,20}$`
- **idNumber**: required, min 5 chars
- **nationality**: required
- **checkInDate**: required, cannot be in the past
- **checkOutDate**: required, must be after checkInDate
- **numberOfGuests**: required, 1–10
- **roomPreference**: required, one of [single, double, suite, family]
- **specialRequests**: optional, max 500 chars
- **agreeToTerms**: must be `true`

## API Endpoints

### `POST /api/guests`
- Accepts JSON body matching `GuestFormValues`
- Validates via shared Yup schema
- Inserts into `guests` table
- Returns `{ success: true, id: <number> }` on 201
- Returns `{ success: false, errors: [...] }` on 400 (validation)
- Returns `{ success: false, error: "Internal server error" }` on 500

### `GET /api/guests`
- Returns all guest records ordered by `created_at DESC`

## UI / UX

- Single-page form at `/`
- Two-column grid layout for related fields
- Inline validation error messages (red, below field)
- Disabled submit button while submitting
- Success screen with booking reference ID and "Register Another" button
- Responsive design via CSS grid

## Project Structure

```
guest_form/
├── docker-compose.yml          # PostgreSQL service
├── package.json
├── tsconfig.json
├── next.config.js
├── .env.local                  # DATABASE_URL
├── scripts/
│   └── migrate.js              # Creates guests table
├── src/
│   ├── lib/
│   │   ├── db.ts               # pg Pool singleton
│   │   └── validation.ts       # Yup schema + types + initial values
│   ├── components/
│   │   └── GuestForm.tsx       # Formik form (client component)
│   └── app/
│       ├── layout.tsx          # Root layout
│       ├── globals.css         # Styling
│       ├── page.tsx            # Home page
│       └── api/
│           └── guests/
│               └── route.ts    # REST API handler
```

## Getting Started

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Install dependencies
npm install

# 3. Run database migration
npm run db:migrate

# 4. Start dev server
npm run dev
```

App available at http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Jest) |
| `npm run cy:run` | Run E2E tests (Cypress) |

## CI (GitHub Actions)

Every pull request to `main` triggers three parallel jobs:

| Job | What it does |
|-----|-------------|
| **lint** | Runs `next lint` to check for code issues |
| **unit-tests** | Runs Jest unit tests |
| **e2e-tests** | Spins up a PostgreSQL service, runs DB migrations, builds the app, and runs Cypress E2E tests |

The workflow is defined in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

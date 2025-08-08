# Booking API (NestJS + TypeORM + PostgreSQL)

A simple, production-quality Booking API for a fictional property rental platform. It demonstrates clean architecture, separation of concerns, robust validation, transactions, and tests.

Features:
- List properties with pagination and optional availability filtering by date
- Get a property\u2019s availability (as free date ranges)
- Create a booking with date validations and overlap checks
- Update a booking (dates or userName) with validations
- Cancel (delete) a booking
- Swagger/OpenAPI docs

Hotel semantics: Dates are [startDate, endDate) \u2014 endDate is exclusive (check-out day).

## Endpoints

Base path: `/api`

- [GET] `/properties`: List properties
  - Query:
    - `page` (default 1), `limit` (default 10)
    - `start_date`, `end_date` (ISO strings) for availability filter
- [GET] `/properties/:id/availability`: Available date ranges (end exclusive)
- [POST] `/bookings`: Create booking
- [PUT] `/bookings/:id`: Update booking (optional bonus)
- [DELETE] `/bookings/:id`: Cancel booking

Swagger UI: `/api/docs`

## Tech Stack

- NestJS, TypeORM, PostgreSQL
- class-validator/class-transformer for DTO validation
- @nestjs/swagger for OpenAPI docs
- Jest + Supertest for unit/integration tests
- SQLite in-memory for tests; PostgreSQL for dev/prod

## Setup

1) Clone and install
\`\`\`
git clone <your-repo>
cd nest-booking-api
npm i
\`\`\`

2) Configure environment
Copy `.env.example` to `.env` and adjust as needed:
\`\`\`
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=booking_db
DB_SYNCHRONIZE=true
DB_LOGGING=false
\`\`\`

3) Start PostgreSQL and create the database:
\`\`\`
createdb booking_db
\`\`\`

4) Run the API (dev)
\`\`\`
npm run start:dev
\`\`\`
- API: http://localhost:3000/api
- Docs: http://localhost:3000/api/docs

Note: For simplicity, `synchronize` is enabled in dev. For production, set `DB_SYNCHRONIZE=false` and manage schema with migrations.

## Testing

- Unit tests
\`\`\`
npm test
\`\`\`

- E2E tests
\`\`\`
npm run test:e2e
\`\`\`

E2E uses SQLite in-memory, no external DB required.

## Design Notes

- Separation of concerns:
  - `properties` and `bookings` as isolated modules with controllers/services/entities/DTOs.
  - Validation via global `ValidationPipe` to enforce DTO contracts.
  - Transactional create/update to reduce race conditions on overlaps (`pessimistic_read` lock on overlap check).
- Availability calculation:
  - Computes gaps by subtracting sorted bookings from the property\u2019s availability window.
  - Returns ISO strings, end date is exclusive.
- Overlap rule:
  - Two ranges overlap if `startA < endB` and `endA > startB`.
- Pagination:
  - `page` + `limit`, with `meta` containing `total` and `totalPages`.
- Filtering:
  - When `start_date` and `end_date` are supplied on `/properties`, the query excludes properties where any booking overlaps that range and ensures the property\u2019s availability window contains it.

## Example cURL

List properties:
\`\`\`
curl "http://localhost:3000/api/properties?page=1&limit=5"
\`\`\`

Filter by date:
\`\`\`
curl "http://localhost:3000/api/properties?start_date=2025-08-10T00:00:00.000Z&end_date=2025-08-12T00:00:00.000Z"
\`\`\`

Check availability:
\`\`\`
curl "http://localhost:3000/api/properties/1/availability"
\`\`\`

Create booking:
\`\`\`
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": 1,
    "userName": "Alice",
    "startDate": "2025-08-10T00:00:00.000Z",
    "endDate": "2025-08-12T00:00:00.000Z"
  }'
\`\`\`

Update booking:
\`\`\`
curl -X PUT "http://localhost:3000/api/bookings/1" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-08-15T00:00:00.000Z",
    "endDate": "2025-08-18T00:00:00.000Z"
  }'
\`\`\`

Delete booking:
\`\`\`
curl -X DELETE "http://localhost:3000/api/bookings/1"
\`\`\`

## Assumptions

- Bookings are whole-day at day-level; API accepts full ISO date-times but logic uses exclusive `endDate`.
- Properties\u2019 `pricePerNight` is a decimal string (to avoid floating point precision issues).
- Booking update does not allow changing `propertyId` (simplifies logic); extend as needed.

## Future Enhancements

- Database-level exclusion constraint (GiST) on date ranges to enforce no overlaps at the DB level (PostgreSQL `EXCLUDE USING GIST`).
- Migrations instead of synchronize.
- Authz/authn for multi-user context.
- Caching availability computations and paginated queries.

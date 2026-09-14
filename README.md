# Senior Full-Stack Technical Challenge

## Objective

Implement a small sales and inventory flow: login, list products, create an order, list/view orders, and a top-products report.

The goal is **not** to write as much code as possible. Focus on correctness, database consistency, security, and clear technical decisions.

## Technology

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Angular
- TypeScript
- JWT

## Time Limit

**Maximum: 3 hours**

## Setup

1. Start SQL Server:

```bash
docker compose up -d
```

2. Apply migrations (also runs automatically when the API starts):

```bash
dotnet ef database update --project backend/src/Challenge.Api --startup-project backend/src/Challenge.Api
```

3. Start backend:

```bash
dotnet run --project backend/src/Challenge.Api
```

API: `http://localhost:5089`  
Swagger: `http://localhost:5089/swagger`

4. Start frontend:

```bash
cd frontend/challenge-app
npm start
```

UI: `http://localhost:4200`

More database notes: `database/README.md`.

## Test Credentials

| Username | Password    | Role  |
| -------- | ----------- | ----- |
| `admin`  | `Admin123!` | Admin |
| `sales`  | `Sales123!` | Sales |

Passwords are stored as hashes. These credentials are for local evaluation only.

## Requirements

Implement at least:

- `POST /api/auth/login` — JWT login
- `GET /api/products` — search, active products, pagination
- `POST /api/orders` — create order and update stock
- `GET /api/orders` — search, filters, pagination, sorting (in the database)
- `GET /api/orders/{id}` — details with line prices from the order, not current product price
- `GET /api/reports/top-products` — SQL aggregation with `fromDate` / `toDate`

Angular screens are stubbed: Login, Products, Create Order, Orders, Order Details.

Business rules that must be enforced **on the backend**:

- Customer exists and is active
- Product exists and is active
- Quantity > 0
- Order has at least one item
- Stock is sufficient
- User is authenticated and authorized

Concurrency scenario (seeded product):

```text
LAPTOP-001 stock = 5
Request A quantity = 4
Request B quantity = 3
```

Both requests must not succeed. Stock must never become negative. A failed request must return an appropriate HTTP response.

## Constraints

You are not expected to implement every possible feature.

Prioritize correctness, security, business logic, concurrency, database consistency and code quality.

Product CRUD, rich UI, and Dockerizing the whole app are out of scope.

## Technical Decisions

Important technical decisions should be briefly documented (a short `NOTES.md` is enough).

# Database

SQL Server runs with Docker Compose from the repository root.

```bash
docker compose up -d
```

Default development connection (also in `backend/src/Challenge.Api/appsettings.json`):

```text
Server=localhost,1433;Database=ChallengeDb;User Id=sa;Password=Your_password123;TrustServerCertificate=True
```

Apply migrations from the repository root:

```bash
dotnet ef database update --project backend/src/Challenge.Api --startup-project backend/src/Challenge.Api
```

If `dotnet ef` is missing:

```bash
dotnet tool install --global dotnet-ef
```

The API also applies pending migrations and seed data on startup.

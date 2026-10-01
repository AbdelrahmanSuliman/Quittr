# Setup commands
## Start database container
docker compose up -d

## Run schema migrations
npx drizzle-kit push

## Start development server
npm run dev

# Auth flow

- Mechanism: Authorization: Bearer header
- Token expiration: 1 hour

# Database Schema
```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar username
        varchar password_hash
        boolean is_onboarded
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    addictions {
        uuid id PK
        varchar name
        uuid user_id FK
        uuid partner_id FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    invitations {
        uuid id PK
        uuid user_id FK
        uuid partner_id FK
        uuid addiction_id FK
        status status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    journal_entries {
        uuid id PK
        text content
        boolean succeeded
        date date
        uuid addiction_id FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    users ||--o{ addictions : "user_id"
    users |o--o{ addictions : "partner_id"
    users ||--o{ invitations : "user_id"
    users ||--o{ invitations : "partner_id"
    addictions ||--o{ invitations : "addiction_id"
    addictions ||--o{ journal_entries : "addiction_id"
```
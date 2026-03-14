# Umiya Dashboard

A full-stack ERP-style management system built for **Umiya Acid & Chemical** — a chemical trading company. It covers customer management, chemical inventory, order processing, delivery tracking, internal messaging, document management, and business analytics.

---

## Tech Stack

| Layer        | Technology                                           |
| ------------ | ---------------------------------------------------- |
| **Backend**  | Django 5.1, Django REST Framework, SimpleJWT          |
| **Frontend** | React 19, Vite 7, Tailwind CSS v4                    |
| **Database** | PostgreSQL 16                                        |
| **Auth**     | JWT (12h access / 7d refresh with rotation)          |
| **Charts**   | Recharts                                             |
| **CI/CD**    | GitHub Actions + SonarCloud                          |

---

## Project Structure

```
Umiya_Dashboard/
├── backend/
│   ├── apps/
│   │   ├── accounts/       # Users, auth, profiles
│   │   ├── core/           # Countries, states, notifications, settings, search
│   │   ├── customers/      # Customer profiles + financial data
│   │   ├── inventory/      # Chemicals, categories, vendors, stock entries
│   │   ├── orders/         # Orders + order items
│   │   ├── deliveries/     # Delivery tracking
│   │   ├── messaging/      # Internal threaded messaging
│   │   ├── documents/      # File uploads & management
│   │   └── reports/        # Dashboard analytics (no models, pure aggregation)
│   ├── config/             # Django settings, URLs, WSGI
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client + 10 API modules
│   │   ├── constants/      # Navigation config
│   │   ├── contexts/       # AuthContext (global auth state)
│   │   ├── hooks/          # useApi custom hook
│   │   ├── layouts/        # AuthenticatedLayout, GuestLayout
│   │   ├── pages/          # 13 page components
│   │   └── utils/          # Currency, date, className helpers
│   ├── package.json
│   └── vite.config.js
│
└── .github/workflows/
    └── build.yml           # CI pipeline
```

---

## Getting Started

### Prerequisites

- Python 3.13+
- Node.js 22+
- PostgreSQL 16+

### 1. Clone the repository

```bash
git clone https://github.com/aB00747/umiyaDashboard.git
cd Umiya_Dashboard
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure database
# Edit config/settings.py and set your PostgreSQL credentials:
#   NAME: umiya_dashboard
#   USER: postgres
#   PASSWORD: <your_password>

# Run migrations
python manage.py migrate

# Seed geographic data (India, US, UK + 36 Indian states)
python manage.py seed_geo_data

# Create a superuser
python manage.py createsuperuser

# Start the dev server
python manage.py runserver
```

The API is now available at `http://localhost:8000/api`.

### 3. Frontend setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app is now available at `http://localhost:5173`. The Vite dev server proxies all `/api` requests to the Django backend on port 8000.

---

## Database Schema

16 tables across 9 apps. Key relationships:

```
User ──1:N──> Orders (created_by)
User ──1:N──> Messages (sender / recipient)
User ──1:N──> Documents (uploaded_by)
User ──1:N──> Notifications

Customer ──1:1──> Financial
Customer ──1:N──> Orders

Order ──1:N──> OrderItems
Order ──1:N──> Deliveries

Chemical ──N:1──> Category
Chemical ──1:N──> OrderItems
Chemical ──1:N──> StockEntries

Vendor ──1:N──> StockEntries

Country ──1:N──> States

Message ──self──> Message (parent, for threading)
```

### Models at a glance

| Model        | App        | Notable fields                                                                     |
| ------------ | ---------- | ---------------------------------------------------------------------------------- |
| **User**     | accounts   | username, email, phone, address, role (`admin` / `manager` / `staff`)              |
| **Customer** | customers  | 34 fields — name, company, address, GSTIN, PAN, type (Retail/Wholesale/Distributor/Industrial) |
| **Financial**| customers  | 38 fields — credit limits, revenue, payment terms, banking info (1:1 with Customer)|
| **Category** | inventory  | name, description                                                                  |
| **Chemical** | inventory  | chemical_code, quantity, min_quantity, purchase_price, selling_price, gst_percentage|
| **Vendor**   | inventory  | vendor_name, contact_person, phone, email, gstin                                   |
| **StockEntry** | inventory | chemical, entry_type (`purchase`/`sale`/`adjustment`), quantity, rate, vendor       |
| **Order**    | orders     | auto-generated order_number (`ORD-000001`), 6 statuses, payment tracking           |
| **OrderItem**| orders     | chemical, quantity, unit_price, total_price (auto-calculated)                      |
| **Delivery** | deliveries | order, vehicle_number, driver info, tracking_number, 4 statuses                    |
| **Message**  | messaging  | sender, recipient, subject, body, parent (self-FK for threading)                   |
| **Document** | documents  | title, file, category (invoice/report/certificate/contract/other)                  |
| **Country**  | core       | country_code, country_name                                                         |
| **State**    | core       | country, state_code, state_name                                                    |
| **Notification** | core   | user, title, message, is_read, link                                                |
| **Setting**  | core       | key-value store for app-wide settings                                              |

---

## API Reference

Base URL: `http://localhost:8000/api`

All endpoints (except auth) require a `Authorization: Bearer <access_token>` header.

### Authentication

| Method | Endpoint                 | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| POST   | `/auth/register/`        | Register a new user (returns JWT)   |
| POST   | `/auth/login/`           | Login (returns user + JWT)          |
| POST   | `/auth/logout/`          | Blacklist refresh token             |
| POST   | `/auth/token/refresh/`   | Refresh access token (rotated)      |
| GET    | `/auth/me/`              | Get current user profile            |
| PATCH  | `/auth/profile/`         | Update profile                      |
| DELETE | `/auth/profile/delete/`  | Delete account                      |

### Customers

| Method | Endpoint                           | Description                       |
| ------ | ---------------------------------- | --------------------------------- |
| GET    | `/customers/`                      | List (paginated, searchable, filterable) |
| POST   | `/customers/`                      | Create customer                   |
| GET    | `/customers/{id}/`                 | Detail (includes financial data)  |
| PUT    | `/customers/{id}/`                 | Update                            |
| DELETE | `/customers/{id}/`                 | Delete                            |
| GET    | `/customers/search/?q=`           | Quick search (limit 20)           |
| POST   | `/customers/import/`               | Bulk import from CSV/Excel        |
| GET    | `/customers/export/template/?format=xlsx` | Download import template  |
| GET    | `/customers/export/`               | Export filtered data as CSV       |

### Inventory

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/categories/`            | List all categories        |
| POST   | `/categories/`            | Create category            |
| PUT    | `/categories/{id}/`       | Update category            |
| DELETE | `/categories/{id}/`       | Delete category            |
| GET    | `/chemicals/`             | List (paginated, filterable by category) |
| POST   | `/chemicals/`             | Create chemical            |
| GET    | `/chemicals/{id}/`        | Detail                     |
| PUT    | `/chemicals/{id}/`        | Update                     |
| DELETE | `/chemicals/{id}/`        | Delete                     |
| GET    | `/vendors/`               | List (paginated, searchable) |
| POST   | `/vendors/`               | Create vendor              |
| PUT    | `/vendors/{id}/`          | Update vendor              |
| DELETE | `/vendors/{id}/`          | Delete vendor              |
| GET    | `/stock-entries/`         | List (filterable by chemical, type, vendor) |
| POST   | `/stock-entries/`         | Create stock entry         |
| PUT    | `/stock-entries/{id}/`    | Update stock entry         |
| DELETE | `/stock-entries/{id}/`    | Delete stock entry         |

### Orders

| Method | Endpoint                   | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| GET    | `/orders/`                 | List (paginated, searchable, filterable) |
| POST   | `/orders/`                 | Create order with items            |
| GET    | `/orders/{id}/`            | Detail with items breakdown        |
| PUT    | `/orders/{id}/`            | Update order                       |
| DELETE | `/orders/{id}/`            | Delete order                       |
| PATCH  | `/orders/{id}/status/`     | Update order status                |

### Deliveries

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| GET    | `/deliveries/`             | List (paginated)        |
| POST   | `/deliveries/`             | Create delivery         |
| GET    | `/deliveries/{id}/`        | Detail                  |
| PUT    | `/deliveries/{id}/`        | Update                  |
| DELETE | `/deliveries/{id}/`        | Delete                  |

### Messaging

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| GET    | `/messages/`               | List threads (sent + received) |
| POST   | `/messages/`               | Send a message               |
| GET    | `/messages/{id}/`          | Get message with replies     |
| POST   | `/messages/{id}/read/`     | Mark as read                 |

### Documents

| Method | Endpoint                   | Description                          |
| ------ | -------------------------- | ------------------------------------ |
| GET    | `/documents/`              | List (paginated, searchable, filterable by category) |
| POST   | `/documents/`              | Upload (multipart/form-data)         |
| GET    | `/documents/{id}/`         | Detail                               |
| DELETE | `/documents/{id}/`         | Delete                               |

### Reports / Analytics

| Method | Endpoint                   | Description                                  |
| ------ | -------------------------- | -------------------------------------------- |
| GET    | `/reports/dashboard/`      | Stats, recent orders, low stock, monthly trends |
| GET    | `/reports/sales/`          | Revenue, top customers, top products         |
| GET    | `/reports/inventory/`      | Stock value, categories breakdown, low stock |

### Core / Utilities

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| GET    | `/countries/`                        | List all countries        |
| GET    | `/states/?country_id=X`             | States by country         |
| GET    | `/search/?q=text`                   | Global search             |
| GET    | `/notifications/`                   | User notifications        |
| POST   | `/notifications/{id}/read/`         | Mark notification read    |
| POST   | `/notifications/mark-all-read/`     | Mark all read             |
| GET    | `/settings/`                        | Get app settings          |
| PUT    | `/settings/`                        | Update app settings       |

---

## Authentication Flow

```
┌─────────┐       POST /auth/login/        ┌─────────┐
│  Client  │ ──────────────────────────────>│  Server │
│          │<──── { user, access, refresh } │         │
│          │                                │         │
│          │  GET /api/... (Bearer token)   │         │
│          │ ──────────────────────────────>│         │
│          │<──── data                      │         │
│          │                                │         │
│  401?    │  POST /auth/token/refresh/     │         │
│          │ ──────────────────────────────>│         │
│          │<──── { new access, new refresh}│         │
│          │                                │         │
│          │  Retry original request        │         │
│          │ ──────────────────────────────>│         │
└─────────┘                                └─────────┘
```

- **Access token**: 12 hours TTL
- **Refresh token**: 7 days TTL, rotated on each use
- Tokens stored in `localStorage` (`access_token`, `refresh_token`)
- Axios interceptor auto-refreshes on 401 and retries the request
- Failed refresh redirects to `/login`

---

## Frontend Pages

| Route           | Page          | Description                                          |
| --------------- | ------------- | ---------------------------------------------------- |
| `/login`        | Login         | Username + password login                            |
| `/register`     | Register      | New user registration                                |
| `/`             | Dashboard     | Stats cards, line/pie charts, recent orders, low stock |
| `/customers`    | Customers     | Full CRUD, import/export, search, filters            |
| `/inventory`    | Inventory     | 4 tabs: Chemicals, Categories, Vendors, Stock Entries|
| `/orders`       | Orders        | Multi-item orders, status tracking, payment status   |
| `/pricing`      | Pricing       | Pricing management                                   |
| `/deliveries`   | Deliveries    | Delivery tracking with driver/vehicle info           |
| `/messaging`    | Messaging     | Threaded internal messages                           |
| `/reports`      | Reports       | Sales and inventory analytics                        |
| `/documents`    | Documents     | Upload, categorize, and search documents             |
| `/settings`     | Settings      | App-wide configuration                               |
| `/profile`      | Profile       | Edit profile, delete account                         |

### Layout

- **Sidebar**: Fixed on desktop, slide-over on mobile. 10 navigation items with icons.
- **Header**: Global search bar, notifications dropdown, user menu.
- **Branding**: "UC" (Umiya Chemical)

---

## Key Features

### Customer Management
- 34-field customer profiles with GSTIN/PAN tracking
- Financial data (credit limits, revenue, payment terms, banking)
- Bulk import from CSV/Excel with downloadable template
- Export filtered customer data to CSV
- Customer types: Retail, Wholesale, Distributor, Industrial

### Inventory
- Chemical catalog organized by categories
- Low stock alerts when quantity falls below minimum threshold
- Stock entry tracking (purchase / sale / adjustment)
- Per-chemical GST percentage and pricing
- Vendor management with contact details

### Orders
- Auto-generated order numbers (`ORD-000001`, `ORD-000002`, ...)
- Multi-item orders — unit price auto-populated from chemical selling price
- Tax calculation from chemical GST percentages
- 6 order statuses: pending -> confirmed -> processing -> shipped -> delivered / cancelled
- 4 payment statuses: unpaid / partial / paid / refunded

### Deliveries
- Linked to orders
- Vehicle number, driver name, driver phone
- Tracking numbers
- 4 statuses: pending / in_transit / delivered / failed

### Dashboard & Reports
- 4 stat cards: revenue, orders, customers, low stock count
- Line chart: monthly orders + revenue (last 7 months)
- Pie chart: order status distribution
- Recent orders table, low stock items table
- Sales analytics: top 10 customers, top 10 products
- Inventory analytics: stock value, category breakdown

### Messaging
- Internal threaded messaging between users
- Read/unread tracking
- Inbox and sent views

### Documents
- File uploads organized by year/month
- 5 categories: invoice, report, certificate, contract, other
- Search by title and description

### Global Features
- Global search across customers, chemicals, and orders
- Notification system with mark-as-read
- Responsive design (mobile + desktop)
- Indian localization: INR currency, Asia/Kolkata timezone, 36 Indian states

---

## Environment Variables / Configuration

Key settings in `backend/config/settings.py`:

| Setting                  | Value                        |
| ------------------------ | ---------------------------- |
| `DEBUG`                  | `True`                       |
| `ALLOWED_HOSTS`          | `['*']`                      |
| `TIME_ZONE`              | `Asia/Kolkata`               |
| `AUTH_USER_MODEL`        | `accounts.User`              |
| `CORS_ALLOWED_ORIGINS`   | `http://localhost:5173`      |
| `DEFAULT_PAGINATION`     | 20 items per page            |
| JWT access lifetime      | 12 hours                     |
| JWT refresh lifetime     | 7 days                       |
| Media uploads directory  | `backend/media/`             |

Frontend proxy is configured in `frontend/vite.config.js` — all `/api` requests forward to `http://localhost:8000`.

---

## Docker Setup

Run the entire stack with a single command using Docker Compose.

### Prerequisites

- Docker & Docker Compose

### Quick Start

```bash
# Copy env file and adjust if needed
cp .env.example .env

# Build and start all services
docker compose up --build

# In a separate terminal, run migrations (first time only)
docker compose exec backend python manage.py migrate

# Seed geographic data
docker compose exec backend python manage.py seed_geo_data

# Create a superuser
docker compose exec backend python manage.py createsuperuser
```

The app is available at `http://localhost:5173`. Nginx serves the React frontend and proxies `/api` requests to Django.

### Services

| Service      | URL                     | Description                |
| ------------ | ----------------------- | -------------------------- |
| **frontend** | http://localhost:5173    | React app via Nginx        |
| **backend**  | http://localhost:8000    | Django API (direct access) |
| **db**       | localhost:5432           | PostgreSQL 16              |

### Useful Commands

```bash
# Stop all services
docker compose down

# Stop and remove volumes (deletes database data)
docker compose down -v

# View logs
docker compose logs -f backend

# Run Django management commands
docker compose exec backend python manage.py <command>
```

---

## CI/CD

GitHub Actions pipeline (`.github/workflows/build.yml`) runs on push/PR to `main`:

1. **Backend job** — Python 3.13 + PostgreSQL 16 service container
   - Install dependencies, run migrations, system check, seed geo data
2. **Frontend job** — Node.js 22
   - `npm ci` + `npm run build`
3. **SonarCloud** — Code quality analysis

---

## Dependencies

### Backend (`requirements.txt`)

| Package                       | Purpose                |
| ----------------------------- | ---------------------- |
| Django 5.1                    | Web framework          |
| djangorestframework 3.15+    | REST API               |
| djangorestframework-simplejwt | JWT authentication     |
| django-cors-headers           | CORS for frontend      |
| django-filter                 | Query parameter filters|
| psycopg2-binary               | PostgreSQL adapter     |
| openpyxl                      | Excel import/export    |
| Pillow                        | Image processing       |

### Frontend (`package.json`)

| Package              | Purpose                |
| -------------------- | ---------------------- |
| react 19             | UI library             |
| react-router-dom 7   | Client-side routing    |
| axios                | HTTP client            |
| tailwindcss 4        | Utility-first CSS      |
| @headlessui/react    | Accessible UI components |
| lucide-react         | Icons                  |
| recharts             | Charts and graphs      |
| react-hot-toast      | Toast notifications    |

---

## User Roles

| Role      | Description                         |
| --------- | ----------------------------------- |
| `admin`   | Full access to all features         |
| `manager` | Management-level access             |
| `staff`   | Standard operational access         |

---

## License

Private project for Umiya Acid & Chemical.

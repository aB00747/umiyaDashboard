# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Laravel)
```bash
# Start development server with all services
composer run dev  # Runs server, queue, logs, and vite concurrently

# Individual services
php artisan serve                    # Start Laravel development server
php artisan queue:listen --tries=1  # Start queue worker
php artisan pail --timeout=0        # Start logging service

# Database operations
php artisan migrate                  # Run migrations
php artisan migrate:fresh --seed    # Fresh migrate with seeders
php artisan tinker                   # Laravel REPL

# Code quality
vendor/bin/pint                      # Format PHP code (Laravel Pint)
```

### Frontend (React + Vite)
```bash
# Development
npm run dev      # Start Vite development server
npm run build    # Build for production

# Dependencies
npm install      # Install Node.js dependencies
```

### Testing
```bash
# PHP Tests
php artisan test                     # Run all tests
php artisan test --filter=CustomerTest  # Run specific test
vendor/bin/phpunit tests/Unit        # Run unit tests only
vendor/bin/phpunit tests/Feature     # Run feature tests only

# Run single test method
php artisan test --filter=test_method_name
```

## Architecture Overview

### Technology Stack
- **Backend**: Laravel 12 with PHP 8.2+
- **Frontend**: React 18 with Inertia.js for SPA functionality
- **Database**: SQLite (development), supports MySQL/PostgreSQL
- **Styling**: Tailwind CSS + SCSS/SASS
- **Build Tool**: Vite with Laravel plugin
- **Authentication**: Laravel Sanctum for API tokens
- **Excel/PDF**: Maatwebsite/Excel, TCPDF for file operations

### Application Structure

#### Backend Architecture
- **Controllers**: Located in `app/Http/Controllers/`
  - `CustomerController`: Customer CRUD operations with import/export
  - `AuthController`: Authentication via Sanctum
  - `NotificationController`: System notifications
  - `SearchController`: Global search functionality

- **Models**: Eloquent models in `app/Models/`
  - `Customer`: Main customer entity with business info, addresses, GST details
  - `User`: Authentication model
  - `Country`, `State`: Geographic data

- **API Routes**: RESTful API in `routes/api.php`
  - Authentication: `/api/login`, `/api/logout`, `/api/user`
  - Customers: `/api/customers/*` (CRUD + import/export)
  - Search: `/api/search`
  - Notifications: `/api/notifications/*`

#### Frontend Architecture
- **Page Structure**: Inertia.js pages in `resources/js/Pages/`
  - Each major section (Customers, Orders, Inventory, etc.) has its own directory
  - Components are co-located with their pages
  - Shared components in `resources/js/components/`

- **Layouts**: 
  - `AuthenticatedLayout`: Main dashboard layout with sidebar navigation
  - `GuestLayout`: For authentication pages
  - Uses persistent sidebar with responsive behavior

- **Services Layer**: API abstraction in `resources/js/Services/`
  - `BaseApiService`: Generic CRUD operations
  - `CustomerAPI`: Customer-specific API calls
  - `AuthService`: Authentication management

- **State Management**: React hooks + Inertia's shared data
  - No global state library (Redux/Zustand) currently used
  - Page-level state with props passing to components

#### Data Flow
1. **Inertia Request**: Page requests go through Laravel routes
2. **Controller Processing**: Controllers handle business logic, query models
3. **Inertia Response**: Data passed to React components as props
4. **API Calls**: Async operations use Axios through service layer
5. **Notifications**: React Hot Toast for user feedback

### Key Features

#### Customer Management
- Complete CRUD operations with complex form validation
- Excel import/export with template support
- Address management with country/state relationships
- GST/PAN validation for Indian business requirements
- Customer types (Retail/Wholesale) and status management

#### Authentication & Security
- Sanctum-based API authentication
- Remember me functionality
- CSRF protection
- Role-based access (structure exists for expansion)

#### UI/UX Patterns
- Responsive design with Tailwind CSS
- Modal-based forms with multi-step wizards
- Real-time toast notifications
- Loading states and error handling
- Consistent form validation patterns

### File Organization Patterns

#### Component Structure
```
Pages/[Module]/
├── Index.jsx              # Main page component
├── Components/            # Page-specific components
│   ├── ModuleList.jsx    # Data listing component
│   ├── ModuleFilters.jsx # Search/filter component
│   └── ModuleStats.jsx   # Statistics component
└── Dialog/               # Modal components
    └── ModuleDialog/
        ├── index.jsx     # Main dialog
        ├── components/   # Dialog-specific components
        ├── hooks/        # Custom hooks
        └── utils/        # Utilities and validation
```

#### Styling Organization
- **SCSS**: Component-specific styles in `resources/sass/`
- **CSS Modules**: For component isolation where needed
- **Tailwind**: Utility-first classes for most styling
- **Variables**: Centralized in `_variables.scss` with design system colors

### Development Patterns

#### Form Handling
- Custom validation hooks (see `useFormValidation.js`)
- Centralized form field components
- Real-time validation with user feedback
- Error boundary patterns for robust UX

#### API Integration
- Service layer abstraction over direct Axios calls
- Consistent error handling across API calls
- Loading states managed at component level
- Optimistic updates where appropriate

#### Code Quality
- Laravel Pint for PHP formatting
- Component-based React architecture
- Consistent naming conventions
- Separation of concerns between API and UI logic

## Database Schema

### Key Tables
- **customers**: Primary customer data with address, contact, and business info
- **countries/states**: Geographic reference data
- **users**: Authentication and user management

### Important Fields
- Customer GST/PAN validation for Indian market
- Multi-line address support
- Customer type categorization
- Active/inactive status management

## Development Notes

- SQLite used for development (file: `database/database.sqlite`)
- Migrations include country/state seeding
- Excel import/export uses `maatwebsite/excel` package
- PDF generation via `elibyy/tcpdf-laravel`
- Queue system configured for background processing
- Hot module replacement enabled via Vite
# Services Architecture

This directory contains the optimized, reusable service layer for the application. The architecture is designed for scalability, maintainability, and reusability.

## Directory Structure

```
Services/
├── core/                    # Core service infrastructure
│   ├── HttpClient.js       # Enhanced Axios instance with interceptors
│   └── BaseService.js      # Base CRUD service class
├── api/                    # API-specific services
│   ├── CustomerService.js  # Customer operations
│   └── FinancialService.js # Financial operations
├── auth/                   # Authentication services
│   └── AuthService.js      # User authentication & session management
├── utils/                  # Utility services
│   └── ValidationService.js # Client-side validation
└── index.js               # Central export point
```

## Core Features

### 1. HttpClient (Enhanced Axios)
- **Automatic authentication** - Adds Bearer tokens to requests
- **Error handling** - Standardized error responses with user notifications
- **Request/Response interceptors** - CSRF tokens, logging, error handling
- **Upload support** - File uploads with progress tracking
- **Download support** - File downloads with automatic naming
- **Timeout handling** - 30-second timeout with proper error messages

### 2. BaseService (CRUD Operations)
- **Standard CRUD** - `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- **Advanced operations** - `search()`, `bulkCreate()`, `bulkUpdate()`, `bulkDelete()`
- **Import/Export** - File import/export with validation
- **Statistics** - `getStats()` for resource metrics
- **Custom requests** - `request()` method for custom endpoints
- **Response transformation** - Override `transformResponse()` in child classes
- **Error handling** - Consistent error handling with context

### 3. Specialized Services
- **CustomerService** - Customer-specific operations (orders, interactions, documents)
- **FinancialService** - Financial operations (payments, credit management, reports)
- **AuthService** - Authentication, token management, user profile
- **ValidationService** - Client-side validation with custom rules

## Usage Examples

### Basic Usage

```javascript
import { customerService, financialService } from '@/Services';

// Get all customers with pagination
const customers = await customerService.getAll({
    page: 1,
    limit: 20,
    search: 'john'
});

// Get customer by ID
const customer = await customerService.getById(123);

// Create new customer
const newCustomer = await customerService.create({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com'
});

// Update customer
const updatedCustomer = await customerService.update(123, {
    phone: '+1234567890'
});
```

### Advanced Customer Operations

```javascript
// Get customer with financial data
const customerWithFinancial = await customerService.getWithFinancial();

// Get customer orders
const orders = await customerService.getOrders(123, { page: 1 });

// Advanced search
const searchResults = await customerService.advancedSearch({
    customer_type: 'retail',
    is_active: true,
    created_after: '2023-01-01'
});

// Check for duplicates
const duplicateCheck = await customerService.checkDuplicate(
    'john@example.com',
    '+1234567890',
    'ACME Corp'
);

// Upload customer document
await customerService.uploadDocument(123, file, 'contract', 'Annual contract');
```

### Financial Operations

```javascript
// Get financial data by customer
const financial = await financialService.getByCustomerId(123);

// Update credit limit
await financialService.updateCreditLimit(456, 100000, 'Increased based on payment history');

// Record payment
await financialService.recordPayment(123, {
    amount: 50000,
    payment_method: 'bank_transfer',
    reference_number: 'TXN123456'
});

// Get overdue customers
const overdueCustomers = await financialService.getOverdue();

// Generate financial statement
await financialService.generateStatement(123, '2023-01-01', '2023-12-31', 'pdf');
```

### Authentication

```javascript
import { authService } from '@/Services';

// Login
const result = await authService.login({
    email: 'user@example.com',
    password: 'password',
    remember: true
});

// Check authentication
if (authService.isAuthenticated()) {
    const user = authService.getUser();
}

// Check permissions
if (authService.hasPermission('customers.create')) {
    // User can create customers
}

// Update profile
await authService.updateProfile({
    name: 'New Name',
    phone: '+1234567890'
});
```

### Validation

```javascript
import { validationService } from '@/Services';

// Validate single field
const errors = validationService.validateField('john@example.com', 'required|email');

// Validate form data
const { isValid, errors } = validationService.validate(formData, {
    first_name: 'required|maxLength:255',
    email: 'required|email',
    phone: 'phone'
});

// Async validation (for unique checks)
const { isValid, errors } = await validationService.validateAsync(formData, {
    email: 'required|email|unique:/api/customers/check-email'
});

// Use predefined rule sets
const customerRules = validationService.getRuleSet('customer');
```

### Error Handling

All services use consistent error handling:

```javascript
try {
    const result = await customerService.create(customerData);
    // Handle success
} catch (error) {
    // Error object structure:
    // {
    //   status: 422,
    //   message: "Validation failed",
    //   errors: { email: ["Email is required"] },
    //   type: "CLIENT_ERROR",
    //   originalError: {...}
    // }
    
    if (error.status === 422) {
        // Handle validation errors
        console.log(error.errors);
    }
}
```

### Creating Custom Services

```javascript
import { ServiceFactory } from '@/Services';

// Simple service
const productService = ServiceFactory.createService('/products');

// Custom service with additional methods
const orderService = ServiceFactory.createCustomService('/orders', {
    async getOrderItems(orderId) {
        return this.request('get', `${orderId}/items`);
    },
    
    async updateStatus(orderId, status) {
        return this.patch(orderId, { status });
    }
});
```

### Import/Export Operations

```javascript
// Export customers to Excel
await customerService.export('xlsx', { 
    is_active: true,
    customer_type: 'retail' 
});

// Import customers from file
const importResult = await customerService.import(file, {
    onProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        console.log(`Upload progress: ${progress}%`);
    }
});

// Get import template
await customerService.getImportTemplate('xlsx');

// Validate import data
const validationResult = await customerService.validateImport(file);
```

## Best Practices

1. **Use services instead of direct axios calls**
2. **Handle errors consistently using try-catch**
3. **Leverage response transformation for data formatting**
4. **Use validation service for form validation**
5. **Implement proper loading states in components**
6. **Cache frequently accessed data appropriately**
7. **Use bulk operations for better performance**
8. **Implement proper error boundaries in React components**

## Configuration

Services can be configured via environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_REQUEST_TIMEOUT=30000
VITE_ENABLE_REQUEST_LOGGING=true
```

## Testing

Services are designed to be easily testable:

```javascript
// Mock HttpClient for testing
jest.mock('@/Services/core/HttpClient', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}));

// Test service methods
test('should fetch customers', async () => {
    const mockCustomers = [{ id: 1, name: 'John' }];
    httpClient.get.mockResolvedValue({ data: mockCustomers });
    
    const result = await customerService.getAll();
    expect(result).toEqual(mockCustomers);
});
```

This architecture provides a solid foundation for scalable, maintainable API integration while ensuring consistent error handling and user experience across the application.
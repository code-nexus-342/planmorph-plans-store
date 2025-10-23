# PlanMorph API Documentation

## 📡 API Overview

The PlanMorph API is a RESTful service built with Express.js and TypeScript, designed to handle enterprise-scale operations for a house plans marketplace platform.

### Base URLs
- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Authentication
The API uses JWT (JSON Web Tokens) for authentication:
- **Access Token**: Short-lived token for API requests (7 days default)
- **Refresh Token**: Long-lived token for refreshing access tokens (30 days default)

### Request/Response Format
- **Content-Type**: `application/json`
- **Charset**: `UTF-8`

### Standard Response Structure
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "pages": number
  }
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "message": string,
    "details": string | object
  }
}
```

## 🔐 Authentication Endpoints

### POST /auth/login
Authenticate user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "customer",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid credentials
- `401`: Authentication failed
- `429`: Too many requests

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "phone": "+1234567890",
      "role": "customer",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

### GET /auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_access_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "customer",
    "is_active": true,
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### PUT /auth/profile
Update user profile (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_access_token
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

### POST /auth/google
Google OAuth authentication.

**Request Body:**
```json
{
  "code": "google_oauth_code",
  "state": "optional_state"
}
```

## 🏠 Plans Endpoints

### GET /plans
Retrieve house plans with filtering and pagination.

**Query Parameters:**
- `q` (string): Search query
- `category` (string): Category slug
- `min_price` (number): Minimum price
- `max_price` (number): Maximum price
- `bedrooms` (number): Number of bedrooms
- `bathrooms` (number): Number of bathrooms
- `architect` (string): Architect ID
- `sort` (string): Sort option (`popularity`, `price_asc`, `price_desc`, `newest`, `oldest`)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Example Request:**
```
GET /plans?category=modern&bedrooms=3&bathrooms=2&sort=popularity&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Modern Farmhouse",
      "description": "Beautiful modern farmhouse with open concept living",
      "price": 89999,
      "bedrooms": 4,
      "bathrooms": 3.5,
      "square_feet": 2400,
      "category_id": "uuid",
      "architect_id": "uuid",
      "features": ["Open Floor Plan", "Master Suite", "2-Car Garage"],
      "images": ["https://example.com/image1.jpg"],
      "is_featured": true,
      "is_active": true,
      "average_rating": 4.5,
      "review_count": 23,
      "created_at": "2024-01-01T00:00:00Z",
      "categories": {
        "id": "uuid",
        "name": "Modern",
        "slug": "modern"
      },
      "architects": {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Architect",
        "company_name": "Architect Firm"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### GET /plans/:id
Get detailed information about a specific plan.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Modern Farmhouse",
    "description": "Detailed description of the plan...",
    "price": 89999,
    "bedrooms": 4,
    "bathrooms": 3.5,
    "square_feet": 2400,
    "category_id": "uuid",
    "architect_id": "uuid",
    "features": ["Open Floor Plan", "Master Suite", "2-Car Garage"],
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "is_featured": true,
    "is_active": true,
    "average_rating": 4.5,
    "review_count": 23,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "categories": {
      "id": "uuid",
      "name": "Modern",
      "slug": "modern",
      "description": "Contemporary modern designs"
    },
    "architects": {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Architect",
      "company_name": "Architect Firm",
      "bio": "Experienced architect specializing in modern designs",
      "email": "architect@example.com"
    }
  }
}
```

### POST /plans
Create a new house plan (requires authentication - architect/admin role).

**Headers:**
```
Authorization: Bearer jwt_access_token
```

**Request Body:**
```json
{
  "title": "Contemporary Villa",
  "description": "Stunning contemporary villa with panoramic views",
  "price": 125000,
  "bedrooms": 5,
  "bathrooms": 4.5,
  "square_feet": 3200,
  "category_id": "uuid",
  "architect_id": "uuid",
  "features": ["Swimming Pool", "Wine Cellar", "Home Theater"],
  "images": ["https://example.com/image1.jpg"]
}
```

### PUT /plans/:id
Update an existing plan (requires authentication - owner/admin).

### DELETE /plans/:id
Delete a plan (requires authentication - owner/admin).

## 📂 Categories Endpoints

### GET /categories
Get all active categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Modern",
      "slug": "modern",
      "description": "Contemporary modern designs",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "Traditional",
      "slug": "traditional",
      "description": "Classic traditional styles",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /categories/:slug/plans
Get plans by category slug.

**Query Parameters:** Same as `/plans` endpoint

## ⭐ Reviews Endpoints

### GET /plans/:planId/reviews
Get reviews for a specific plan.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `sort` (string): Sort by `newest`, `oldest`, `rating_high`, `rating_low`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "plan_id": "uuid",
      "user_id": "uuid",
      "rating": 5,
      "comment": "Excellent plan! Very detailed and well thought out.",
      "created_at": "2024-01-01T00:00:00Z",
      "users": {
        "first_name": "John",
        "last_name": "D."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### POST /plans/:planId/reviews
Add a review for a plan (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_access_token
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Amazing design and great attention to detail!"
}
```

### PUT /reviews/:id
Update a review (requires authentication - owner only).

### DELETE /reviews/:id
Delete a review (requires authentication - owner/admin).

### GET /plans/:planId/reviews/stats
Get review statistics for a plan.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_reviews": 45,
    "average_rating": 4.3,
    "rating_distribution": {
      "1": 2,
      "2": 3,
      "3": 8,
      "4": 15,
      "5": 17
    }
  }
}
```

## 🛒 Cart Endpoints

### GET /cart
Get current user's cart (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_access_token
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "plan_id": "uuid",
        "quantity": 1,
        "added_at": "2024-01-01T00:00:00Z",
        "plans": {
          "id": "uuid",
          "title": "Modern Farmhouse",
          "price": 89999,
          "images": ["https://example.com/image1.jpg"]
        }
      }
    ],
    "total_items": 3,
    "total_price": 234997
  }
}
```

### POST /cart
Add item to cart (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_access_token
```

**Request Body:**
```json
{
  "plan_id": "uuid",
  "quantity": 1
}
```

### PUT /cart/:itemId
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 2
}
```

### DELETE /cart/:itemId
Remove item from cart.

### POST /cart/checkout
Process cart checkout (requires authentication).

**Headers:**
```
Authorization: Bearer jwt_access_token
```

**Request Body:**
```json
{
  "payment_method": "stripe",
  "payment_details": {
    "stripe_payment_intent_id": "pi_1234567890"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "purchase_id": "uuid",
    "total_amount": 234997,
    "items": [
      {
        "plan_id": "uuid",
        "title": "Modern Farmhouse",
        "price": 89999,
        "download_url": "https://secure.example.com/download/token"
      }
    ]
  }
}
```

## 👥 Users Endpoints

### GET /users/profile
Get current user profile (same as `/auth/profile`).

### PUT /users/profile
Update user profile (same as `/auth/profile`).

### GET /users/purchases
Get user's purchase history (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "plan_id": "uuid",
      "price_paid": 89999,
      "payment_method": "stripe",
      "status": "completed",
      "purchased_at": "2024-01-01T00:00:00Z",
      "plans": {
        "title": "Modern Farmhouse",
        "images": ["https://example.com/image1.jpg"]
      }
    }
  ]
}
```

### GET /users/favorites
Get user's favorite plans (requires authentication).

### POST /users/favorites
Add plan to favorites (requires authentication).

**Request Body:**
```json
{
  "plan_id": "uuid"
}
```

### DELETE /users/favorites/:planId
Remove plan from favorites.

## 📥 Downloads Endpoints

### GET /downloads
Get user's available downloads (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "plan_id": "uuid",
      "file_id": "uuid",
      "download_token": "secure_token",
      "downloaded_at": null,
      "expires_at": "2024-12-31T23:59:59Z",
      "download_count": 0,
      "max_downloads": 5
    }
  ]
}
```

### POST /downloads/:downloadId
Download a file using download token.

**Response:** File download stream

### GET /downloads/:downloadId/status
Check download status and remaining downloads.

## 🏥 Health & Monitoring

### GET /health
Check API health status.

**Response:**
```json
{
  "success": true,
  "message": "PlanMorph API is running",
  "timestamp": "2024-01-01T12:00:00Z",
  "environment": "production",
  "version": "v1"
}
```

## 📊 Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 1000 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Upload endpoints**: 10 requests per 15 minutes per user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 🐛 Error Codes

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `429`: Too Many Requests
- `500`: Internal Server Error

### Error Response Examples

**Validation Error (422):**
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "message": "Invalid or expired token"
  }
}
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "error": {
    "message": "Too many requests, please try again later"
  }
}
```

## 🔧 SDK Usage Examples

### JavaScript/TypeScript Client

```typescript
// Initialize API client
import { PlanMorphAPI } from '@planmorph/api-client';

const api = new PlanMorphAPI({
  baseURL: 'https://api.planmorph.com/api/v1',
  timeout: 10000
});

// Authentication
const { user, tokens } = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Set authentication token
api.setAuthToken(tokens.accessToken);

// Get plans with filters
const plans = await api.plans.getAll({
  category: 'modern',
  bedrooms: 3,
  sort: 'popularity',
  page: 1,
  limit: 20
});

// Add to cart
await api.cart.addItem({
  plan_id: 'plan-uuid',
  quantity: 1
});

// Checkout
const purchase = await api.cart.checkout({
  payment_method: 'stripe',
  payment_details: {
    stripe_payment_intent_id: 'pi_1234567890'
  }
});
```

### cURL Examples

```bash
# Login
curl -X POST https://api.planmorph.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get plans
curl -X GET "https://api.planmorph.com/api/v1/plans?category=modern&bedrooms=3" \
  -H "Authorization: Bearer your_jwt_token"

# Add to cart
curl -X POST https://api.planmorph.com/api/v1/cart \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "plan_id": "uuid",
    "quantity": 1
  }'
```

This API documentation provides comprehensive coverage of all endpoints, request/response formats, and usage examples for the PlanMorph platform.

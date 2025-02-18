# Restaurant Management System API

A robust backend API for restaurant management built with Fastify, TypeScript, and Prisma.

## Features

- 🔐 Authentication & Authorization

  - JWT-based authentication
  - Role-based access control (Owner, Employee, Guest)
  - Google OAuth integration
  - Refresh token mechanism

- 👥 Account Management

  - Employee account management
  - Guest management
  - Password change functionality
  - Profile management

- 🍽️ Restaurant Operations

  - Table management
  - Dish management with categories
  - Order processing
  - Real-time updates via WebSocket
  - Payment handling

- 📊 Dashboard & Analytics
  - Performance indicators
  - Order statistics
  - Sales tracking

## Tech Stack

- **Framework**: Fastify
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Authentication**: JWT (fast-jwt)
- **Real-time**: Socket.IO
- **File Upload**: @fastify/multipart
- **Validation**: Zod
- **Date Handling**: date-fns

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:

````bash
`` git clone https://github.com/quangnv0212/restaurant-management-be
   cd restaurant-management-be

2. Install dependencies:

```bash
npm install
````

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=4000
DOMAIN=localhost
PROTOCOL=http
DATABASE_URL="file:./dev.db"
ACCESS_TOKEN_SECRET=access_token_secret
REFRESH_TOKEN_SECRET=refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=1d
GUEST_ACCESS_TOKEN_EXPIRES_IN=15m
GUEST_REFRESH_TOKEN_EXPIRES_IN=12h
UPLOAD_FOLDER=uploads
INITIAL_EMAIL_OWNER=admin@order.com
INITIAL_PASSWORD_OWNER=123456
SERVER_TIMEZONE=Asia/Saigon
CLIENT_URL=http://localhost:3000
GOOGLE_REDIRECT_CLIENT_URL=http://localhost:3000/vi/login/oauth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_AUTHORIZED_REDIRECT_URI=http://localhost:4000/auth/login/google
PRODUCTION=false
DOCKER=false
PRODUCTION_URL=http://localhost:4000

```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

- `POST /auth/login` - Login with email/password
- `GET /auth/login/google` - Google OAuth login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout user

### Account Management

- `GET /accounts` - List accounts (with pagination)
- `POST /accounts` - Create employee account
- `GET /accounts/detail/:id` - Get account details
- `PUT /accounts/detail/:id` - Update account
- `DELETE /accounts/detail/:id` - Delete account
- `GET /accounts/me` - Get current user profile
- `PUT /accounts/me` - Update current user profile
- `PUT /accounts/change-password` - Change password

### Restaurant Operations

- `GET /tables` - List tables
- `POST /tables` - Create table
- `PUT /tables/:number` - Update table
- `DELETE /tables/:number` - Delete table

- `GET /dishes` - List dishes (with pagination)
- `POST /dishes` - Create dish
- `PUT /dishes/:id` - Update dish
- `DELETE /dishes/:id` - Delete dish

- `POST /orders` - Create order
- `GET /orders` - List orders
- `GET /orders/:orderId` - Get order details
- `PUT /orders/:orderId` - Update order status
- `POST /orders/pay` - Process payment

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run prettier` - Check formatting
- `npm run prettier:fix` - Fix formatting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

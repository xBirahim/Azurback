# Azur - Task Management Application

Azur is a task management application designed for service firms in Senegal. This backend project is built using TypeScript and Express.js, and it leverages several libraries to provide robust functionality and maintainable code.

## Key Libraries and Their Usage

### `@supabase`
Used for interacting with Supabase, a backend-as-a-service providing database, authentication, and storage.

### `cookie-parser`
Used to parse cookies attached to the client request object.

### `cors`
Used to enable Cross-Origin Resource Sharing (CORS) for the application.

### `dotenv`
Used to load environment variables from a `.env` file into `process.env`.

### `drizzle`
An ORM for TypeScript and JavaScript, used for database operations.

### `express`
A web framework for building the RESTful API.

### `express-validator`
Used to validate and sanitize incoming requests.

### `helmet`
Used to secure Express apps by setting various HTTP headers.

### `ioredis`
A Redis client for Node.js, used for caching and other Redis operations.

### `jsonwebtoken`
Used for generating and verifying JSON Web Tokens (JWT) for authentication.

### `morgan`
HTTP request logger middleware for Node.js.

### `nodemailer`
Used for sending emails from the application.

### `pg`
PostgreSQL client for Node.js, used for database interactions.

### `swagger-ui-express`
Used to serve the Swagger UI for API documentation.

### `uuid`
Used to generate unique identifiers.

### `winston`
A logging library used to log information, errors, and other messages.

### `winston-daily-rotate-file`
A transport for winston which logs to a rotating file each day.

### `zod`
A TypeScript-first schema declaration and validation library.

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/xBirahim/azur.git
   cd azur
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables.

### Running the Application

- To start the application in development mode:
  ```sh
  npm run dev
  ```

- To build the application:
  ```sh
  npm run build
  ```

- To start the built application:
  ```sh
  npm run start:dist
  ```

### Running Tests

- To run tests:
  ```sh
  npm test
  ```

- To check test coverage:
  ```sh
  npm run test:coverage
  ```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
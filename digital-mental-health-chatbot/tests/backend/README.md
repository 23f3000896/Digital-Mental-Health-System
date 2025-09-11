# Backend Tests Structure

This directory contains test files for the Node.js backend API, routes, and business logic.

## Test Organization

### /routes/
Tests for API route handlers:
- `authRoutes.test.js` - User authentication API tests
- `userRoutes.test.js` - User management API tests
- `counselorRoutes.test.js` - Counselor-related API tests
- `chatRoutes.test.js` - Chat/messaging API tests
- `moodRoutes.test.js` - Mood tracking API tests
- `forumRoutes.test.js` - Peer support forum API tests
- `crisisRoutes.test.js` - Crisis detection API tests

### /controllers/
Tests for business logic controllers:
- `authController.test.js` - Authentication logic tests
- `userController.test.js` - User management logic tests
- `chatController.test.js` - Chat functionality tests
- `moodController.test.js` - Mood analysis logic tests
- `crisisController.test.js` - Crisis detection logic tests

### /models/
Tests for database models and data validation:
- `User.test.js` - User model tests
- `ChatMessage.test.js` - Chat message model tests
- `MoodEntry.test.js` - Mood tracking model tests
- `CrisisLog.test.js` - Crisis incident model tests
- `Appointment.test.js` - Counselor booking model tests

### /middleware/
Tests for middleware functions:
- `auth.test.js` - Authentication middleware tests
- `validation.test.js` - Input validation middleware tests
- `rateLimiter.test.js` - Rate limiting middleware tests
- `errorHandler.test.js` - Error handling middleware tests
- `logging.test.js` - Request logging middleware tests

### /services/
Tests for external services and integrations:
- `emailService.test.js` - Email notification service tests
- `smsService.test.js` - SMS alert service tests
- `mlService.test.js` - Machine learning service integration tests
- `paymentService.test.js` - Payment processing service tests

### /utils/
Tests for utility functions:
- `database.test.js` - Database utility function tests
- `encryption.test.js` - Data encryption/decryption tests
- `validation.test.js` - Data validation utility tests
- `dateUtils.test.js` - Date manipulation utility tests
- `constants.test.js` - Application constants tests

### /integration/
Integration tests for complete API workflows:
- `userRegistration.test.js` - Complete user registration flow
- `chatSession.test.js` - Full chat session integration test
- `crisisWorkflow.test.js` - Crisis detection and response workflow
- `appointmentBooking.test.js` - Counselor booking process test
- `dataFlow.test.js` - Data processing pipeline tests

## Testing Technologies

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP integration testing
- **MongoDB Memory Server**: In-memory database for testing
- **Sinon**: Test spies, stubs, and mocks
- **Faker.js**: Generate fake test data

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests only
npm run test:integration

# Run unit tests only
npm run test:unit

# Run specific test file
npm test -- --testPathPattern=authRoutes
```

## Test Environment Setup

### Database Setup
- Use in-memory database for tests
- Clean database before each test suite
- Seed test data as needed

### Environment Variables
```bash
NODE_ENV=test
DB_NAME=mental_health_test_db
JWT_SECRET=test_secret_key
```

## Example Test Structure

```javascript
// routes/authRoutes.test.js
const request = require('supertest');
const app = require('../../src/app');
const { connectDB, closeDB, clearDB } = require('../helpers/database');

describe('Auth Routes', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    await clearDB();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    test('should return error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      // Test implementation
    });

    test('should reject invalid credentials', async () => {
      // Test implementation
    });
  });
});
```

## Test Data Management

### Fixtures
Create reusable test data in `/fixtures/` directory:
- `users.js` - Sample user data
- `chatMessages.js` - Sample chat messages
- `moodEntries.js` - Sample mood tracking data
- `appointments.js` - Sample appointment data

### Test Helpers
Common testing utilities in `/helpers/` directory:
- `database.js` - Database setup and cleanup
- `auth.js` - Authentication test helpers
- `factories.js` - Data factory functions
- `assertions.js` - Custom assertion helpers

## Mocking Strategy

### External Services
Mock external API calls and services:
```javascript
jest.mock('../src/services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  sendCrisisAlert: jest.fn().mockResolvedValue(true)
}));
```

### Database Operations
Use in-memory database or mocks for consistent testing:
```javascript
const mockQuery = jest.fn();
jest.mock('../src/config/db', () => ({
  query: mockQuery
}));
```

## Coverage Targets

- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

## Continuous Integration

Tests should run on:
- Every pull request
- Main branch commits
- Scheduled daily runs
- Before deployment

## Security Testing

Include security-focused tests:
- Authentication bypass attempts
- SQL injection prevention
- XSS protection
- Rate limiting effectiveness
- Data sanitization
- CSRF protection
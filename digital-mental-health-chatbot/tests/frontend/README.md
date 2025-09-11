# Frontend Tests Structure

This directory contains test files for the React frontend components and functionality.

## Test Organization

### /components/
Tests for individual React components:
- `Navbar.test.js` - Navigation bar component tests
- `Chatbot.test.js` - AI chatbot interface tests  
- `MoodTracker.test.js` - Mood tracking component tests
- `PeerSupportForum.test.js` - Forum functionality tests
- `CounselorBooking.test.js` - Booking system tests
- `CalmRoomVR.test.js` - VR calm room component tests
- `AdminDashboard.test.js` - Admin interface tests
- `ResourcesHub.test.js` - Resource hub tests

### /pages/
Tests for page-level components:
- `Dashboard.test.js` - Main dashboard tests
- `Login.test.js` - Authentication page tests
- `Profile.test.js` - User profile tests
- `CrisisSupport.test.js` - Crisis support page tests

### /utils/
Tests for utility functions:
- `api.test.js` - API helper function tests
- `validation.test.js` - Form validation tests
- `dateUtils.test.js` - Date formatting utility tests
- `localStorage.test.js` - Local storage utility tests

### /hooks/
Tests for custom React hooks:
- `useAuth.test.js` - Authentication hook tests
- `useSocket.test.js` - Socket connection hook tests
- `useMoodTracker.test.js` - Mood tracking hook tests

### /integration/
Integration tests for user workflows:
- `chatFlow.test.js` - Complete chat interaction tests
- `crisisDetection.test.js` - Crisis detection workflow tests
- `userJourney.test.js` - End-to-end user journey tests

## Testing Technologies

- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking
- **Cypress**: End-to-end testing (optional)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test Chatbot.test.js
```

## Test Naming Convention

- Component tests: `ComponentName.test.js`
- Utility tests: `utilityName.test.js`
- Integration tests: `featureName.integration.test.js`
- Hook tests: `useHookName.test.js`

## Example Test Structure

```javascript
// components/Chatbot.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chatbot from '../src/components/Chatbot';

describe('Chatbot Component', () => {
  test('renders chat interface', () => {
    render(<Chatbot />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  test('sends message on submit', () => {
    // Test implementation
  });

  test('displays crisis warning when detected', () => {
    // Test implementation  
  });
});
```
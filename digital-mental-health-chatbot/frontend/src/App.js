import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Import components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Chatbot from './components/Chatbot';
import MoodTracker from './components/MoodTracker';
import PeerSupportForum from './components/PeerSupportForum';
import CounselorBooking from './components/CounselorBooking';
import CalmRoomVR from './components/CalmRoomVR';
import AdminDashboard from './components/AdminDashboard';
import ResourcesHub from './components/ResourcesHub';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile';
import CrisisSupport from './components/CrisisSupport';

// Import context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Pink
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#10b981', // Emerald
    },
    warning: {
      main: '#f59e0b', // Amber
    },
    error: {
      main: '#ef4444', // Red
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Main App Layout Component
const AppLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {user && <Navbar />}
      <Box sx={{ flexGrow: 1, pt: user ? 8 : 0 }}>
        {children}
      </Box>
    </Box>
  );
};

// App Content Component
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <AppLayout>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to="/dashboard" />} 
        />
        
        {/* Protected Routes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mood-tracker" 
          element={
            <ProtectedRoute>
              <MoodTracker />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/forum" 
          element={
            <ProtectedRoute>
              <PeerSupportForum />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/counselor-booking" 
          element={
            <ProtectedRoute>
              <CounselorBooking />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calm-room" 
          element={
            <ProtectedRoute>
              <CalmRoomVR />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resources" 
          element={
            <ProtectedRoute>
              <ResourcesHub />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/crisis-support" 
          element={
            <ProtectedRoute>
              <CrisisSupport />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AppLayout>
  );
};

// Main App Component
function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <SocketProvider>
            <Router>
              {!isOnline && (
                <Box 
                  sx={{ 
                    bgcolor: 'error.main', 
                    color: 'white', 
                    p: 1, 
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}
                >
                  You are currently offline. Some features may not be available.
                </Box>
              )}
              <AppContent />
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
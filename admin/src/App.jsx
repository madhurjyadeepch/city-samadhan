// src/App.jsx

import { useState, useEffect } from 'react';
import './App.css';
import SignInPage from './pages/SignInPage';
import Homepage from './pages/Homepage';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // This effect checks for an existing token when the app loads
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      setIsSignedIn(true);
    }
    setLoading(false);
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />}>
        <Route 
          index 
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <Homepage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='signin' 
          element={
            isSignedIn ? <Navigate to="/" replace /> : <SignInPage setIsSignedIn={setIsSignedIn} />
          } 
        />
        <Route path='*' element={<ErrorPage />} />
      </Route>
    )
  );

  // Display a blank screen while checking for the token to prevent flickering
  if (loading) {
    return null; 
  }

  return (
    <RouterProvider router={router} />
  );
}

export default App;
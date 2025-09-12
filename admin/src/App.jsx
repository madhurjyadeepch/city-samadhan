// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import SignInPage from './pages/SignInPage';
import Homepage from './pages/Homepage';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import ErrorPage from './pages/ErrorPage';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

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
        {/* We define both routes here; the layout will decide which one to show */}
        <Route index element={<Homepage />} />
        <Route path='signin' element={<SignInPage setIsSignedIn={setIsSignedIn} />} />
        <Route path='*' element={<ErrorPage />} />
      </Route>
    )
  );

  if (loading) {
    return null; 
  }

  return <RouterProvider router={router} />;
}

export default App;
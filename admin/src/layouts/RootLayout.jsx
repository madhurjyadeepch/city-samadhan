// src/layouts/RootLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from './AppLayout'; // Import the new layout

const RootLayout = ({ isSignedIn, setIsSignedIn }) => {
  return isSignedIn ? (
    <AppLayout isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
  ) : (
    <Outlet />
  );
};

export default RootLayout;
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const RootLayout = ({ isSignedIn, setIsSignedIn }) => {
  return (
    <div>
      {isSignedIn && <Navbar setIsSignedIn={setIsSignedIn} />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
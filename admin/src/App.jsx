import { useState } from 'react'
import './App.css'
import SmallReport from './components/SmallReport'
import SignIn from './components/SignIn'
import Navbar from './components/Navbar'
import SignInPage from './pages/SignInPage'
import Homepage from './pages/Homepage'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import ErrorPage from './pages/ErrorPage'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Homepage />}/>
        <Route path='signin' element={<SignInPage />} />
        <Route path='*' element={<ErrorPage />} />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App

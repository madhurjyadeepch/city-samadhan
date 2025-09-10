import { useState } from 'react'
import './App.css'
import SmallReport from './components/SmallReport'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Navbar from './components/Navbar'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'
import Homepage from './pages/Homepage'

function App() {
  return (
    <>
      <SmallReport username={"Krishna Kumar"} post_time={"2 hours ago"} report_title={"Flooding near Kahilipara"}/>
      <SmallReport username={"Jaykishan Pandey"} post_time={"1 min ago"} report_title={"ATMKBFJG"}/>
      {/* <SignInPage /> */}
      {/* <Homepage /> */}
    </>
  )
}

export default App

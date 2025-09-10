import React from 'react'
import SignIn from '../components/SignIn'
import signupbackdrop from '../assets/signup_backdrop.png'

const SignInPage = () => {
    React.useEffect(() => {
    // Set body background
    document.body.style.backgroundImage = `url(${signupbackdrop})`
    document.body.style.backgroundSize = '350px'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'repeat'

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = ''
      document.body.style.backgroundSize = ''
      document.body.style.backgroundPosition = ''
      document.body.style.backgroundRepeat = ''
    }
  }, [])
  return (
    <div>
      <SignIn />
    </div>
  )
}

export default SignInPage

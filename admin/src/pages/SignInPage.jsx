import React from 'react'
import SignIn from '../components/SignIn'
import signinbackdrop3 from '../assets/signin_backdrop3.png'

const SignInPage = ({setIsSignedIn}) => {
    React.useEffect(() => {
    document.body.style.backgroundImage = `url(${signinbackdrop3})`
    document.body.style.backgroundSize = '1920px'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundColor = 'black'

    return () => {
      document.body.style.backgroundImage = ''
      document.body.style.backgroundSize = ''
      document.body.style.backgroundPosition = ''
      document.body.style.backgroundRepeat = ''
      document.body.style.backgroundColor = ''
    }
  }, [])
  return (
    <div>
      <SignIn setIsSignedIn={setIsSignedIn}/>
    </div>
  )
}

export default SignInPage

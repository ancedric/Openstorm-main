import Signup from '../Components/forms/signupForm'
import Login from '../Components/forms/signinForm'
import { useState, useMemo } from 'react'
import {useParams} from 'react-router-dom'
import AuthImage from '../assets/supermarket.jpg'

const Auth = () => {
    const {plan} = useParams()
    
    const initialSignupState = useMemo(() => !!plan, [plan]);
    const initialLoginState = useMemo(() => !plan, [plan]);

    const [signupOpen, setSignupOpen] = useState (initialSignupState)
    const [loginOpen, setLoginOpen] = useState (initialLoginState)

    const openSignup = () => {
        setSignupOpen(true)
        setLoginOpen(false)
    }
    const openLogin = () => {
        setSignupOpen(false)
        setLoginOpen(true)
    }
  return (
    <div className='auth-form'>
        <h1>
            Authentication
        </h1>
        <div className='auth-ctn'>
            <div className="auth-ctn-form">
                <div className='form-selector'>
                    <div className={`form-title ${signupOpen ? 'form-selected' : ''}`} onClick={openSignup}>Signup</div>
                    <div className={`form-title ${loginOpen ? 'form-selected' : ''}`} onClick={openLogin}>Login</div>
                </div>
                <div className='forms'>
                    <div>
                        <div className={`swith-form ${!signupOpen ? 'list-invisible' : ''}`}><Signup plan={plan} /></div>
                        <div className={`swith-form ${!loginOpen ? 'list-invisible' : ''}`}><Login /></div>
                    </div>
                </div>
            </div>
            <div className="auth-ctn-img">
                <img src={AuthImage} />
            </div>
        </div>
        <div className="switch-choice">
            {loginOpen ? (
                <p>{"You don't have an account ?"} <span className='span-indication' onClick={openSignup}>Start here !</span></p>
            ) : (
                <p>Already have an account ? {<span className='span-indication' onClick={openLogin}>Log in !</span>}</p>
            )}
        </div>
    </div>
  )
}

export default Auth
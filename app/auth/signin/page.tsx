'use client'

import { useEffect, useState, useRef } from 'react'
import { setCookie } from "cookies-next";

import {Amplify, Auth} from 'aws-amplify'
import config from '@/cognito/cognito-config'

Amplify.configure(config)

export default function SignInHome() {

    const [code, setCode] = useState('')
    const [jwtToken, setJwtToken] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const count = useRef('')
    const [cognitoUser, setCognitoUser] = useState(null)

    async function handleSignIn() {

        try {
            const cognitoUser = await Auth.signIn(username, password);
            
                setCognitoUser(cognitoUser);
                //localStorage.setItem('cognitoUser', JSON.stringify(cognitoUser))
            
        }   catch (error) {
                console.log('error signing in =>', error);
            }
    
    }
    
    async function handleConfirmSignIn() {

        try {
            const loggedUser = await Auth.confirmSignIn(cognitoUser, code, 'SMS_MFA')
            
                console.log(code)
                console.log(loggedUser)
      
                const JwtToken = loggedUser.getSignInUserSession()?.getAccessToken()?.getJwtToken() || '';    

                setCookie('token', JwtToken, {
                    httpOnly: false,
                    secure: false,
                    
                
                  })

                alert("Logged In")
          
            }   catch (error) {
                    console.log('error signing in', error);
                }
    }
    

    return (
        <div className=" flex flex-col justify-center items-center bg-black h-[calc(100vh-96px)]  bg-gradient-to-r from-gray-900 to-gray-700"> 
            
            <div className="flex flex-col  bg-gray-700 w-72 p-4 border-4 text-white gap-4" >
                                    
                    <div className='  bg-gray-600 text-center'> SIGN IN  </div>
                    <label>Username: <input className=' bg-gray-800' type="text" value={username}  onChange={(e) => setUsername(e.target.value)} />  </label>
                    <label>Password: <input  className=' bg-gray-800' type="text" value={password}  onChange={(e) => setPassword(e.target.value)} />  </label>
                    <button className="ring ring-offset-2 ring-blue-800 w-24 h-10 bg-gray-700 rounded-md"
                        type='button'
                        onClick={ handleSignIn }
                        >Sign In
                    </button>

            </div>

            <div className=' flex flex-col  bg-gray-700 w-72 p-4 border-4 text-white gap-4'>
                <div className=' bg-gray-600 text-center'> CODE VERIFICATION </div>
                <label>MFA Code: <input className=' bg-gray-800'  type="text" value={code}  onChange={(e) => setCode(e.target.value)} />  </label>
                <button className="ring ring-offset-2 ring-blue-800 w-24 h-10 bg-gray-700 rounded-md"
                    type='button'
                    onClick={ handleConfirmSignIn }
                    >Verify Code
                </button>
            </div>

        </div>

    )
}

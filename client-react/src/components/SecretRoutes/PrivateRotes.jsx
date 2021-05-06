import { useHistory } from "react-router-dom";
import React, { useState, useEffect  } from 'react'
import loggedin from '../../scripts/authentication'



export default function PrivateRoute({ component: Component, ...rest }) {

    let history = useHistory();

    const [authenticated, setAutheticated] = useState(false)


    useEffect(() => {
        loggedin.isAuthenticatedCb((auth)=>{
            if(auth == true){
                setAutheticated(auth)
            }else{
             {history.push('/')} 
            }
        })
     }, [])



    
     console.log(authenticated,' what to render false->login failed->redirect to /   true-><authenticateduser>');   
    return authenticated ? (
        <Component {...rest}  />
    ) : ( 
    null
    )
  }

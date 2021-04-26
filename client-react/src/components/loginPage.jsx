import React, { useState, useEffect  } from 'react'
import '../style/loginRegistrationPage.css'
import { Link } from "react-router-dom";
import loggedin from '../scripts/authentication'
import { useHistory } from "react-router-dom";
import axios from 'axios';


function LoginPage(props) {
        // const [logedin, setLogedin] = useState(false)
        const [loginPassword, setloginPassword] = useState('')
        const [loginUsername, setloginUsername] = useState('')
    


        let history = useHistory();


    const handleLogin = async e =>{
        e.preventDefault()

    await loggedin.login(loginUsername,  loginPassword, (str)=>{
        setloginPassword('')
        setloginUsername('')
        props.handleDataFromLoginToProfile(str)
        history.push('/user')
    })  
    }

    const gitHubAuth = () =>{
        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:4000/auth/github"
        }).then( res =>{
            history.push('/user')
         }
        )
    }




    useEffect(()=>{

    },[])

    return (
        <div className='AuthOuterDiv'>
                <h1 className='AuthTitle'>Login</h1>
            <form onSubmit={handleLogin}  className='AuthForm' >
                <div className='AuthInputDiv' >
                    <table className='AuthTabelTag' htmlFor='username'>username</table>
                    <input autoComplete='off' className='AuthInputTag' value={loginUsername} onChange={e => setloginUsername(e.target.value) } type="text" name='username' id='username' required/>
                </div>
                <div className='AuthInputDiv' >
                    <table className='AuthTabelTag' htmlFor='password' >password</table>
                    <input autoComplete='off' className='AuthInputTag' value={loginPassword} onChange={e => setloginPassword(e.target.value) } type="text" name='password' id='password' required/>
                </div>
                    <Link className='AuthLinkTag' to="/registration">Registration</Link>
                    <input type="submit"/>  
            </form>
                    <a href="http://localhost:4000/auth/github">Login with github account</a>
        </div>
    )
}

export default LoginPage

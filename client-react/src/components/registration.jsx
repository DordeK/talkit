import React, { useState, useEffect  } from 'react'
import '../style/loginRegistrationPage.css'
import { Link } from "react-router-dom";
import loggedin from '../scripts/authentication'
import { useHistory } from "react-router-dom";


function Registration() {
        
        const [registrationPassword, setRegistrationPassword] = useState('')

        const [registrationUsername, setRegistrationUsername] = useState('')
    
        const [error, setError] = useState('')
    
        
        let history = useHistory();


    const handleRegistration = async e =>{
        e.preventDefault()
        console.log('---------------------------------------------');
        try{
        await loggedin.registration(registrationUsername,  registrationPassword, (str)=>{
            
            if(str != true){
                setRegistrationPassword('')
                setRegistrationUsername('')
                setError(str)
            }else{
            setRegistrationPassword('')
            setRegistrationUsername('')
            setError('')
            history.push('/')
            }
        })  
    }catch(e){
        console.log(e);
    }

    }


    useEffect(()=>{

    })
    return (
        
        <div className='AuthOuterDiv'>
                <h1 className='AuthTitle'>Registration</h1>
            <form onSubmit={handleRegistration} className='AuthForm'>
                <div className='AuthInputDiv'>
                    <table  className='AuthTabelTag' htmlFor='username' >username</table>
                    <input required autoComplete='off' className='AuthInputTag' onChange={e => setRegistrationUsername(e.target.value) } type="text" name='username' id='username' required/>
                </div>

                <div className='AuthInputDiv' >
                    <table  className='AuthTabelTag' htmlFor='password' >password</table>
                    <input required autoComplete='off' className='AuthInputTag' onChange={e => setRegistrationPassword(e.target.value) } type="text" name='password' id='password' required/>
                </div>
                <Link  className='AuthLinkTag' to="/" >Login</Link>
                <input type="submit" name="Submit" value="Register"  />
                    {error == '' ? null :<div style={{backgroundColor:'red',padding:'10px 20px', marginTop:'20px'}}>{error}</div>}
            </form>

        </div>
    )
}

export default Registration
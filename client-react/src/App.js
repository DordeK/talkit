import './style/App.css';
import React, { useState, useEffect  } from 'react'
import {BrowserRouter as Router,Switch,Route, Link   } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Registration from './components/registration'
import Login from './components/loginPage'
import authenticatedUser from './components/authenticatedUser'
import loggedin from './scripts/authentication'
import PrivateRoutes from'./components/SecretRoutes/PrivateRotes'
import axios from 'axios';

function App() {

  let history = useHistory();
  const [userData, setUserData ] =useState({})


  const  handleLogin = async () => {
    if(loggedin.loggedin){
      await loggedin.logout(()=>history.push('/'))
      history.push('/user')
  }else{
      await loggedin.login('1','1',()=>history.push('/user'));
      history.push('/')
  }}
  //handler used for passing user info between who sibling components (Login and PrivateRoute) 
  const handleDataFromLoginToProfile = (data) =>{
    setUserData(data)
  }

  const  logout = async () => {
      // await loggedin.logout(()=>history.push('/'))
      await loggedin.logout(()=>{})
  }


  const  login = async () => {
    // await loggedin.login(()=>history.push('/user'))
      await loggedin.login('1','1',()=>{})
  }


  const  isAuth = async () => {
     let isAuth = await loggedin.isAuthenticated()
}


const  isAuth2 = async () => {
  let isAuth = await loggedin.loggedin
  console.log(isAuth);
}


const getdata = async () =>{
    await loggedin.getData(()=>{})
}



   
 
  return (  
    <div className="App"> 
      <Switch>
        <Route exact  path='/registration' component={Registration}/>
        <Route exact  path='/' > <Login  handleDataFromLoginToProfile={handleDataFromLoginToProfile} /> </Route>
        <PrivateRoutes  path='/user' userData={userData} component={authenticatedUser} />
      </Switch>
      {/* <button onClick={login} > login</button>
      <button onClick={()=>{history.push('/')}}>redirect</button>
      <button onClick={()=>{history.push('/user')}}>redirect-user</button>
      <button onClick={logout}>logout</button>
      <button onClick={isAuth}>isAuth</button>
      <button onClick={getdata}>getData</button> */}
    </div>
  );
}

export default App;

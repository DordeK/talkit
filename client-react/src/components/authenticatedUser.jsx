import React, { useState, useEffect  } from 'react'
import {BrowserRouter as Router,Switch,Route,Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Chat from './authenticated/Chat'
import Profile from './authenticated/Profile'
import ChooseChat from './authenticated/ChooseChat'
import PrivateChat from './authenticated/PrivateChat'
import NavBar from './authenticated/NavBar'
import nextId from "react-id-generator";


const ENDPOINT = "http://localhost:4000";
// let roomId = nextId();
const socket = socketIOClient(ENDPOINT,{autoConnect: false,});

socket.auth =  'dorde';
socket.connect()
console.log(window.localStorage.getItem('username'));
socket.emit('authentication', {
    token: window.localStorage.getItem('username'),
  });




function AuthenticatedUser(props) {
    
    // console.log(props.userData.user.username,'<---props in authenticatedUser');
    const username ='dorde'

    useEffect(() => {
        socket.on('dsc', obj=>{    
            window.localStorage.removeItem(obj);
            window.location.reload(false);
        })
    }, [])

    return (
        <div>
            <NavBar socket={socket}/>
            <Router>
                <Switch>
                    <Route  path='/user/chat' >
                            <Chat socket={socket}/>
                    </Route>
                    <Route exact  path='/user'  >
                         <Profile userData={props.userData.user} /> 
                    </Route>
                    <Route path='/user/choosechat'>
                        <ChooseChat socket={socket}/>
                    </Route>
                    <Route path='/user/privatechat/:id' >
                        <PrivateChat roomId={nextId()} socket={socket}/>
                    </Route>
                </Switch>
            </Router>   
        </div>
    )
}

export default AuthenticatedUser



import React, { useState, useEffect  } from 'react'
import {BrowserRouter as Router,Switch,Route,Link } from "react-router-dom";
import Chat from './authenticated/Chat'
import Profile from './authenticated/Profile'
import ChooseChat from './authenticated/ChooseChat'
import PrivateChat from './authenticated/PrivateChat'
import NavBar from './authenticated/NavBar'
import nextId from "react-id-generator";
import axios from 'axios';


import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4000";
// let roomId = nextId();
const socket = socketIOClient(ENDPOINT,{autoConnect: false,});


function AuthenticatedUser(props) {    
    // console.log(props.userData.user.username,'<---props in authenticatedUser');
    const username ='dorde'
    useEffect(() => {        
        socket.auth =  'dorde';
        socket.connect()
        console.log(window.localStorage.getItem('username'));
        
        socket.emit('authentication', {
            token: window.localStorage.getItem('username'),
        });

        socket.on('userDisconected',(userID)=>{
            window.localStorage.removeItem(userID);
        })  

        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:4000/onlineUsers"
        }).then( res =>{
            let obj = {};
            // console.log('localstorage upload');
            res.data.map(user => {
                obj[user._id]=0
                if (user.username == window.localStorage.getItem('username')){
                    window.localStorage.setItem('userId', user._id);
                }    
            })
        })


        socket.on('privateChatMsg', obj =>{
            let st = window.localStorage.getItem(obj.posiljateljId);
            st = parseInt(st)
            window.localStorage.setItem(obj.posiljateljId, st+1)
            // window.location.reload(false);
        });


        socket.on('dsc', obj=>{    
            window.localStorage.removeItem(obj);
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



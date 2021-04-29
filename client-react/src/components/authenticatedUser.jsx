import React, { useState, useEffect  } from 'react'
import {BrowserRouter as Router,Switch,Route,Link } from "react-router-dom";
import Chat from './authenticated/Chat'
import Profile from './authenticated/Profile'
import ChooseChat from './authenticated/ChooseChat'
import PrivateChat from './authenticated/PrivateChat'
import NavBar from './authenticated/NavBar'
import nextId from "react-id-generator";
import $ from "jquery";
import axios from 'axios';


import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4000";
const socket = socketIOClient(ENDPOINT,{autoConnect: false,});


function AuthenticatedUser(props) {    

    useEffect(() => {        
        socket.connect()
        // posiljanje auth imena kot registreacija v socket.io 
        socket.emit('authentication', {
            token: window.localStorage.getItem('username'),
        });

        socket.on('userLoggedin',(data)=>{
                console.log(data.userId);
                if(data.userId == undefined){
                window.localStorage.setItem(data.user._id,0)
            }else{
                window.localStorage.setItem(data.userId,0)
            }
        }) 

        socket.on('userDisconected',(userID)=>{
            window.localStorage.removeItem(userID);
        })  


        let obj ={
            username: window.localStorage.getItem('username'),
            userId: window.localStorage.getItem('userId')
        }


        socket.on('privateChatMsg', obj =>{
            let st = window.localStorage.getItem(obj.posiljateljId);
            st = parseInt(st)
            window.localStorage.setItem(obj.posiljateljId, st+1)
            // if(window.location.pathname === '/user/choosechat'){
                // window.location.reload(false);
            // }
        });


        socket.on('dsc', obj=>{    
            window.localStorage.removeItem(obj);
        })
    }, [])

    useEffect(() => {
        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:4000/onlineUsers"
        }).then( res =>{
            res.data.map(user => {
                if (user.username == window.localStorage.getItem('username') && (window.localStorage.getItem('userId') == undefined || window.localStorage.getItem('img') == undefined) ){
                    window.localStorage.setItem('userId', user._id);
                    window.localStorage.setItem('img', user.img || user.photo);
                }else if(window.localStorage.getItem(user._id) == undefined|| window.localStorage.getItem(user._id) == null ){
                    window.localStorage.setItem(user._id, 0);
                }    
            })
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



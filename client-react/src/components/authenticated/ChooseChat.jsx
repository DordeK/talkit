import React, { useState, useEffect  } from 'react'
import {BrowserRouter as Router,Switch,Route,Link } from "react-router-dom";
import axios from 'axios';
let c=0
function ChooseChat(props) {
    const [onlineUsers , setOnlineUsers ] = useState([]) 

    let socket = props.socket
    
    
    useEffect(() => {
        // onlineUsers
        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:4000/onlineUsers"
        }).then( res =>{
            let obj = {};
            res.data.map(user => {
                
                obj[user._id]=0
                if (user.username == window.localStorage.getItem('username')){
                    window.localStorage.setItem('userId', user._id);
                }    
            })
                setOnlineUsers(res.data)
            })
            
            socket.on('privateChatMsg', obj =>{
                let st = window.localStorage.getItem(obj.posiljateljId);
                st = parseInt(st)
                window.localStorage.setItem(obj.posiljateljId, st+1)
                window.location.reload(false);
            });

        }, [])

        let onlineUsersUX;
        let counter=0
        if(onlineUsers == []){
            let onlineUsersUX=<></>
        }{
            onlineUsersUX = onlineUsers.map(user =>{
                counter++
                if(user.username == window.localStorage.getItem('username')){
                }else{
                return(
                    <Link key={counter} style={{color:'black',textDecoration:'none',display:'flex', 'justifyContent':'space-between', margin:'0',alignItems:'center',border:'1px solid black', backgroundColor:'lightblue','padding':'10px 20px','marginTop':'10px'}} to={`/user/privatechat/${user._id}`}>
                        <img style={{height:'60px',borderRadius:'50%'}} src={user.img||user.photo} alt="slika"/>
                        <h4 >{user.username}</h4>
                        {window.localStorage.getItem(user._id)!=0 && window.localStorage.getItem(user._id) != undefined && window.localStorage.getItem(user._id) != NaN ? <h3 style={{backgroundColor:'red', borderRadius:'50%', padding:'5px 10px'}} >{window.localStorage.getItem(user._id)}</h3>:null}
                    </Link>
                    )
                }
                })
            }


    return (
        <div>
            <div style={{height:'70vh',display:'flex', flexDirection:'column','width':'100%'}}>
                {onlineUsersUX}
            </div>
            <div style={{height:'70vh',display:'flex','width':'100%', justifyContent:'center','alignItems':'center'}}>
                    <Link to='/user/chat'>chat whit everyone at once</Link>
            </div>
        </div>
    )
}

export default ChooseChat

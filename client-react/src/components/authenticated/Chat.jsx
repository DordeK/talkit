
import React, { useState, useEffect  } from 'react'
import SendSharpIcon from '@material-ui/icons/SendSharp';
import {BrowserRouter as Router,Switch,Route,Link } from "react-router-dom";
const ENDPOINT = "http://localhost:4000";



function Chat(props) {
    const socket = props.socket
    const [messages, setMessages] = useState([])
    
    
    
    // console.log('-----------------------------------------Chat---------------------------------------------');
    
    useEffect(()=>{
        // se sporozi ko se nekdo jojna
        socket.on('user', (uporabnik)=>{
            console.log(uporabnik);
        })
        // sprejem messaga 
        socket.on('chatmessage', (msg)=>{
            // console.log(msg);
            setMessages(prevMesages => [...prevMesages,msg])
        })
        // return () => socket.disconnect();
    },[])
    
    let sporocila;
    if(messages == []){
    }else{
        let counter=0
     sporocila = messages.map(sporocilo =>{
        //  console.log(sporocilo,'<-----------sporocilo');
         counter++
        return(
            <div key={counter} style={{display:'flex',alignItems:'center', justifyContent:`${sporocilo.name == window.localStorage.getItem('username') ? "flex-end": "flex-start"}`}}>
                <img style={{borderRadius:'50%',height:'30px','border':'1px solid grey',margin:'0 2px'}} src={sporocilo.img} alt="slika"/>
                <p  style={{borderRadius:'30px','width':'40%','border':'1px solid black','height':'40px',display:'flex','justifyContent':'center',alignItems:'center'}}>{sporocilo.message}</p>
            </div>
            )
        })
    }    
        
        useEffect(()=>{
            document.getElementById('screen').scrollTop = document.getElementById('screen').scrollHeight;
        })


    const sendMesage = () =>{
        let msg = document.getElementById("msg").value
        if(msg == '') return
        socket.emit('chatmessage', msg)
        document.getElementById("msg").value=''
        document.getElementById('msg').focus()
    }

    return (
        <div>
            <div id='screen' style={{height:'84vh','border':'1px solid grey','overflowY':'auto'}}>
                {sporocila}
            </div>

            <div style={{display:'flex','flexDirection':'row','justifyContent':'center','height':'5vh','alignItems':'center'}}>
                <input autoComplete='off' id='msg' style={{width:'90%','height':'90%','border':'1px solid black'}} type="text"/>
                <SendSharpIcon style={{'borderRadius':'50%','border':'1px solid grey','padding':'5px','margin':'0 10px'}} onClick={sendMesage}/>
            </div>
        </div>
    )
}

export default Chat

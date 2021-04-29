
import React, { useState, useEffect  } from 'react'
import SendSharpIcon from '@material-ui/icons/SendSharp';



function Chat(props) {
    const socket = props.socket
    const [messages, setMessages] = useState([])
    
    
    // console.log('-----------------------------------------Chat---------------------------------------------');
    
    useEffect(()=>{
        // se sporozi ko se nekdo jojna

        // sprejem messaga 
        socket.on('chatmessage', (msg)=>{
            // console.log(msg);
            setMessages(prevMesages => [...prevMesages,msg])
        })

    },[])

    
    let sporocila;
    if(messages == []){
    }else{
        let counter=0
        sporocila = messages.map(sporocilo =>{
            counter++
            return(
            <div key={counter} style={{display:'flex',alignItems:'center', justifyContent:`${sporocilo.name == window.localStorage.getItem('username') ? "flex-end": "flex-start"}`}}>
                    <img style={{borderRadius:'50%',height:'40px','border':'1px solid grey',margin:'0 2px','order':`${sporocilo.name == window.localStorage.getItem('username') ? "1": "0"}`}} src={sporocilo.img} alt="slika"/>
                <p  style={{borderRadius:'30px','width':'40%','border':'1px solid black','height':'40px',display:'flex','justifyContent':'center',alignItems:'center','position':'relative'}}>
                    {sporocilo.message}
                    <p style={{position:'absolute','top':'-40px','left':`${sporocilo.name == window.localStorage.getItem('username') ? "87%": "0"}`}}>{sporocilo.name}</p>
                </p>
            </div>
            )
        })
    }    
    
    useEffect(()=>{
        document.getElementById('screen').scrollTop = document.getElementById('screen').scrollHeight;
    })
    
    useEffect(()=>{
        document.addEventListener("keyup", function(event) {
            if(event.keyCode === 13){
                sendMesage()
            }
        })
    },[])

    const sendMesage = () =>{
        let msg
        try{
        msg = document.getElementById("msg").value
        }catch(e){
            console.log(e);
        }
        if(msg == '' || msg == null) return
        socket.emit('chatmessage', msg)
        document.getElementById("msg").value=''
        document.getElementById('msg').focus()
    }

    return (
        <div>
            <div id='screen' style={{height:'84vh','border':'1px solid grey','overflowY':'auto', paddingTop:'10px'}}>
                {sporocila}
            </div>

            <div style={{display:'flex','flexDirection':'row','justifyContent':'center','height':'5vh','alignItems':'center'}}>
                <input autoComplete='off' id='msg' style={{width:'97%','height':'90%','border':'1px solid grey'}} type="text"/>
                <SendSharpIcon id='SendSharpIcon' style={{'borderRadius':'50%','border':'1px solid grey','padding':'10px','margin':'0 10px'}} onClick={sendMesage}/>
            </div>
        </div>
    )
}

export default Chat

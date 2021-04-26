import React, { useState, useEffect  } from 'react'
import { useHistory, useParams } from 'react-router-dom'

export default function PrivateChat(props) {
    
    let socket = props.socket
    const [sporocila, setSporocila] = useState([])
    const {id} = useParams()
    
    
     
    useEffect(() => {
        socket.on('privateChatMsg', obj =>{
            let {sporocilo, posiljatelj, sprejemnik, posiljateljId } =obj
            if(posiljateljId == id){
                let obj = {
                    sporocilo,
                    posiljatelj
                }
                setSporocila(prevMesages => [...prevMesages,obj])
            }
        });

        window.localStorage.setItem(id,0)  

    }, [])

    const sendMesage = () =>{
        let msg = document.getElementById("msg").value
        let obj = {
            sporocilo:msg,
            posiljatelj:window.localStorage.getItem('username'),
            sprejemnik: id,
            posiljateljId:window.localStorage.getItem('userId')
        }
        // console.log(obj);
        if(msg == '') return
        
        socket.emit('privateChatMsg', obj)
        let obj1 = {
            sporocilo:msg,
            posiljatelj:window.localStorage.getItem('username')
        }
        setSporocila(prevMesages => [...prevMesages,obj1])
        document.getElementById("msg").value=''
        document.getElementById('msg').focus()
    }



    let sporocilaOblikovana;
    if(sporocila == []){
    }else{
        let counter=0
        sporocilaOblikovana = sporocila.map(sporocilo =>{
        //  console.log(sporocilo,'<-----------sporocilo');
         counter++
        return(
            <div key={counter} style={{display:'flex',alignItems:'center', justifyContent:`${sporocilo.posiljatelj == window.localStorage.getItem('username') ? "flex-end": "flex-start"}`}}>
                <img style={{borderRadius:'50%',height:'30px','border':'1px solid grey',margin:'0 2px'}} src={sporocilo.img} alt="slika"/>
                <p  style={{borderRadius:'30px','width':'40%','border':'1px solid black','height':'40px',display:'flex','justifyContent':'center',alignItems:'center'}}>{sporocilo.sporocilo}</p>
            </div>
            )
        })
    }    
        
        useEffect(()=>{
            document.getElementById('screen').scrollTop = document.getElementById('screen').scrollHeight;
        })

    
    return (
        <div>
            <div id='screen' style={{height:'80vh','border':'1px solid grey','overflowY':'auto'}}>
                {sporocilaOblikovana}
            </div>
            <div style={{display:'flex','flexDirection':'row','justifyContent':'center','height':'5vh'}}>
                <input autoComplete='off' id='msg' style={{width:'80%'}} type="text"/>
                <button style={{width:'20%'}} onClick={sendMesage}>poslji</button>
            </div>
        </div>
    )
}

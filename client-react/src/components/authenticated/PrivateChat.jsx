import React, { useState, useEffect  } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import SendSharpIcon from '@material-ui/icons/SendSharp';
import func from '../../scripts/authentication'

export default function PrivateChat(props) {
    
    let socket = props.socket
    const [sporocila, setSporocila] = useState([])
    const [accepter, setAccepter] = useState({username:'',img:''})
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

        socket.on('dsc', obj=>{    
            console.log(obj,'obj in private chat ');
        })

        func.getSpecificUserData(id, (res)=>{
            setAccepter(res)
        })

    }, [])


    useEffect(() => {

        window.localStorage.setItem(id,0)
    
    }, [window.localStorage.getItem(id)])



    const sendMesage = () =>{
        let msg
        try{
            msg = document.getElementById("msg").value
            }catch(e){
                console.log(e);
            }        
            let obj = {
            sporocilo:msg,
            posiljatelj:window.localStorage.getItem('username'),
            sprejemnik: id,
            posiljateljId:window.localStorage.getItem('userId')
        }
        // console.log(obj);
        if(msg == '' || msg == null) return
        
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
         counter++
        //  console.log(sporocilo);
        return(
            <div key={counter} style={{display:'flex',alignItems:'center', justifyContent:`${sporocilo.posiljatelj == window.localStorage.getItem('username') ? "flex-end": "flex-start"}`}}>
                <img style={{borderRadius:'50%',height:'40px','border':'1px solid grey',margin:'0 2px', 'order':`${sporocilo.posiljatelj == window.localStorage.getItem('username') ? "1": "0"}`}} src={`${sporocilo.posiljatelj == window.localStorage.getItem('username') ? window.localStorage.getItem('img') : accepter.img}`} alt="slika"/>
                <p  style={{borderRadius:'30px','width':'40%','border':'1px solid black','height':'40px',display:'flex','justifyContent':'center',alignItems:'center'}}>{sporocilo.sporocilo}</p>
            </div>
            )
        })
    }    
        
        useEffect(()=>{
            document.getElementById('screen').scrollTop = document.getElementById('screen').scrollHeight;
        })

        


        useEffect(()=>{
            document.addEventListener("keyup", function(event) {
                // console.log(props);
                if(event.keyCode === 13){
                    sendMesage()
                }
            })
        },[])

    
    return (
        <div>
            <div style={{width:'95%','height':'25px','fontSize':'20px',display:'flex',margin:'10px 10px','borderBottom':'1px solid grey'}}>{accepter.username}</div>
            <div id='screen' style={{height:'75vh','overflowY':'auto','position':'relative',paddingTop:'10px'}}>
                {sporocilaOblikovana}
            </div>
            <div style={{display:'flex','flexDirection':'row','justifyContent':'center','height':'5vh','alignItems':'center'}}>
                <input autoComplete='off' id='msg' style={{width:'90%','height':'90%','border':'1px solid black'}} type="text"/>
                <SendSharpIcon style={{'borderRadius':'50%','border':'1px solid grey','padding':'5px','margin':'0 10px','fontSize':'30px'}} onClick={sendMesage}/>
            </div>
        </div>
    )
}

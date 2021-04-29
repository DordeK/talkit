import React, { useState, useEffect  } from 'react'
import loggedin from '../../scripts/authentication'


function Profile(props) {

    const [data, setData] = useState({})

    useEffect(() => {
        loggedin.getData((response)=>{
            setData(response)
        })
    }, [])


    if (data !== {}){
        return(<div style={{height:'90vh'}}>
            <div style={{display:'flex','justifyContent':'space-evenly','alignItems':'center','backgroundImage':'url("https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260")','backgroundSize':" 100% 100%"}}>
                <h4 style={{fontSize:'30px'}}>{data.username}</h4>
                <img src={data.provider  == 'github' ? data.photo : data.img} style={{borderRadius:'50%','border':'1px solid black','height':'100px', margin:'20px'}} alt="slika"/>
            </div>
            <hr/>
            <div style={{'height':'80%','display':'flex','justifyContent':'center',alignItems:'center'}}>
                <h1>welcome to talkit app {data.username}</h1>
            </div>
        </div> 
        )
    }else{
        return( null )
    }
}

export default Profile

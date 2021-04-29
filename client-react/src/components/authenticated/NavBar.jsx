import {BrowserRouter as Router,Switch,Route,Link } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect  } from 'react'
import { useHistory } from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp';
import MenuSharpIcon from '@material-ui/icons/MenuSharp';


export default function NavBar(props) {

    const isMobile = useMediaQuery("(max-width:800px)");
    let history = useHistory();
    const [drop, setDrop] = useState(false)

    let navbarStylePhone ={
        color:'white',
        padding:'20px 0',
        fontSize:'20px',
        textDecoration:'none',
        borderTop:'1px solid white',
        borderBottom:'1px solid white',
        zIndex:'2'
    }

    let navbarStyle ={
        textDecoration:'none',
        color:'white',
        fontWeight:'100',
        fontSize:'20px',
        borderLeft:'1px solid white',
        borderRight:'1px solid white',
        padding:'0 40px'

    }
    
    let butonStyle={
        backgroundColor:'grey',
        border:'none',
        color:'white',
        fontWeight:'100',
        fontSize:'20px',
        borderLeft:'1px solid white',
        borderRight:'1px solid white',
        padding:'0 40px'
    }


    const dropdown = () =>{
        setDrop(prevDrop => !prevDrop)
    }


    //logout eventhandler
    const logout = async () =>{
        await axios({
                method:'post',
                data:{
                    userId: window.localStorage.getItem('userId')
                }, 
                withCredentials:true,
                url:"http://localhost:4000/logout"
            }).then((res)=>{
                window.localStorage.removeItem(window.localStorage.getItem('userId'));
                // window.localStorage.removeItem('username');
                // window.localStorage.removeItem('userId');
                // window.localStorage.removeItem('mesagealert');
                // window.localStorage.removeItem('img');
                localStorage.clear();
                history.push('/')
            } ) 
    }
  

    //redirecting event handler 
    const redirect = (link) =>{
        console.log(link);
        history.push(link)
        window.location.reload(false);
    }

    return(
        <>
            { isMobile ? (
                    <div style={{width:'100%','height':'40px',display:'flex',justifyContent:'space-between',backgroundColor:'grey','padding':'10px 0','alignItems':'center'}}>
                        <MenuSharpIcon onClick={dropdown} style={{fontSize:'35px',marginLeft:'10px'}} />
                        <ExitToAppSharpIcon onClick={logout} style={{fontSize:'35px', marginRight:'10px'}} />
                        {drop? (
                            <div style={{ zIndex:'1',display:'flex','flexDirection':'column','justifyContent':'start','position':'absolute','left':'8px','top':'67px','backgroundColor':'grey','color':'white','height':'93vh','width':'30%'}}>
                                <a style={navbarStylePhone} to='/user/chat'  onClick={()=>redirect('/user/chat')} >Public chat</a>
                                <a style={navbarStylePhone} to='/user/choosechat'  onClick={()=>redirect('/user/choosechat') } >Private chat</a>
                                <a style={navbarStylePhone} to='/user' onClick={()=>redirect('/user')}>Profile</a>
                            </div>
                        ):(
                            null
                        )}
                    </div>                            
            ):(
                <div style={{width:'100%',height:'50px',backgroundColor:'grey', display:'flex','justifyContent':'space-evenly','alignItems':'center'}}>
                    <Link style={navbarStyle} to='/user/chat'  onClick={()=>redirect('/user/chat')} >Public chat</Link>
                    <Link style={navbarStyle} to='/user/choosechat' onClick={()=>redirect('/user/choosechat')} >Private chat</Link>
                    <Link style={navbarStyle} to='/user'  onClick={()=>redirect('/user')}>Profile</Link>
                    <button style={butonStyle}   onClick={logout} >Logout</button>
                </div>
                )}
        </>
    )
}


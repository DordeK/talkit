import {Redirect } from 'react-router'
import {BrowserRouter as Router,Switch,Route,Link } from "react-router-dom";
import axios from 'axios';
import { useHistory } from "react-router-dom";



export default function NavBar(props) {

    let history = useHistory();


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

    const logout = () =>{

        props.socket.emit('dsc', window.localStorage.getItem('userId'))


            axios({
                method:'get',
                withCredentials:true,
                url:"http://localhost:4000/logout"
            }).then((res)=>{
                window.localStorage.removeItem('username');
                window.localStorage.removeItem('userId');
                window.localStorage.removeItem('mesagealert');
                history.push('/')
            } ) 
    }
    const redirect = (link) =>{
        history.push(link)
        window.location.reload(false);

    }

    return (
        <div style={{width:'100%',height:'50px',backgroundColor:'grey', display:'flex','justifyContent':'space-evenly','alignItems':'center'}}>
            <Link style={navbarStyle}  onClick={()=>redirect('/user/chat')} >Public chat</Link>
            <Link style={navbarStyle}  onClick={()=>redirect('/user/choosechat')} >Private chat</Link>
            <Link style={navbarStyle}  onClick={()=>redirect('/user')}>Profile</Link>
            <button style={butonStyle}   onClick={logout} >Logout</button>
        </div>
    )
}

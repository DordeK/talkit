import axios from 'axios';

class auth {
    constructor(){
     this.loggedin = false
    }

    
    login = (username, password , cb) => {
        axios({
            method:'post',
            data:{
                username: username,
                password: password
            }, 
            withCredentials:true,
            url:"http://localhost:4000/login" 
        }).then( res =>{
            try{
            window.localStorage.setItem('username', res.data.user.username);
            window.localStorage.setItem('img', res.data.user.img);
            this.loggedin = res.data.uspesnost
            console.log(this.loggedin ,'<-logedin');
            cb(res.data)  // calback function
            }
            catch(e){
                console.log(e);
            }
         }
        )

  
    }    


    registration = (username, password , cb) => {
        console.log();
        axios({
            method:'post',
            data:{
                username: username,
                password: password
            }, 
            withCredentials:true,
            url:"http://localhost:4000/register" 
        }).then( res =>{
            console.log(this.loggedin ,'<-registred');
            cb(res.data)  // calback function
         }
        )
    }  


    logout = (cb) => {
        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:4000/logout"
        }).then((res)=>{
            // console.log(res.data)
            this.loggedin = res.data
            // console.log(this.loggedin ,'<-logedin');
            cb()  // calback function
            return (res.data)
        } ) }

        
    isAuthenticated() {
        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:4000/isAuthenticated"
        }).then((res)=>{
            // console.log(res.data)
            this.loggedin = res.data
            // cb()  // calback function
            console.log(res.data,'<------res.data');
            return(res.data);
        })
    }

    isAuthenticatedCb(cb) {
        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:4000/isAuthenticated"
        }).then((res)=>{
            // console.log(res.data,'<------res.data');
            this.loggedin = res.data
            cb(res.data)  // calback function
        })
    }

    getData(cb) {
        axios({
            method:'get',
            withCredentials:true,
            url:"http://localhost:4000/getData" // this route is protected, you can only get data if you are logged in, and data logedin user gets is not sensitive
        }).then((res)=>{
            window.localStorage.setItem('username', res.data.username);
            this.loggedin = res.data
            cb(res.data)  // calback function
        })
    }

       getSpecificUserData(userId, cb){
        axios({
            method:'post',
            withCredentials:true,
            data:{
                userId: userId,
            },
            url:"http://localhost:4000/getSpecificUserData" // this route is protected, you can only get data if you are logged in, and data logedin user gets is not sensitive
        }).then((res)=>{
            cb(res.data)  // calback function
            })
        }

}

let loggedin = new auth()

export default loggedin




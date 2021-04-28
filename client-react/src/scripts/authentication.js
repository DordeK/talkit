import axios from 'axios';

class auth {
    constructor(){
     this.loggedin = false
    }

    
    login = (username, password , cb) => {
        console.log();
        axios({
            method:'post',
            data:{
                username: username,
                password: password
            }, 
            withCredentials:true,
            url:"http://localhost:4000/login"
        }).then( res =>{
            window.localStorage.setItem('username', res.data.user.username);
            this.loggedin = res.data.uspesnost
            // console.log(this.loggedin ,'<-logedin');
            cb(res.data)  // calback function

            axios({
                method:'get',
                withCredentials:true,
                url:"http://localhost:4000/onlineUsers"
            }).then( res =>{
                let arr=res.data
                arr.map(user => {
                        window.localStorage.setItem(user._id, 0);                
                    
                })})


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
            url:"http://localhost:4000/getData"
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
            url:"http://localhost:4000/getSpecificUserData"
        }).then((res)=>{
            console.log(res,'hiupnvh98,hrewap98hmope8hgohc');
            cb(res.data)  // calback function
            })
        }

}

let loggedin = new auth()

export default loggedin




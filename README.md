# talkit


# Uporabljene tehnologije:  


* ## BECKEND:
   	* Express,
   	* Cors,
   	* Socket.io,
   	* MongoDB,
   	* express-session,
   	* bcrypt,
   	* passport:
   		* passport-local, 
   		* passport-github, 
   	* git,  
   	* dotenv  
  
    
  
* ## FRONTEND:  
	* React,   
	* axios,  
	* useHistory,  
	* Route,  
	* useState,  
	* css,  
	* Material-UI,  
	* useEffect,   
	* Link,  
	* Switch,  
	* useMediaQuery,  
	* passportSocketIo  
   
     
* ## Authetication:  
 	* passport,  
	* passportSocketIo,  
	* express-session,  
	* bcrypt,  
	* passport-local,  
	* passport-github  
	
  
* ## database: 
	* MongoDB,  
	* express-session,  
	* localStorage  




* ## FUNCTIONALITY:  
	* this apps purpuse is from comunicating thru web  
	* you can authenticate with github accout or via registartion an later login form on website,  
	* non authenticated users cannot acces the web-app it redirects them to login site if they are not logedin. This was made with this code in react img(https://ibb.co/kDPZvKM),    
  
	* to check if user is logedin we use express-session, everytime users logs in the app his id is saved in session as with key:'passport' and when user logs out session id for autheticating is deleted,
	
  	* to check if user is loged in we use mongodb as database for all users, their password is decripted with bycript library for safety mesures,  
  
	* when user logs in he is redirected to home page where he sees his name greeting and his picture if he loged in with github in other case no image image is shown img('https://ibb.co/0DmFVxN'),  
  
	* when user logins on the frontend api call is made to created beckend with axios we fetch users data and all users ids that are currently online this data is stored in mongodb database,    
	
	* then we can go to private chats rout with navigation bar  url img(https://ibb.co/0FJgs4D)	 

	* here we can see all online user and have private conversation with them that no one els can see  url(https://ibb.co/MRNbqDM)   

	* if you get private mesage from anyboy you are notificated with red number that represents how many messages has that person sent you, that number is reseted when you click on that person, that number is saved in users localStorage so it is not deledet when he goes on different route  url(https://ibb.co/RDcPWBy)   

	* user can also go to public chat-room where all users chat between them self  url(https://ibb.co/QPqnjrD)    

	* when user is done talking he can click logout button on top-right and he will be logged out  (git)  
	
	

![talkit2](https://user-images.githubusercontent.com/69770580/116774976-7d422000-aa60-11eb-834c-4b8c6337b76f.gif)




	
  
* ## BUGS ENCOUTERED DURING DEVELOPMENT:  
	* when creating app one of biggest bugs was private mesagging,
	* i wanted to use io.to(socketId).emit() but problem was that users does not have fixed  socket id,    
	* I saved this problem by saving socketId in database with users data and switching it every time user disconects and connects again.   
	
	<br/><br/>
	
	# webiste is also responsive
	gif from phone perspective
	
  	<br/><br/>
  	

git clone [..url..]  
npm install  
npm start  


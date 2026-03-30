import React, { useState } from 'react'
import { Routes , Route, Navigate} from 'react-router-dom'
import Chat from './Chat'
import Home from './Home'
import Login from './Loging'

function Routing_App() {
    const [islogin,setIslogin]=useState(false);
    
    const ProtectedRoute= (props)=>{
        //given by react jiske liye code chalega usko return kar dega childeren 
        //means protectedroute ke under first home return tthen chat .
        const children=props.children;
        //to check condition given true or false;
        const islogin=props.islogin;
        const setIslogin=props.setIslogin; 
        if(islogin){
            return children;
        }else{
            return <Navigate to="/login"></Navigate>
        }
    }
  return (
    <div>POC_App
        <Routes>
            <Route path="/" element={<ProtectedRoute islogin={islogin}>
                <Home  setIslogin={setIslogin}></Home>
            </ProtectedRoute>}></Route>
            <Route path="/login" element={<Login setIslogin={setIslogin}></Login>}></Route>
            <Route path="/chat" element={<ProtectedRoute islogin={islogin}>
                <Chat setIslogin={setIslogin}></Chat>
            </ProtectedRoute>}></Route>
        </Routes>
    </div>
  )
}
export default Routing_App
import Profile from "./Component/Profile"
import Chat from "./Component/Chat"
import Login from "./Component/login"
import Home from "./Component/Home"
import PageNotFound from "./Component/PageNotFound"
// import  Home  from "./Example/ThemeChanger/Home";
import { Routes,Route } from "react-router-dom"
// import PageNotFound from "./Example/ThemeChanger/PageNotFound";
import { useState } from "react";
function App() {
  // const [theme,updateTheme]=useState(true);
  // const handleToggle= ()=>{

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
    <>
      {/* <h1>App Component</h1> */}
       <Routes>
        <Route path="/" element={<ProtectedRoute islogin={islogin}>
                <Home  setIslogin={setIslogin}></Home>
            </ProtectedRoute>}></Route>
        <Route path="/login" element={<Login setIslogin={setIslogin}></Login>}></Route>
        <Route path="/chat/:uniqueId" element={<ProtectedRoute islogin={islogin}>
              <Chat setIslogin={setIslogin}></Chat></ProtectedRoute>}></Route>
        <Route path="/profile" element={<ProtectedRoute islogin={islogin}><Profile setIslogin={setIslogin}></Profile></ProtectedRoute>}></Route>
        <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
       </Routes>
       {/* <button onClick={handleToggle}>Toogle Theme</button>
       <Routes>
        <Route path="/home" element={<Home></Home>}></Route>
        <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
       </Routes> */}
       
    </>
  )
}

export default App;

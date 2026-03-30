import React from 'react'
import { useNavigate } from 'react-router-dom';
//step 1 for logout
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.config';
function Home(props) {
   const setIslogin=props.setIslogin;
      const navigate=useNavigate();
  
      const handleLogout=async ()=>{
        await signOut(auth)
        setIslogin(false);
        navigate("/login");
      }
  return (
    <div>Home</div>
    

  )
}

export default Home
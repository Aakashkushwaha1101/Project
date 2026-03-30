import React from 'react'
import { useNavigate } from 'react-router-dom';

//step 3
import { signInWithPopup } from 'firebase/auth';
//step 4
import { auth } from '../../firebase.config';
import { GoogleAuthProvider } from 'firebase/auth';

function Login(props) {
    const setIslogin=props.setIslogin;
    const nevigate=useNavigate();

    const Handlelogin= async () => {
      // step 5 :awit  use to fetch detaa from api thats why we use async function
        const result=await signInWithPopup(auth,new GoogleAuthProvider);
        console.log(result);
        setIslogin(true);
        // alert(" loggedIn ")
        nevigate("/");
    }

  return (
    
    <div>
        <div>Loging</div>
        <button onClick={Handlelogin}>Google Login</button>
    </div>
  )
}

export default Login
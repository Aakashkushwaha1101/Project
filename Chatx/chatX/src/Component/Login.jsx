import React from "react";
import { Fingerprint , ArrowRightToLine ,LogIn as LoginIcon } from "lucide-react";
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
    <>
      <div className="h-[220px] bg-orange-500 hover:bg-orange-400">
        <div className="flex ml-[200px] pt-[40px] items-center gap-[4px] ">
          <img src="./message.png" alt="chatX.icon" className="w-7 h-7 mt-[7px]" />
          <div className="text-black  text-xl mt-[3px] uppercase">chat-X</div>
        </div>
      </div>
      <div className="h-[calc(100vh-220px)] bg-amber-50 flex justify-center items-center relative">
        <div className="h-[80%] w-[50%] bg-white shadow-2xl flex flex-col  gap-3 justify-center items-center absolute -top-[93px]">
          <Fingerprint className="h-17 w-17 text-orange-500 " strokeWidth={1}/>
          {/* <img src="./finger.png" alt="Finger.icon" className="w-12 h-12 mb-4" /> */}
          <div className="text-xl font-semibold mb-2">Sign in</div>
          <div className=" mb-4 font-semibold">Sign in with your Google account to get started</div>
           <button onClick={Handlelogin} className="px-4 py-2 bg-orange-500 text-black rounded-[6px] hover:bg-orange-400 flex"> {/*border-radius=24px tailwind me rounded use karte hai */}
            <div className="font-semibold">Google Sign in</div>
            <LoginIcon className="ml-1" strokeWidth={1.2}/>
          </button>
        </div>
      </div>
    </>
  );
}

export default Login;

import React, { useEffect, useState } from 'react'

function User() {
    const[loading,setLoading]=useState(true);
    const [user , setUser]=useState(null);
    function cb(){
        //logic for fetch data and show to user
        (
            async function fetchUser() {
                //fetch data from api fetch is a method 
                const response=await fetch("https://jsonplaceholder.typicode.com/users/1");

                const userData=await response.json();//data jo fetch krta hai vo json form me hota hai

                // console.log(userData);
                setLoading(false);
                setUser(userData);
            }
        )() //iife imidiate invoked function expression
    }
    //this function call after the first render
    useEffect(cb ,[]);
    if(loading){
        return (
            <>
                < div>User</div>
                <div>.....Loading</div>
            </>
        
        )
    }
    if(loading==false){
        return (
            <>
                <div>{user.username}</div>
                <div>{user.address.street}</div>
                <div>{user.phone}</div>
                <div>{user.website}</div>
            </>
        )
    }
    
} 

export default User
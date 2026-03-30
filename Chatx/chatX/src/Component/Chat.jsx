import React from 'react'
import { useParams } from 'react-router-dom'

function Chat() {
    const params=useParams();  //<--- hook is always call inside the components ,it return object
    console.log(params);
  return (
    <>
        <div>{params.uniqueId}</div>
        <div>Chat</div>
    </>
    
  )
}

export default Chat
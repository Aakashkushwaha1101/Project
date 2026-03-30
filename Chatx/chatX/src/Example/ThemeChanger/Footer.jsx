import React from 'react'

function Footer() {
  return (
    <div style={{border:"1px solid",padding:"1rem",margin:"1rem"}}>
        <div>Header</div>
        <div>|</div>
        <Option></Option>
        <Option></Option>
        <Option></Option>
        <div>--------------------------------------</div>
    </div>
  )
}
function Option(){
   return (
    <div>
        <h1>footer option</h1>
    </div>
   )
}

export default Footer
import React from 'react'

function Header() {
  return (
    <div style={{border:"1px solid",padding:"1rem",margin:"1rem" ,justifyContent:'center',alignItems:'center'}}>
        <div>Header</div>
        <div>|</div>
        <Options></Options>
        <Options></Options>
        <Options></Options>
        <div>--------------------------------------</div>
    </div>
    
  )
}
function Options(){
  return (
    <div>
        <h1>Header option</h1>
    </div>
  )
}

export default Header
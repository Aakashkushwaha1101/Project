import React from 'react';
// iss problem ko hum propdrilling bolte hai 

function PropDrilling() {
    const value = 10; // global value to be passed down
    return (
        <>
            <h1>Prop Drilling</h1>
            <Grandparent gpValue={value} />
        </>
    );
}

function Grandparent(props) {
    const pValue = props.gpValue;
    return (
        <>
            <h2>Grandparent</h2>
            <Parent parentValue={pValue} />
        </>
    );
}

function Parent(props) {
    return (
        <>
            <h3>Parent</h3>
            <Child childValue={props.parentValue} />
        </>
    );
}
// iss component me value pass karne ke liye hme iske har parent ko value pass krni
// pad rahi hai , so we want ki kucch aisa ho ki hum direct value pass kar ssake 
// niche ke kisi bhi component ko , react provide -->contextApi

function Child(props) {
    return (
        <>
            <h4>Child</h4>
            <p>Received Value: {props.childValue}</p>
        </>
    );
}

export default PropDrilling;

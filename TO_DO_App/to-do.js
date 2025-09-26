console.log("to do opration");

//select elments
const inputTask=document.querySelector("input");
const button=document.querySelector("button");
const taskList=document.querySelector(".list");


//eventlistener
const inputHandler=function (){
    const newTask=inputTask.value;

    //To handle edge case <- input area blank but if we click on add task ,it add thr task in taskbar
    if(newTask.length==0){
        return;
    }

    //alert notification
    // alert("newTask Added : " + newTask);

    //create li
    // const liElem=document.createElement("li");

    //update
    // liElem.innerText= newTask;
    
    //=====Function call 
    const liElem=createTask(newTask);
    //append this to their parent
    const addedTask=taskList.appendChild(liElem);

    //to refresh or clear input
    inputTask.value="";

    const liElemBttn=liElem.children[1];
    liElemBttn.addEventListener("click",function (){
        liElem.remove();

    })


    //to give delete option ,To delete task

    // liElem.addEventListener("click",function (){
    //     liElem.remove();
    // });

}
//=======================by using delete button==================================
function createTask(newTask){

    const div=document.createElement("div");
    const li=document.createElement("li");
    const button=document.createElement("button");

        //to give text in button
    button.innerText="Delete Task"; 
    button.style.display=
    li.textContent=newTask;
        
        //appened
    div.appendChild(li);
    div.appendChild(button);
    return div;

}
button.addEventListener("click",inputHandler );
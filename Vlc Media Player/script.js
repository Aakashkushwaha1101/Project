// // alert("js added");
//media
const media=document.querySelector("#media-input");//open file
const mediabtn=document.querySelector("#media-btn");// click to open system file
//main
const videoPlayer=document.querySelector("#main");

const fileHandler= () => {
    media.click();
    
}
//input ke liye jb click krenge
mediabtn.addEventListener("click", fileHandler);

const acceptInput= (obj) =>{
    // console.log("video selected");
    console.log(obj);
    const selectedFiles=obj.target.files[0];// to get selected file ,if u open single file

    // console.log(" selected files ",selectedFiles); //array ke form me selected file ko dikhata hai 
    // now we need to convert src <- into base64
    const link=URL.createObjectURL(selectedFiles); 
    const videoElement=document.createElement("video");// ekk element create kiya main tag ke ander
    videoElement.src=link;
    videoElement.setAttribute("class","video");
    // videoElement.controls="true";

    //now we need to append this child to main
    videoPlayer.appendChild(videoElement);
    // videoElement.play();

    // setTimeout(()=>{
    //     console.log("current time : ",videoElement.currentTime)//current time in seconds
    // } , 2000);


}
//  jb input select hoga tb ye call hoga
media.addEventListener("change",acceptInput);

//select  the element
//playback
const speedup=document.querySelector("#speedUp");
const speedDown=document.querySelector("#speedDown");
//audio
const increase=document.querySelector("#increase");
const decrease=document.querySelector("#decrease");
const silent=document.querySelector("#mute");
//select element toast
const toast=document.querySelector(".toast");

/* speed section ==============================================================*/
const speedupHandler=() =>{
    // alert("speedup btn clicked");
    const VideoElement=document.querySelector("video");
    if (VideoElement==null){
        return;
    }
    else if (VideoElement.playbackRate > 3){
        return;
    }
   
    /** defaultPlaybackRate <= next video jo aane vaala rehta hai uska speed incrs krta h 
    jaise loop me video chal rahi hai **/
    console.log("intial speed :" , VideoElement.playbackRate);
    let increaseSpeed=VideoElement.playbackRate + 0.25;
    console.log("incresed speed" , increaseSpeed);
    VideoElement.playbackRate =increaseSpeed;
    // VideoElement.playbackRate = VideoElement.playbackRate + 0.5;

    /* =================== add toast to show increased speed ===========================*/
    toast.textContent=increaseSpeed+"x";   
    toast.style.display="block";
    setTimeout(function (){
        toast.style.display="none";
    },1000);

}
speedup.addEventListener("click",speedupHandler);

const speedDownHandler=()=>{
    // console.log(" yhaa speed kam krna h");
    const VideoElement=document.querySelector("video");
    if (VideoElement==null){
        return;
    }
    if(VideoElement.playbackRate > 0 ){
        const decreaseSpeed = VideoElement.playbackRate - 0.25;  
        VideoElement.playbackRate=decreaseSpeed;
        console.log(" decrease speed :",decreaseSpeed);
    }
    toast.textContent=decreaseSpeed+"x";   
    toast.style.display="block";
    setTimeout(function (){
        toast.style.display="none";
    },1000);
}
speedDown.addEventListener("click",speedDownHandler);

/* Audio section  ===================================================================*/
const volumeUpHandler= ()=>{
    const VideoElement=document.querySelector("video");
    if (VideoElement==null){
        return;
    }
    if (VideoElement.volume >= 0.99){ //0.1+0.2 =0.300000004 something in any launguage
        console.log("volume 100%");
        return;
    }
    const volumeIncrease=VideoElement.volume + 0.1;
    VideoElement.volume=volumeIncrease;
    console.log("incresed volume ",volumeIncrease);

    toast.textContent=(volumeIncrease*100) +"%";   
    toast.style.display="block";
    setTimeout(function (){
        toast.style.display="none";
    },1000);
}
increase.addEventListener("click",volumeUpHandler);

/*   volumeDown    */
const volumeDownHandler= ()=>{
    const VideoElement=document.querySelector("video");
    if (VideoElement==null){
        return;
    }
    if (VideoElement.volume <= 0){
        console.log("volume 0%");
        return;
    }
    const volumeDecrease=VideoElement.volume - 0.1;
    VideoElement.volume=volumeDecrease;
    console.log("incresed volume ",volumeDecrease);

    /* toast*/
    toast.textContent=(volumeDecrease*100) +"%";   
    toast.style.display="block";
    setTimeout(function (){
        toast.style.display="none";
    },1000);
}
decrease.addEventListener("click",volumeDownHandler);

/* mute */
const silentHandler= ()=>{
    // alert("mute video");
    const VideoElement=document.querySelector("video");
    if (VideoElement==null){
        return;
    }
    if (VideoElement.volume > 0){
        VideoElement.volume=0.0;
    }

    /* toast add to mute */
    toast.textContent="mute";   
    toast.style.display="block";
    setTimeout(function (){
        toast.style.display="none";
    },1000);
    
}
silent.addEventListener("click",silentHandler);

/*                      

                     ====

            =====

                                        =================*/
const fullscreen=document.querySelector("#fullscreen");
const fullscreenMethod=() =>{
    videoPlayer.requestFullscreen();
}
fullscreen.addEventListener("click",fullscreenMethod);

/*====play======*/
const playVideo=document.querySelector("#play");
const pauseVideo=document.querySelector("#pause");
const backwardVideo=document.querySelector("#back");
const forwardVideo=document.querySelector("#forward");

const playVideoMethod= ()=>{
    const VideoElement=document.querySelector("video");
    if(VideoElement == null){
        return;
    }
    VideoElement.play();
}
playVideo.addEventListener("click",playVideoMethod);

/* =====pause button logic ========*/
const pauseVideoMethod= ()=>{
    const VideoElement=document.querySelector("video");
    if(VideoElement == null){
        return;
    }
    VideoElement.pause();
}
pauseVideo.addEventListener("click",pauseVideoMethod);

/**===========backward ================ */
const backwardVideoMethod= ()=>{
    const VideoElement=document.querySelector("video");
    if(VideoElement == null){
        return;
    }
    VideoElement.currentTime =VideoElement.currentTime - 5;
}
backwardVideo.addEventListener("click",backwardVideoMethod);
/*================== forward =========================*/
const forwardVideoMethod= ()=>{
    const VideoElement=document.querySelector("video");
    if(VideoElement == null){
        return;
    }
    VideoElement.currentTime = VideoElement.currentTime + 5;
}
forwardVideo.addEventListener("click",forwardVideoMethod);


/*=======================================================================*/
//seekbar


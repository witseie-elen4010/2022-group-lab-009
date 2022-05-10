
let FoundGame = false;
let playerID = sessionStorage .getItem("playerName");
let PlayerList;
update();
setInterval(update, 2500)


function update(){
    GetAllQueued();
    IsGameReady();
}


async function GetAllQueued(){
    fetch('/Auth/ReturnPlayers').then((data) => {
        return data.json()
    }).then((data)=>{
        PlayerList = data;
        const List = document.getElementById("PlayerQueueList")
        List.innerHTML = "";
        PlayerList.forEach((data) =>{
            List.innerHTML = List.innerHTML + '\n' +  data.playerName
        })
      
    })
}

function GetACK(){
    fetch("/Auth/ACK", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerName: sessionStorage.getItem("playerName"),
          UID: sessionStorage.getItem("UID")
        })
      })
      .then( (response) => { 
        console.log(response)
        return response.json()
      }).then((data) =>{
        console.log("Here is our response")
        console.log(data);
        if(data.includes('Sucess!')){
            console.log("Connected")
            return
        }else{
          window.location.replace(data);
        }
      })
}


async function IsGameReady(){
    fetch("/Auth/Status")
      .then( (response) => {
          return response.json();
      }).then((data) =>{
        if(data.includes('/waiting')){
            console.log("waiting")
            return
        }else{
          FoundGame = true;
          window.location.replace(data);
        }
         
      })
}

//Section for Dequeue
let LeaveBtn = document.getElementById("QueueLeave")


LeaveBtn.addEventListener('click', function (e) {
    fetch("/Queue/Dequeue", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerName: sessionStorage.getItem("playerName"),
          UID: sessionStorage.getItem("UID")
        })
      })
      .then( (response) => { 
          console.log(response)
          window.location.replace(response.url);
      });
});

window.addEventListener("beforeunload",function(){
  if(FoundGame == false){
    Dequeue();
  }
})

window.addEventListener('load', (event) => {
      CheckForReload();
      GetACK();
});


function Dequeue(){
  fetch("/Auth/Dequeue", {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      playerName: sessionStorage.getItem("playerName"),
      UID: sessionStorage.getItem("UID")
    })
  })
  .then( (response) => { 
      console.log("Logged out of Authentication Server")
     // window.location.replace(response.url);
  });
}

function CheckForReload(){
  let data=window.performance.getEntriesByType("navigation")[0].type;
  console.log(data);
    if (data === "reload") {
      Dequeue();
    } 
}







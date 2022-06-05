
let FoundGame = false;
let playerID = sessionStorage .getItem("playerName");
let PlayerList;
let GMWordle = document.getElementById('isGMGame');
update();
setInterval(update, 1500)

function update(){
  GetAllQueued();
  IsGameReady();
  CheckGameMode();
}




GMWordle.addEventListener("input", function (){
  console.log(GMWordle.checked)
  let wordInput = document.getElementById("GMWord")
  if(GMWordle.checked == true && (wordInput.value == "" || wordInput.value.length < 5 || wordInput.value.length > 5 || wordInput.value == null)){
    GMWordle.checked = false;
    alert("Please enter a valid Word before enabling GM mode!")
    return;
  }
  let gameMode = GMWordle.checked;
  fetch("/Game/ChangeGameMode", {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      gameMode: gameMode,
      UID: sessionStorage.getItem("UID"),
      Word: wordInput.value
    })
  })
})

async function CheckGameMode(){
  fetch("/Game/GetGameMode").then(data => data.json()).then(data =>{
        if(GMWordle.checked != data.gameMode){
          GMWordle.checked = data.gameMode;
          console.log("Player is GM: ", data.UID);
        }   
  })
}

async function GetAllQueued(){
    fetch('/Auth/ReturnPlayers').then((data) => {
        return data.json()
    }).then((data)=>{
        PlayerList = data;
        const List = document.getElementById("PlayerQueueList")
        List.innerHTML = "";
        PlayerList.forEach((data) =>{
            const Player = document.createElement('div')
            Player.innerHTML = data.playerName;
            List.appendChild(Player);
            //List.innerHTML = List.innerHTML + '\n' +  data.playerName
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
async function ClearGameMode(){
  fetch('/Game/ClearGameMode', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      playerName: sessionStorage.getItem('playerName'),
      UID: sessionStorage.getItem('UID')
    })
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
    ClearGameMode();
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
          console.log(response)
          window.location.replace(response.url);
      });
});

window.addEventListener("beforeunload",function(){
  if(FoundGame == false){
    Dequeue();
    ClearGameMode()
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
      ClearGameMode()
    } 
}







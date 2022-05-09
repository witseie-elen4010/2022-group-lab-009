
let WindowId = setInterval(update, 1000)
window.addEventListener("beforeunload",function(){
      Dequeue();
})

window.addEventListener('load', (event) => {
  CheckForReload();
  GetACK();
});




function update(){
  GameStatus();
}

function CheckForReload(){
  let data=window.performance.getEntriesByType("navigation")[0].type;
  console.log(data);
    if (data === "reload") {
      Dequeue();
    } 
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

async function GameStatus(){
    fetch("/Auth/GameOpen").then((data) =>{
      return data.json();
    }).then((data)=>{
      if(data.includes("Open") == false){
        clearInterval(WindowId)
        Dequeue().then( () =>{
          alert("Player Left: Game Closing")
          window.location.replace(data);
        });
       
      }
    })
}

async function Dequeue(){
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
  });
}


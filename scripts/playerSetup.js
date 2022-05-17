
const playerNameInput = document.getElementById("playerName")
const SubmitButton = document.getElementById("QueueSubmit")

document.onload = () =>{
    playerNameInput = document.getElementById("playerName")
    sessionStorage.setItem("playerName","")
}

SubmitButton.addEventListener("click",function() {
    let tempPlayerName = sessionStorage.getItem("playerName")
    if(tempPlayerName.length <  3){
        window.alert("Name To Short, Name needs to be atleast 3 characters");
        return
    }
    let tempUID = "";
    fetch("/Auth/GenerateNewUID", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerName: sessionStorage.getItem("playerName")
        })
      }).then( (response) => { 
        console.log(response)
        return response.json()
      }).then((data) =>{
        console.log(data);
        if(data.includes("FAILED")){
            console.log("UID Already in use, choose another name")
            window.alert("Name already being used at the current moment!")
            return
        }else{
          tempUID = data;
          console.log("UID Recieved from server!")
          sessionStorage.setItem("UID",tempUID)
          console.log(tempUID)
        }
      }).then( () =>{
            if(tempUID != ""){
                fetch("/Auth/LobbyOpen", {  //First request gos to check if their is a game already in pogress
                    method: "get",
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                    }).then((data) =>{   //converting the response to json
                        return data.json()
                    }).then((data) =>{
                        console.log("Any truers??",data)
                        if(data == true){ //checking if we are allowed into the queue system
                            fetch("/Auth/AddNewConnection", { 
                                method: "post",
                                headers: {
                                  'Accept': 'application/json',
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                  playerName: tempPlayerName, //sending our data to the queue server
                                  UID: tempUID.toString()
                                })
                              })
                              .then( (response) => { 
                                  console.log(response)
                                  window.location.replace(response.url);
                              });
                        }else if(data == false){ // if  you cant join the queue system wait
                            alert("Cannot Join, Game is already in progress")
                        }
                    })
            }
      })

    
    

 
});


    playerNameInput.addEventListener('input',function(){
        sessionStorage .setItem("playerName", playerNameInput.value);
        console.log("Saved: " + sessionStorage .getItem("playerName"))
       // GenerateUniqueHash(sessionStorage.getItem("playerName"))
    }) 




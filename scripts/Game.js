
'use strict'
let WindowId = setInterval(update, 1000)
let playerList = []
let testWord = "PANIC"
window.addEventListener("beforeunload",function(){
      Dequeue();
      CloseSync();
})

window.addEventListener('load', (event) => {
  CheckForReload();
  GetACK();
});




function update(){
  GameStatus();
  GetSyncData();
}

function CheckForReload(){
  let data=window.performance.getEntriesByType("navigation")[0].type;
  console.log(data);
    if (data === "reload") {
      Dequeue();
      CloseSync();
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

async function CloseSync(){
  fetch('Game/CloseSync').then((data) => {
      console.log(data);
  })
}

async function SetupOppBoard(){
  fetch('/Auth/ReturnPlayers').then((data) => {
      return data.json()
  }).then((data)=>{
      playerList = data;
      playerList = playerList.filter((data) =>{
          if(data.UID != sessionStorage.getItem("UID")){
              return data;
          }
      })
      console.log("playerList: ",playerList)
      const opponentBoard = document.getElementById('playersGrid')
      playerList.forEach(data => {
        const container = document.createElement('div')
        container.setAttribute('id', data.UID)
        container.setAttribute('class','grid playerGridStyle')
        const heading = document.createElement('h2')
        heading.innerHTML = data.playerName;
        heading.setAttribute('class','playerTitle')
        opponentBoard.appendChild(heading)
        console.log("x value: ", data)
        for (let i = 0; i < 30; i++) {
          const grid = document.createElement('div')
          grid.classList.add('square')
          grid.classList.add('flipping')
          grid.setAttribute('id', i + 1) // index starts at one not 0
          container.appendChild(grid)
            }
        opponentBoard.appendChild(container)
        
      });   
    })
    
  }

  async function SyncData(data){


        fetch("/Game/Sync", {
        method: "post",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            UID: sessionStorage.getItem("UID"),
            Data: data
        })
      })
      .then( (response) => { 
          console.log(response)
      });
  
    
  }

  async function GetSyncData(){
    let temp = [];
    fetch('Game/GetSync').then(data => data.json()).then((data)=>{
      temp = data;
      temp = temp.filter(element =>{
          if(element.UID != sessionStorage.getItem("UID")){
            return element;
          }
      })
      console.log("Sync'd data: ",temp)
      console.log("Our interest Syncs: ",temp.length)
      while(temp.length > 0){
          let tempPlayer = temp[0].UID
          console.log("Current PlayerID: ",tempPlayer)
          let PlayerMoves = temp.filter(element =>{
            if(element.UID == tempPlayer){
              return element;
            }
          })
          temp = temp.filter(element =>{
            if(element.UID != tempPlayer){
              return element
            }
          })
        let container = document.getElementById(tempPlayer)
        PlayerMoves.forEach((data) =>{
          let slot = data.Moves.idLetter;
          let Color = data.Moves.gridColour;
          let children = Array.from(container.children)
          console.log("children: ",children)
          children.forEach(element =>{
            console.log("We have ID:",element.id)
            if(element.id == slot.toString()){
              element.style = `background-color:${Color}`
            }
          })
          
        })
      }
    })
  }


///Game Functionality section
  document.addEventListener('DOMContentLoaded', () => {
    gridSystem()
    const keys = document.querySelectorAll('.row button')
    for (let index = 0; index < keys.length; index++) {
      keys[index].onclick = ({target}) => {
        const key = target.getAttribute("data-key")
          // if entry isnt 5 letters
          if (key === 'Enter') {
            submit()
            return
          }
    
          // delete key
          if (key === 'Delete') {
            deleteKey()
            return
          }
  
        console.log(key)
        WordUpdate(key)
      }
    }
  })

  // key input functions

  // array that contains all the words, and an array that contains each letter for each word
  const words = [[]] // array of words
  let space = 1 // avaliable space- for initilisation always 1 space open, keys will change- no const

  let count = 0

  // updating letters
  function currentWord () {
    const numberofWords = words.length
    return words[numberofWords - 1] // array starts with number 0
  }

  // updating words

  function WordUpdate (element) {
    const currentArr = currentWord()
    if (currentArr.length < 5) {
      currentArr.push(element)
      const avaliableElement = document.getElementById(String(space)) // continue indexing til 5th col
      space = space + 1
      avaliableElement.textContent = element
    }
  }


 
  // creates a grid system 
  function gridSystem () {
    const gameBoard = document.getElementById('grid')
    for (let i = 0; i < 30; i++) {
      const grid = document.createElement('div')
      grid.classList.add('square')
      grid.classList.add('flipping')
      grid.setAttribute('id', i + 1) // index starts at one not 0
      gameBoard.appendChild(grid)
    }
    SetupOppBoard();

  }

  async function submit () {
    const currentArr = currentWord()
    if (currentArr.length !== 5) {
      window.alert('5 letters')
    }
    const current = currentArr.join('')
    console.log(current.toLowerCase())

    //HERE NEEDS TO BE UNCOMMENTED ONCE ZHUO HAS DATABASE HOOKS
    // check real world
    //if (!WooldeWords.includes(current.toLowerCase())) {
    //  window.alert('not real word')
    //}

    // game won
    if (current === testWord) {
      window.alert('noice')
    }
    // check if game won
    //  && current !== testWord
    if (words.length === 6) {
      window.alert('its chaii')
      window.alert(`Word of the day: ${testWord}`)
    }

    // turn over tiles
    const idCount = count * 5 + 1
    const timer = 300
    let Data = new Array()
    currentArr.forEach((element, i) => {
     setTimeout(() => {
        
        const gridColour = gridColourFunc(element, i)
        const idLetter = idCount + i
        const elementLetter = document.getElementById(idLetter)
        elementLetter.classList.add('animate__flipInX')
        elementLetter.style = `background-color:${gridColour}`
        let temp = {idLetter: idLetter, gridColour: gridColour}
        Data.push(temp);
      }, timer * i) // extend interval in each letter
      
    })
    await delay(1.5)
    count += 1
    // next row
    words.push([])
    console.log("What we passing to sync: ", Data)
    console.log("After String: ", JSON.stringify(Data))
    SyncData(Data);
  }

  // change grid colours
  function gridColourFunc (element, i) {
    const rightElement = testWord.includes(element)

    if (!rightElement) {
      return 'rgb(58, 58, 60)'
    }
    // position
    const elementPos = testWord.charAt(i)
    const pos = element === elementPos

    if (pos) {
      return 'rgb(83, 141, 78)'
    }

    return 'rgb(181, 159, 59)'
  }

  function deleteKey () {
    const currentArr = currentWord()
    const deleteElement = currentArr.pop() // remove letter
    console.log(deleteElement)

    words[words.length - 1] = currentArr

    const lastElement = document.getElementById(String(space - 1))

    lastElement.textContent = ''
    space = space - 1
  }

  function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}




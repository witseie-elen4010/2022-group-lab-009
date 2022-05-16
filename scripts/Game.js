
let WindowId = setInterval(update, 1000)
window.addEventListener("beforeunload",function(){
      Dequeue();
})

window.addEventListener('load', (event) => {
  CheckForReload();
  GetACK();
});

let testWord = "PANIC"



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

///Game Functionality section
'use strict'
document.addEventListener('DOMContentLoaded', () => {
  gridSystem()

  const letter = document.querySelectorAll('.row button')

  for (let index = 0; index < letter.length; index++) {
    letter[index].onclick = ({ target }) => {
      const element = target.getAttribute('data-key')
      // check input key
      // if entry isnt 5 letters
      if (element === 'Enter') {
        submit()
        return
      }
      // delete key
      if (element === 'Delete') {
        deleteKey()
        return
      }
      console.log(element)
      WordUpdate(element)
    
    }
  }

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

  function submit () {
    const currentArr = currentWord()
    if (currentArr.length < 5) {
      window.alert('its not 5 letters')
    } else {
      const current = currentArr.join('')
      console.log(current.toLowerCase())

      // check real world
      // dictionary is handled by database
     /*  if (!WooldeWords.includes(current.toLowerCase())) {
        window.alert('not real word')
        deleteKey()
        deleteKey()
        deleteKey()
        deleteKey()
        deleteKey()
      } */ 
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

        count += 1

        // next row
        words.push([])
      
    }
  }

  function deleteKey () {
    const currentArr = currentWord()
    if (currentArr.length > 0) {
      const deleteElement = currentArr.pop() // remove letter
      console.log(deleteElement)

      words[words.length - 1] = currentArr

      const lastElement = document.getElementById(String(space - 1))

      lastElement.textContent = ''
      space = space - 1
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
  }

})


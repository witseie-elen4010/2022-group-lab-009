
'use strict'
let SafeCheck = true
const WindowId = setInterval(update, 1000)
let playerList = []
let GM = ''
let testWord = '!'
let gameOver = false
let hasWon = false;

window.addEventListener('beforeunload', function () {
  Dequeue()
  CloseSync()
  ClearGameMode()
})

window.addEventListener('load', (event) => {
  CheckForReload()
  GetACK()
})

function update () {
  GameStatus()
  GetSyncData()
}

function CheckForReload () {
  const data = window.performance.getEntriesByType('navigation')[0].type
  console.log(data)
  if (data === 'reload') {
    Dequeue()
    CloseSync()
    ClearGameMode()
  }
}

async function ClearGameMode () {
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

async function CheckGameMode () {
  fetch('/Game/GetGameMode').then(data => data.json()).then(data => {
    console.log('Player is GM: ', data.UID)
    gridSystem()
    if (data.gameMode === true && data.UID === sessionStorage.getItem('UID')) {
      const playerGrid = document.getElementById('grid')
      const PlayerKeyBoard = document.getElementById('key-container')
      playerGrid.remove()
      PlayerKeyBoard.remove()
      SafeCheck = false
      console.log('grid Destroyed')
    } else if (data.gameMode === true && data.UID !== sessionStorage.getItem('UID')) {
      GM = data.UID
    }
  })
}

function GetACK () {
  fetch('/Auth/ACK', {
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
    .then((response) => {
      console.log(response)
      return response.json()
    }).then((data) => {
      console.log('Here is our response')
      console.log(data)
      if (data.includes('Sucess!')) {
        console.log('Connected')
      } else {
        window.location.replace(data)
      }
    })
}

async function GameStatus () {
  fetch('/Auth/GameOpen').then((data) => {
    return data.json()
  }).then((data) => {
    if (data.includes('Open') === false) {
      clearInterval(WindowId)
      Dequeue().then(() => {
        // adding an if statement here to control the output msg
        // as the requeue uses this function, the output message may need to change
        // depending on the situation
        if (gameOver === true) {
          window.alert('Player Won: Game Closing')
        } else {
          window.alert('Player Left: Game Closing')
        }
        window.location.replace(data)
      })
    }
  })
}

async function Dequeue () {
  fetch('/Auth/Dequeue', {
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
    .then((response) => {
      console.log('Logged out of Authentication Server')
    })
}

async function CloseSync () {
  fetch('Game/CloseSync').then((data) => {
    console.log(data)
  })
}

async function GetHighScore(UID){
  let HighScore = 0
  fetch('/Game/PlayerHighScore', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      UID: UID
    })
  })
    .then((response) => {
      return response.json();
    }).then(data=>{
      HighScore = data;
      return HighScore;
    })

}

async function SetupHighScore(){
  let playerList = []
  fetch('Auth/ReturnPlayersScore').then(data => data.json()).then(data =>{
    playerList = data
    if(playerList.length == 0)
    {
      SetupHighScore()
      return
    }
    playerList = playerList.filter((data) => {
      if (data.UID !== sessionStorage.getItem('UID')) {
        return data
      }
    })
    playerList.forEach(player =>{
        let temp = document.getElementById('#Score' + player.UID)
        temp.innerHTML +=  " - " + player.Score;
    })
  })
  
}

async function SetupOppBoard () {
  fetch('/Auth/ReturnPlayers').then((data) => {
    return data.json()
  }).then((data) => {
    playerList = data
    playerList = playerList.filter((data) => {
      if (data.UID !== sessionStorage.getItem('UID')) {
        return data
      }
    })
    console.log('playerList: ', playerList)
    const opponentBoard = document.getElementById('playersGrid');

    SetupHighScore()

    for(let player of playerList){
      if (player.UID !== GM) {
        const container = document.createElement('div')
        container.setAttribute('id', '#' + player.UID)
        container.setAttribute('class', 'grid playerGridStyle')
        const heading = document.createElement('h2')
        heading.setAttribute('id','#Score' + player.UID)
        heading.innerHTML = player.playerName;
        heading.setAttribute('class', 'playerTitle')
        opponentBoard.appendChild(heading)
        console.log('x value: ', player)
        for (let i = 0; i < 30; i++) {
          const grid = document.createElement('div')
          grid.classList.add('col-sm-3')
          grid.classList.add('flipping')
          grid.setAttribute('id', i + 1) // index starts at one not 0
          container.appendChild(grid)
        }        
        opponentBoard.appendChild(container)
      }
    }

   // playerList.forEach(data => {
     
    //})
  })
}

async function SyncData (data) {
  fetch('/Game/Sync', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      UID: sessionStorage.getItem('UID'),
      Data: data
    })
  })
    .then((response) => {
      console.log(response)
    })
}

async function GetSyncData () {
  let temp = []
  fetch('Game/GetSync').then(data => data.json()).then((data) => {
    temp = data
    temp = temp.filter(element => {
      if (element.UID !== sessionStorage.getItem('UID')) {
        return element
      }
    })
    console.log("Sync'd data: ", temp)
    console.log('Our interest Syncs: ', temp.length)
    while (temp.length > 0) {
      const tempPlayer = temp[0].UID
      console.log('Current PlayerID: ', tempPlayer)
      const PlayerMoves = temp.filter(element => {
        if (element.UID === tempPlayer) {
          return element
        }
      })
      temp = temp.filter(element => {
        if (element.UID !== tempPlayer) {
          return element
        }
      })
      const container = document.getElementById('#' + tempPlayer)
      PlayerMoves.forEach((data) => {
        const slot = data.Moves.idLetter
        const Color = data.Moves.gridColour
        const children = Array.from(container.children)
        console.log('children: ', children)
        children.forEach(element => {
          console.log('We have ID:', element.id)
          if (element.id === slot.toString()) {
            element.style = `background-color:${Color}`
          }
        })
      })
    }
  })
}

/// Game Functionality section
document.addEventListener('DOMContentLoaded', () => {
  CheckGameMode().then(() => {
    if (SafeCheck === true) {
      const keys = document.querySelectorAll('.row input')
      for (let index = 0; index < keys.length; index++) {
        keys[index].onclick = ({ target }) => {
          const key = target.getAttribute('value')
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
    } else if (SafeCheck === false) {
      SetupOppBoard()
    }
  })
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
    grid.classList.add('col-sm-3')
    grid.classList.add('flipping')
    grid.setAttribute('id', i + 1) // index starts at one not 0
    gameBoard.appendChild(grid)
  }
  SetupOppBoard()
}

async function GetWord () {
  fetch('/Game/GetWord').then((data) => {
    return data.json()
  }).then((data) => {
    console.log('word from server: ', data)
    testWord = data.trim().toUpperCase()
  })
}

async function submit () {
  const currentArr = currentWord()
  if (currentArr.length !== 5) {
    window.alert('5 letters')
  }
  const current = currentArr.join('')
  console.log(current.toLowerCase())

  GetWord()
  let notAWord = false;
  let GuessID = -1;
  await fetch('/Game/CheckWord', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Word: current
    })
  }).then(data => data.json()).then(data =>{
    console.log("Number 1");
    if(data == -1){
      window.alert("Word Entered does not exist")
      notAWord = true;
      return
    }
    else{
      GuessID = data
    }
  })

  if(notAWord == true){
    return;
  }
  console.log("Number 2");
  // game won
  console.log('Word to Guess: ', testWord)
  console.log('Word Guessed: ', current)
  if (current === testWord) {
    window.alert('Correct')
    // Set a game over boolean to true
    // Check after all the sync functions have run then do requeue
    fetch('/Game/IncreaseScore', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        UID: sessionStorage.getItem('UID')
      })
    })
    hasWon = true;
    gameOver = true;
  }
  // check if game won
  //  && current !== testWord
  if (words.length === 6) {
    window.alert('Game-Over')
    window.alert(`Word of the day: ${testWord}`)
  }

  // turn over tiles
  let idCount = count * 5 + 1
  let timer = 300
  const Data = new Array()
  // Getting Data
  currentArr.forEach((element, i) => {
    const gridColour = gridColourFunc(element, i)
    const idLetter = idCount + i
    const temp = { idLetter, gridColour }
    Data.push(temp)
  })
  // Animation
  idCount = count * 5 + 1
  timer = 300
  // currentArr.forEach((element, i) => {
  // setTimeout(() => {
  // const gridColour = gridColourFunc(element, i)
  // const idLetter = idCount + i
  // const elementLetter = document.getElementById(idLetter)
  // elementLetter.classList.add('animate__flipInX')
  // elementLetter.style = `background-color:${gridColour}`
  // }, timer * i) // extend interval in each letter
  // })
  // await delay(1.5)

  const tempPlayer = sessionStorage.getItem('UID')
  const container = document.getElementById('grid')
  Data.forEach((data) => {
    const slot = data.idLetter
    const Color = data.gridColour
    const children = Array.from(container.children)
    children.forEach(element => {
      if (element.id === slot.toString()) {
        element.style = `background-color:${Color}`
      }
    })
  })

  count += 1
  // next row
  words.push([])
  console.log('What we passing to sync: ', Data)
  console.log('After String: ', JSON.stringify(Data))
  SyncData(Data)
  LogGuess(GuessID)
  testWord = '!'

  if (gameOver === true) {
    // Game over alert msg
    window.alert('A player has won the game. A new game will now begin')
    if(hasWon == true){
      Dequeue()
      CloseSync()
      ClearGameMode()
    }else if(hasWon == false){
      fetch('/Game/EndStreak', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UID: sessionStorage.getItem('UID')
        })
      })
      window.alert("You Lose! hahah streak bye bye")
      Dequeue();
      CloseSync()
      ClearGameMode()
    }
    
  } else {
    // do nothing game is not over
    // potentially invert this logic and encompass the relevant checks in the future
  }
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

function delay (n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000)
  })
}

async function LogGuess(data){
  fetch('/Game/LogGuess', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      UID: sessionStorage.getItem('UID'),
      WordID: data
    })
  })
}
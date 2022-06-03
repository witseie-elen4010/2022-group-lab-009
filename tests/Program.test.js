
const request = require("supertest");
const express = require("express");
let app = require("../index")
const UIDLib = require('../scripts/HashGen')
const DB = require("../scripts/dbInteraction")

beforeAll(() =>{
  app.close();
})

//==============================================================================\\
//Route Tests
//==============================================================================\\
describe('Can Reach Game Page', function () {
  test('responds to /Game', async () => {
    const res = await request(app).get('/Game')
    expect(res.statusCode).toBe(200);
  });
})


describe('Can Reach Home Page', function () {
  test('responds to /', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200);
  });
})

describe('Can Reach Queue Page', function () {
  test('responds to /Queue', async () => {
    const res = await request(app).get('/Queue')
    expect(res.statusCode).toBe(200);
  });
})



//==============================================================================\\
//Hash test
//==============================================================================\\

describe('Hash Test', function () {
  test('Can Generate Hash', async () => { 
    expect(UIDLib.GenerateUniqueHash("Ivan")).toBe(2291258)
  });
})

//==============================================================================\\
//Login
//==============================================================================\\

describe('Can login', function () {
  test('responds to /Auth/AddNewConnection', async () => {
    const res = await request(app).post('/Login/Login').send({playerName: "admin", userPassword: "admin"});
    expect(res.body).toBe(3)
  });
})

describe('Cant login', function () {
  test('responds to /Auth/AddNewConnection', async () => {
    const res = await request(app).post('/Login/Login').send({playerName: "admin", userPassword: "nonadmin"});
    expect(res.body).toBe("FAILED")
  });
})

//==============================================================================\\
//Queue Tests
//==============================================================================\\

describe('testing adding connection', function () {
    test('responds to /Auth/AddNewConnection', async () => {
      const res = await request(app).post('/Auth/AddNewConnection').send({playerName: "Ivan", UID: "200002"});
      expect(res.statusCode).toBe(302);
      expect(res.header['location']).toBe("/Queue")
    });
})

describe('Lobby open', function () {
    test('responds to /Auth/LobbyOpen', async () => {
      const res = await request(app).get('/Auth/LobbyOpen')
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("true")
    });
})

describe('Able to generate UID', function () {
  test('responds to /Auth/GenerateNewUID', async () => {
    const res = await request(app).post('/Auth/GenerateNewUID').send({playerName: "Ivan"});
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('2291258')
  });
})

describe('Good ACK', function () {
    test('responds to /Auth/ACK', async () => {
      const res = await request(app).post('/Auth/ACK').send({playerName: "Ivan", UID: "200002"})
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe("Sucess!")
    });
})

describe('Failed ACK', function () {
    test('responds to /Auth/ACK', async () => {
      const res = await request(app).post('/Auth/ACK').send({playerName: "Dobby", UID: "2020002"})
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe("/")
    });
})

describe('Able to return players', function () {
    test('responds to /Auth/ReturnPlayers', async () => {
      const res = await request(app).get('/Auth/ReturnPlayers')
      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual([{"UID": "200002", "playerName": "Ivan"}])
    });
})

describe('Able to Dequeue', function () {
    test('responds to /Auth/Dequeue', async () => {
      const res = await request(app).post('/Auth/Dequeue').send({playerName: "Dobby", UID: "2020002"})
      expect(res.statusCode).toBe(302);
      expect(res.header['location']).toBe("/")
    });
})


describe('Able to see status of lobby', function () {
    test('responds to /Auth/Status', async () => {
      const res = await request(app).get('/Auth/Status')
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe("/waiting")
    });
})

//==============================================================================\\
//Game Tests
//==============================================================================\\

describe('Cant submit fake word', function () {
  test('responds to /Game/CheckWord', async () => {
    const res = await request(app).post('/Game/CheckWord').send({Word: "FFGGH"})
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(-1)
  });
})

describe('Can get word', function () {
  test('responds to /Game/GetWord', async () => {
    const res = await request(app).get('/Game/GetWord')
    expect(res.statusCode).toBe(200);
    expect(res.body).not.toBe("")
  });
})

describe('Can get game Mode', function () {
  test('responds to /Game/GetGameMode', async () => {
    const res = await request(app).get('/Game/GetGameMode')
    expect(res.statusCode).toBe(200);
    expect(res.body.gameMode).toBe(false)
  });
})


//==============================================================================\\
//DataBase Tests
//==============================================================================\\

describe('Database Test', function() {
  jest.setTimeout(10000);
  test('Can get a random word from the database', async () =>{
    const randomWord = await DB.getRandomWord()

    const ID = await DB.IsLegalWord(randomWord.Word)

    expect(ID).toBe(randomWord.WordID)
  })
})

describe('Database Test', function() {
  jest.setTimeout(10000);
  test('Can check for legal word', async () =>{
    const legalWord = 'after'

    const ID = await DB.IsLegalWord(legalWord)

    expect(ID).not.toBe(-1)
  })
})

describe('Database Test', function() {
  jest.setTimeout(15000);
  test('Can register a player and record it in the database', async () =>{
    const testAccount = 'TestAccount'
    const testPassword = 'HashedPassWord'
    
    const registeredID = await DB.RegisterPlayer(testAccount, testPassword)

    const logInID = await DB.PlayerLogin(testAccount, testPassword)

    await DB.DeletePlayerByID(registeredID)

    expect(registeredID).toBe(logInID)
  })
})

describe('Database Test', function() {
  jest.setTimeout(15000);
  test('Can a player login', async () =>{
    const testAccount = 'LogTestAccount'
    const testPassword = 'HashedPassWord'
    
    const registeredID = await DB.RegisterPlayer(testAccount, testPassword)

    const logInID = await DB.PlayerLogin(testAccount, testPassword)

    await DB.DeletePlayerByID(registeredID)

    expect(registeredID).toBe(logInID)
  })
})

//==============================================================================\\




beforeEach(() => {
  app = require("../index")
});

afterEach(()=>{
  app.close();
})

afterAll(() => {
    app.close();
 })










const request = require("supertest");
const express = require("express");
let app = require("../index")

beforeAll(() =>{
  app.close();
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
    expect(res.body).toBe("")
  });
})

describe('Can get game Mode', function () {
  test('responds to /Game/GetGameMode', async () => {
    const res = await request(app).get('/Game/GetGameMode')
    expect(res.statusCode).toBe(200);
    expect(res.body.gameMode).toBe(false)
  });
})

beforeEach(() => {
  app = require("../index")
});

afterEach(()=>{
  app.close();
})

afterAll(() => {
    app.close();
 })









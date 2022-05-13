
const request = require("supertest");
const express = require("express");
const app = require("../index")


describe('testing adding connection', function () {
    test('responds to /Auth/AddNewConnection', async () => {
      const res = await request(app).post('/Auth/AddNewConnection').send({playerName: "Ivan", UID: "200002"});
      expect(res.statusCode).toBe(302);
      expect(res.header['location']).toBe("/Queue")
    });
})

describe('Good Home Routes', function () {
    test('responds to /Auth/AddNewConnection', async () => {
      const res = await request(app).get('/Auth/LobbyOpen')
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("true")
    });
})

describe('Able to generate UID', function () {
  test('responds to /Auth/GenerateNewUID', async () => {
    const res = await request(app).post('/Auth/GenerateNewUID').send({playerName: "Ivan"});
    expect(res.statusCode).toBe(200);
    console.log(res)
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
      console.log(res)
      expect(res.body).toBe("/waiting")
    });
})



afterAll(() => {
    app.close();
 })









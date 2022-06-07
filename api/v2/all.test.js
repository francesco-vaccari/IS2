const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../../index');
const User = require('../../models/User');
const Player = require('../../models/Player');

beforeAll(async () => {

  let connection;

  jest.unmock('mongoose');
  connection = await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Database connected!');

  let user1 = new User({
    username: "user",
    password: "pass",
    playerAssigned: "true",
    player: "629f7cd6fb6e7964f66ff695"
  })

  let user2 = new User({
    username: "user3",
    password: "abc",
    playerAssigned: "false",
  })

  let user3 = new User({
    username: "user2",
    password: "abc",
    playerAssigned: "false",
  })

  let user4 = new User({
    username: "user1",
    password: "pass",
    playerAssigned: "false",
  })

  let player1 = new Player({
    _id: "629f7cd6fb6e7964f66ff695",
    name: "massimo",
    surname: "maffezzoli"
  })
  await user1.save()
  await user2.save()
  await user3.save()
  await user4.save()
  await player1.save()

  return connection; // Need to return the Promise db connection?
});

afterAll(async () => {
  await User.deleteOne({ username: "user" })
  await User.deleteOne({ username: "user2" })
  await User.deleteOne({ username: "user3" })
  await User.deleteOne({ username: "user1" })
  await User.deleteOne({ username: "maximax" })
  await Player.deleteOne({ _id: "629f7cd6fb6e7964f66ff695" })
  await mongoose.connection.close(true);

  console.log("Database connection closed");
});

describe('POST /api/v2/users/', () => {

  test('POST /api/v2/users/ non ancora utente', () => {
    return request(app).post('/api/v2/users/')
      .send({ username: "maximax", password: "123" })
      .expect(201)
  });

  test('POST /api/v2/users/ campi vuoti', () => {
    return request(app).post('/api/v2/users/')
      .send({ username: "", password: "" })
      .expect(400, { error: "errore nei dati inseriti" })
  });

  test('POST /api/v2/users/ no password', () => {
    return request(app).post('/api/v2/users/')
      .send({ username: "maximax", password: "" })
      .expect(400, { error: "errore nei dati inseriti" })
  });

  test('POST /api/v2/users/ no username', () => {
    return request(app).post('/api/v2/users/')
      .send({ username: "", password: "123" })
      .expect(400, { error: "errore nei dati inseriti" })
  });

  test('POST /api/v2/users/ no body', () => {
    return request(app).post('/api/v2/users/')
      .send({})
      .expect(400, { error: "errore nei dati inseriti" })
  });

})

describe('PUT /api/v2/users/me', () => {

  test('PUT /api/v2/users/me no token', () => {
    return request(app).put('/api/v2/users/me')
      .send({ newPassword: "abc" })
      .expect(401, {
        success: false,
        error: "No token provided."
      })
  });

  var token4 = jwt.sign({ username: 'user2' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('PUT /api/v2/users/me utente registrato', () => {
    return request(app).put('/api/v2/users/me')
      .set('x-access-token', token4)
      .send({ newPassword: "abc" })
      .expect(200)
  });

  test('PUT /api/v2/users/me utente registrato campo vuoto', () => {
    return request(app).put('/api/v2/users/me')
      .set('x-access-token', token4)
      .send({ newPassword: "" })
      .expect(400, { error: "errore nei dati inseriti" })
  });

  test('PUT /api/v2/users/me utente registrato campo non presente', () => {
    return request(app).put('/api/v2/users/me')
      .set('x-access-token', token4)
      .send({})
      .expect(400, { error: "errore nei dati inseriti" })
  });

  test('PUT /api/v2/users/me utente registrato campo mancante', () => {
    return request(app).put('/api/v2/users/me')
      .set('x-access-token', token4)
      .expect(400, { error: "errore nei dati inseriti" })
  });

})

describe('GET /api/v2/users/me', () => {

  var token2 = jwt.sign({ username: 'ciao' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('GET /api/v2/users/me utente non registrato', () => {
    return request(app).get('/api/v2/users/me')
      .set('x-access-token', token2)
      .expect(404, { error: "Utente non trovato" })
  });

  test('GET /api/v2/users/me no token', () => {
    return request(app).get('/api/v2/users/me')
      .expect(401, {
        success: false,
        error: "No token provided."
      })
  });

  var token3 = jwt.sign({ username: 'user' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('GET /api/v2/users/me utente registrato', () => {
    return request(app).get('/api/v2/users/me')
      .set('x-access-token', token3)
      .expect(200, {
        username: "user",
        password: "pass"
      })
  });

})

describe('DELETE /api/v2/users/me', () => {

  var token = jwt.sign({ username: 'ciao' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('DELETE /api/v2/users/me utente non registrato', () => {
    return request(app).delete('/api/v2/users/me')
      .set('x-access-token', token)
      .expect(404, { error: "Utente non eliminato" })
  });

  test('DELETE /api/v2/users/me no token', () => {
    return request(app).delete('/api/v2/users/me')
      .expect(401, {
        success: false,
        error: "No token provided."
      })
  });

  var token1 = jwt.sign({ username: 'user1' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('DELETE /api/v2/users/me utente registrato', () => {
    return request(app).delete('/api/v2/users/me')
      .set('x-access-token', token1)
      .expect(204)
  });

})

describe('POST /api/v2/tourneys/', () => {

  var token = jwt.sign({ username: 'user' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('POST /api/v2/tourneys/ zero tornei', async () => {
    await request(app).post('/api/v2/tourneys/')
      .set("x-access-token", token)
      .send({
        name: "torneo",
        startingDate: "2022-06-03",
        endingDate: "2022-07-03",
        format: "Italiana",
        teams: ["team1", "team2", "team3"]
      })
      .expect(201)
  });

  test('POST /api/v2/tourneys/ zero tornei', async () => {
    await request(app).post('/api/v2/tourneys/')
      .set("x-access-token", token)
      .send({
        name: "torneo",
        startingDate: "2022-06-03",
        endingDate: "2022-07-03",
        format: "Italiana",
        teams: ["team1", "team2", "team3"]
      })
      .expect(409, {
        error: "nome torneo già utilizzato"
      })
  });

  test('POST /api/v2/tourneys/ campi errati', async () => {
    await request(app).post('/api/v2/tourneys/')
      .set("x-access-token", token)
      .send({})
      .expect(400, { error: "errore nei dati inseriti" })
  });

  test('POST /api/v2/tourneys/ zero tornei', async () => {
    await request(app).post('/api/v2/tourneys/')
      .expect(401, {
        success: false,
        error: "No token provided."
      })
  });

  let token1 = "ciao"

  test('POST /api/v2/tourneys/ zero tornei', async () => {
    await request(app).post('/api/v2/tourneys/')
      .set("x-access-token", token1)
      .send({
        name: "torneo",
        startingDate: "2022-06-03",
        endingDate: "2022-07-03",
        format: "Italiana",
        teams: ["team1", "team2", "team3"]
      })
      .expect(403, { success: false, message: 'Failed to authenticate token.' })
  });

})

describe('GET /api/v2/tourneys/:name ', () => {

  var token2 = jwt.sign({ username: 'user' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('GET /api/v2/tourneys/:name player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo')
      .set('x-access-token', token2)
      .expect(200)
  });

  test('GET /api/v2/tourneys/:name player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo')
      .expect(401)
  });

  let token1 = "ciao"

  test('GET /api/v2/tourneys/:name player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo')
      .set('x-access-token', token1)
      .expect(403)
  });

  test('GET /api/v2/tourneys/:name player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo1')
      .set('x-access-token', token2)
      .expect(404)
  });
})

describe('GET /api/v2/tourneys/:nameTourney/:nameTeam ', () => {

  var token2 = jwt.sign({ username: 'user' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('GET /api/v2/tourneys/:nameTourney/:nameTeam player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo/team1')
      .set('x-access-token', token2)
      .expect(200)
  });

  test('GET /api/v2/tourneys/:nameTourney/:nameTeam player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo/team1')
      .expect(401)
  });

  let token1 = "ciao"

  test('GET /api/v2/tourneys/:nameTourney/:nameTeam player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo/team1')
      .set('x-access-token', token1)
      .expect(403)
  });

  test('GET /api/v2/tourneys/:nameTourney/:nameTeam player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo1/team1')
      .set('x-access-token', token2)
      .expect(404)
  });

  test('GET /api/v2/tourneys/:nameTourney/:nameTeam player non trovato', () => {
    return request(app).get('/api/v2/tourneys/torneo/team8')
      .set('x-access-token', token2)
      .expect(404)
  });
})

describe('PUT /api/v2/tourneys/:name/:nameTeam ', () => {

  let token2 = jwt.sign({ username: 'user' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('PUT /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).put('/api/v2/tourneys/torneo/team1')
      .set('x-access-token', token2)
      .expect(200)
  });

  test('PUT /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).put('/api/v2/tourneys/torneo/team1')
      .set('x-access-token', token2)
      .expect(403)
  });

  test('PUT /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).put('/api/v2/tourneys/torneo/team1')
      .expect(401)
  });

  let token1 = "ciao"

  test('PUT /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).put('/api/v2/tourneys/torneo/team1')
      .set('x-access-token', token1)
      .expect(403)
  });

  test('PUT /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).put('/api/v2/tourneys/torneo1/team1')
      .set('x-access-token', token2)
      .expect(404)
  });

  test('PUT /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).put('/api/v2/tourneys/torneo/team8')
      .set('x-access-token', token2)
      .expect(404)
  });

  var token3 = jwt.sign({ username: 'user3' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('PUT /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).put('/api/v2/tourneys/torneo/team1')
      .set('x-access-token', token3)
      .expect(400)
  });
})

describe('DELETE /api/v2/tourneys/:name', () => {

  test('DELETE /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).delete('/api/v2/tourneys/torneo')
      .expect(401)
  });

  test('DELETE /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).delete('/api/v2/tourneys/torneo')
      .set('x-access-token', "ciao")
      .expect(403)
  });

  var token5 = jwt.sign({ username: 'user' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('DELETE /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).delete('/api/v2/tourneys/torneo9')
      .set('x-access-token', token5)
      .expect(404)
  });

  var token6 = jwt.sign({ username: 'user3' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('DELETE /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).delete('/api/v2/tourneys/torneo')
      .set('x-access-token', token6)
      .expect(400)
  });

  test('DELETE /api/v2/tourneys/:namey/:nameTeam ', () => {
    return request(app).delete('/api/v2/tourneys/torneo')
      .set('x-access-token', token5)
      .expect(204)
  });
})

describe('POST /api/v2/players/', () => {

  var token = jwt.sign({ username: 'user2' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('POST /api/v2/players/ giocatore non esistente', () => {
    return request(app).post('/api/v2/players/')
      .set('x-access-token', token)
      .send({ name: "tizio", surname: "caio" })
      .expect(201)
  });

  test('POST /api/v2/players/ campi vuoti', () => {
    return request(app).post('/api/v2/players/')
      .set('x-access-token', token)
      .send({ name: "", surname: "" })
      .expect(400)
  });

  test('POST /api/v2/players/ no surname', () => {
    return request(app).post('/api/v2/players/')
      .set('x-access-token', token)
      .send({ name: "maximax", surname: "" })
      .expect(400)
  });

  test('POST /api/v2/players/ no name', () => {
    return request(app).post('/api/v2/players/')
      .set('x-access-token', token)
      .send({ name: "", surname: "123" })
      .expect(400)
  });

  test('POST /api/v2/players/ no body', () => {
    return request(app).post('/api/v2/players/')
      .set('x-access-token', token)
      .send({})
      .expect(400)
  });

})

describe('GET /api/v2/players/', () => {

  test('GET /api/v2/players/me player non trovato', () => {
    return request(app).get('/api/v2/players/me')
      .set('x-access-token', "cioa")
      .expect(403)
  });

  test('GET /api/v2/players/me no token', () => {
    return request(app).get('/api/v2/players/me')
      .expect(401)
  });

  var token1 = jwt.sign({ username: 'user' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('GET /api/v2/players/me player registrato', () => {
    return request(app).get('/api/v2/players/me')
      .set('x-access-token', token1)
      .expect(200)
  });

})

describe('DELETE /api/v2/players/', () => {

  test('DELETE /api/v2/players/me player non registrato', () => {
    return request(app).delete('/api/v2/players/me')
      .set('x-access-token', "token")
      .expect(403)
  });

  test('DELETE /api/v2/players/me no token', () => {
    return request(app).delete('/api/v2/players/me')
      .expect(401)
  });

  var token10 = jwt.sign({ username: 'user2' }, process.env.SUPER_SECRET, { expiresIn: 86400 }); // create a valid token

  test('DELETE /api/v2/players/me player registrato', () => {
    return request(app).delete('/api/v2/players/me')
      .set('x-access-token', token10)
      .expect(204)
  });

})


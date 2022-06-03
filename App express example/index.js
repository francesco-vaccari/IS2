const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded( { extended : true }))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('Connesso al database: ' + process.env.DB_CONNECTION)
})


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home')
})


/////////ROUTES/////////////////////////////////
const login = require('./routes/login')
app.use('/login', login)

const signup = require('./routes/signup')
app.use('/signup', signup)

const profile = require('./routes/profile')
app.use('/profile', profile)

const creazionetorneo = require('./routes/creazioneTorneo')
app.use('/creazioneTorneo', creazionetorneo)

const torneo = require('./routes/torneo')
app.use('/torneo', torneo)
///////////////////////////////////////////////

/////////API ROUTES/////////////////////////////
const tourneys = require('./api/v2/tourneys.js')
app.use('/api/v2/tourneys', tourneys)

const users = require('./api/v2/users.js')
app.use('/api/v2/users', users)

const players = require('./api/v2/players.js')
app.use('/api/v2/players', players)

///////////////////////////////////////////////


app.listen(3000)
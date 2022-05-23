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
const users = require('./api/v1/users.js')
app.use('/api/v1/users', users)

const tourneys = require('./api/v1/tourneys.js')
app.use('/api/v1/tourneys', tourneys)
///////////////////////////////////////////////


app.listen(3000)
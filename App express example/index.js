const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')
const app = express()
const session = require('express-session')


app.use(express.static('public'))
app.use(express.urlencoded( { extended : true }))
app.use(bodyParser.json())
app.use(cors())
app.use(session({
    secret: 'secretkey', //salvata in .env immagino
    resave: false,
    saveUninitialized: false
}))

mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log('Connesso al database: ' + process.env.DB_CONNECTION)
})


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', { req: req })
})


//////////////TOKEN ROUTES////////////////////////////////
const authentication = require('./api/v2/authentication.js');
const tokenChecker = require('./api/v2/tokenChecker.js');
app.use('/api/v2/authentication', authentication);
app.use('/api/v2/users/me', tokenChecker);
app.use('/api/v2/tourneys', tokenChecker);
app.use('/api/v2/players', tokenChecker);
/////////////////////////////////////////////////////////////////

/////////ROUTES/////////////////////////////////
const login = require('./routes/login')
app.use('/login', login)

const signup = require('./routes/signup')
app.use('/signup', signup)

const createTourney = require('./routes/createTourney')
app.use('/createTourney', createTourney)

const t = require('./routes/tourneys')
app.use('/tourneys', t)

const profile = require('./routes/profile')
app.use('/profile', profile)
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
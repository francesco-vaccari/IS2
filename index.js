const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')
const app = express()
const session = require('express-session')


const port = process.env.PORT //|| 8080


app.use(express.static('public'))
app.use(express.urlencoded( { extended : true }))
app.use(bodyParser.json())
app.use(cors())
app.use(session({
    secret: 'secretkey', //salvata in .env immagino
    resave: false,
    saveUninitialized: false
}))


app.set('view engine', 'ejs');

const Tourney = require('./models/Tourney')

app.get('/', async (req, res) => {
    let tornei = await Tourney.find({})
    res.render('home', { req: req, tornei: tornei })
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

app.locals.db = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("Connected to Database");

    if(process.env.NODE_ENV !== 'test'){
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
});

module.exports = app
const express = require('express')
const router = express.Router()
const { isNull } = require('url/util')
const Tourney = require('../../models/Tourney')
const Team = require('../../models/Team')

router.get('/', (req, res) => {

    const team1 = new Team({
        name: "team1"
    })
    const team2 = new Team({
        name: "team2"
    })
    team1.save()
    team2.save()

    const tourney = new Tourney({
        name: "torneo",
        startingDate: new Date("2022-06-01"),
        endingDate: new Date("2022-06-10"),
        private: true,
        format: "boh",
        teams: [],
        games: []
    })

    tourney.teams.push(team1)
    tourney.teams.push(team2)

    tourney.save()
    .then(data => {
        console.log(tourney)
    })
})

module.exports = router
const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/:username', (req, res) => {
    res.send("ciao " + req.params.username)
    //qua c'è da capire come fare a creare una pagina html dinamica (credo ejs)
})

module.exports = router
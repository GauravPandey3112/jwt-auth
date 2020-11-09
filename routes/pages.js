const express = require('express')

const router = express.Router();


router.get('/', (req, res) => {
    res.render("home")
})

router.get('/auth/register', (req, res) => {
    res.render("register")
})

router.get('/auth/login', (req, res) => {
    res.render("login")
})


module.exports = router
// const Express = require("express")
// const router = Express.Router()
const {PieModel} = require("../models")

const router = require("express").Router()

router.get("/", (req, res) => res.send("I love pie!"))

module.exports = router

// const Express = require("express")
// const router = Express.Router()
const { PieModel } = require("../models")

const router = require("express").Router()

router.get("/", async (req, res) => {
    // async function because sequelize methods generally return a promise.
    try {
        // holds a promise resolved info from .findAll() method of sqlize
        const allPies = await PieModel.findAll()
        // the response is sent with a status and instance of info that's turned into an object
        res.status(200).json(allPies)
    } catch (err) {
        // send a response with an error status code and an object showing the error
        res.status(500).json({
            error: err,
        })
    }
})

router.post("/", async (req, res) => {
    
    // object destructuring the values of the body of incoming request
    const {
        nameOfPie,
        baseOfPie,
        crust,
        timeToBake,
        servings,
        rating
    } = req.body
   
    console.log(nameOfPie, baseOfPie, "----------------")

    try {
        const Pie = await PieModel.create({
            nameOfPie,
            baseOfPie,
            crust,
            timeToBake,
            servings,
            rating,
        })

        res.status(201).json({
            message: "Pie successfully created.",
            Pie,
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to create pie: ${err}`
        })
    }
})


module.exports = router

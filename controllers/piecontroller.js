// const Express = require("express")
// const router = Express.Router()
const { response } = require("express")
const { PieModel } = require("../models")
const { validateSession } = require("../middleware")

const router = require("express").Router()

/*
    CRUD Notes
        Create --> POST (has body)
        Read --> GET (no body)
        Update --> PUT (has body)
        Delete --> DELETE (no body)
*/

// GET all
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

// Create One
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

// GET One
router.get("/:name", async (req, res) => {
    try {
        const locatedPie = await PieModel.findOne({
            where: {
                nameOfPie: req.params.name
            },
        })

        res.status(200).json({
            message: "Pie successfully retrieved",
            locatedPie,
        })

    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve pies: ${err}`
        })
    }
})

//Update One
// router.put("/:id", async (req, res) => {
//     const {
//         nameOfPie,
//         baseOfPie,
//         crust,
//         timeToBake,
//         servings,
//         rating
//     } = req.body

//     try {
//         const pieUpdate = await PieModel.update(
//             {nameOfPie, baseOfPie, crust, timeToBake, servings, rating},
//             {where: {id: req.params.id}}
//         )

//         res.status(200).json({
//             message: "Pie updated",
//             pieUpdate
//         })

//     } catch (err) {
//         res.status(500).json({
//             error: err
//         })
//     }
// })

router.put("/:id", async (req, res) => {
    const {
        nameOfPie,
        baseOfPie,
        crust,
        timeToBake,
        servings,
        rating
    } = req.body

    try {
        const pieUpdate = await PieModel.update(
            { nameOfPie, baseOfPie, crust, timeToBake, servings, rating},
            { where: { id: req.params.id } }
        )

        pieUpdate.then((result) => {
            res.status(200).json({
                message: "Pie updated",
                updated: result
            })
        })

        

    } catch (err) {
        res.status(500).json({
            message: "Failed to update pie",
            error: err
        })
    }
})

// Delete
router.delete("/:id", async (req, res) => {
    try {
        await PieModel.destroy({
            where: {
                id: req.params.id
            }
        }).then((result) => {
            if (result) {
                res.status(200).json({
                    message: "Pie successfully deleted",
                    deletedPie: result
                })
            } else {
                res.status(400).json({
                    message: "Pie ID does not exist"
                })
            }
            
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete pie: ${err}`
        })
    }
})


module.exports = router

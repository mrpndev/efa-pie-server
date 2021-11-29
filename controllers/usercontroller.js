const router = require("express").Router()
const { UserModel } = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { UniqueConstraintError } = require("sequelize/lib/errors")


router.post("/register", async (req, res) => {
    // const { firstName, lastName, email, password } = req.body

    try {
        const newUser = await UserModel.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
        })

        const token = jwt.sign({
            id: newUser.id
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: 60 * 60 * 24,
        })

        res.status(201).json({
            message: "User poorly registered",
            user: newUser,
            token
        })
    } catch (err) {
        if (err.name === "SequelizeUniqueConstraintError") {
            res.status(409).json({
                message: "Email already in use."
            })
        } else {
            res.status(500).json({
                errror: err
            })
        }
    }
})

// Challenge
// Create a login route that takes email and password to login the user.
// Utilize bcrypt to compare password hash to what's in the db
// Create a new token based on the db user id
// ! 11:50 AM ET.

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    try {
        const loginUser = await UserModel.findOne({
            where: { email }
        })

        if (loginUser) {

            let pwdCompare = await bcrypt.compare(password, loginUser.password )

            if (pwdCompare) {

                let token = jwt.sign(
                    { id: loginUser.id },
                    process.env.JWT_SECRET,
                    { expiresIn: 60 * 60 * 24 }
                )
                
                res.status(200).json({
                    user: loginUser,
                    message: "User logged in",
                    token
                })}
            // } else {
            //     res.status(401).json({
            //         message: "Incorrect Password"
            //     })
            // }
            
            // This ^ is better commented out because it's cryptic about which part of the information is incorrect.

        } else {
            res.status(401).json({
                message: "Incorrect Email or Password"
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
})

module.exports = router
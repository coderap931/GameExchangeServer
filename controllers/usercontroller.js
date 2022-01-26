const express = require("express");
const router = express.Router();
const {User} = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const {Op} = require("sequelize");

//!Register endpoint
router.post("/register", async (req, res) => {
    try{
        const{firstname, lastname, username, email, password} = req.body.user;
        //encrypt password
        const salt = bcrypt.genSaltSync(); //generate salt
        const pwHashed = bcrypt.hashSync(password, salt); //hash password
        const newUser = await User.create({//create user server-side
            //v key     v value
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: pwHashed,
        });

        let token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

        res.status(200).json({
            message: "saved",
            user: newUser,
            sessionToken: token
        });
    } catch (err) {
        if (err) {
            res.status(500).json({
                message: `${err}`,
            });
        }
    }
});

//! Login endpoint
router.post("/login", async (req, res) => {
    const {username, password} = req.body.user;
    //find user in db by username
    try{
        const user = await User.findOne({
            where: {
                username: username,
            }
        });

        //verify user credentials

        //if passwords do not match
        if(!user.username) {
            res.status(401).json({
                message: "Invalid credentials"
            });
            return false;

            //if passwords do match
        } else {
            const userAuth = bcrypt.compareSync(password, user.password);
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
            res.status(200).json({
                username: user.username,
                message: "Login successful",
                user: User,
                sessionToken: token,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong, unable to login"
        });
    }
});



module.exports = router;
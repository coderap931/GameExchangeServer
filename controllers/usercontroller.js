const express = require("express");
const router = express.Router();
const {models} = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//WORKING
//!User Register Endpoint
router.post("/register", async (req, res) => {
    //register new user in db
    try{
        console.log("entered try");
        const{first_name, last_name, username, email, password, role} = req.body.user;
        console.log("got values from body");
        console.log("Values: ", first_name, last_name, username, email, password, role);
        //encrypt password
        const salt = bcrypt.genSaltSync(); //generate salt
        console.log("generated salt");
        const pwHashed = bcrypt.hashSync(password, salt); //hash password
        console.log("hashed password");
        console.log(pwHashed);
        const newUser = await models.User.create({ //create user server-side
            first_name,
            last_name,
            username,
            email,
            password: pwHashed,
            rating: 100,
            role,
        });
        console.log("newUser assigned values");
        let token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        console.log("assigning token");
        res.status(200).json({
            message: "Success",
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

//WORKING
//!User Login Endpoint
router.post("/login", async (req, res) => {
    const {username, password} = req.body.user;
    //find user in db by username
    try{
        const user = await models.User.findOne({
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
            //!Reexamine logic, why is userAuth declared but not read?
            const userAuth = bcrypt.compareSync(password, user.password);
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
            res.status(200).json({
                username: user.username,
                message: "Login successful",
                user: userAuth,
                sessionToken: token,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong, unable to login"
        });
    }
});

//?NOT WORKING
//!User Lookup Endpoint
//**Admin route
router.get('/userinfo/:username', async (req, res) => {
    const targetUserUsername = req.params.username;
    const role = req.user.role;
    //find user in db by username (if requesting user is admin)
    try {
        const query = {
            where: {
                username: targetUserUsername,
            }
        };

        //if user is found, return them (if requesting user is admin)
        if (role === 'Admin'){
            const userReturned = await models.User.findOne(query);
            res.status(200).json(userReturned);
        } else {
            res.status(401).json({
                message: `You must be an administrator to view user details`,
            })
        }

        //if user is not found, return error
    } catch (err) {
        res.status(500).json({
            message: `User not found: ${err}`,
        })
    }
})

//?NOT WORKING
//!User Delete Endpoint
//**Admin route
router.delete('/delete/:username', async (req, res) => {
    const targetUserUsername = req.params.username;
    const role = req.user.role;
    //delete user in db by id
    try{
        const query = {
            where: {
                id: targetUserUsername,
            }
        };
        if (role === 'Admin'){
            const result = await models.User.destroy(query);
            res.status(200).json(result);
        } else {
            res.status(401).json({
                message: `You must be an administrator to delete a user`,
            })
        }

    } catch (err) {
        res.status(500).json({error: err});
    }
})

module.exports = router;
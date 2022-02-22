const express = require("express");
const router = express.Router();
let validateJWT = require('../middleware/validate-jwt');
const {models} = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//WORKING
//!User Register Endpoint
router.post("/register", async (req, res) => {
    //register new user in db
    try{
        const{first_name, last_name, username, email, password, role} = req.body.user;
        //encrypt password
        const salt = bcrypt.genSaltSync(); //generate salt
        const pwHashed = bcrypt.hashSync(password, salt); //hash password
        const newUser = await models.User.create({ //create user server-side
            first_name,
            last_name,
            username,
            email,
            password: pwHashed,
            rating: 100,
            role,
        });
        let token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        res.status(200).json({
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
//!User Register Endpoint
router.post("/registeradmin", validateJWT, async (req, res) => {
    const role = req.user.role;

    if (role === 'Admin') {
        //register new user in db
        try{
            const{first_name, last_name, username, email, password, role} = req.body.user;
            //encrypt password
            const salt = bcrypt.genSaltSync(); //generate salt
            const pwHashed = bcrypt.hashSync(password, salt); //hash password
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
    } else {
        res.status(401).json({
            message: 'You must be an administrator to access this page'
        })
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

//WORKING
//!User Role Lookup Endpoint
router.get('/userrole/:username', async (req, res) => {
    const targetUserUsername = req.params.username;
    try {
        const query = {
            where: {
                username: targetUserUsername,
            }
        };
            const userReturned = await models.User.findOne(query);
            res.status(200).json({
                role: userReturned.role
            });
    } catch (err) {
        res.status(500).json({
            message: `An error occurreed: ${err}`,
        })
    }
})

//WORKING
//!User Lookup Endpoint
//**Admin route
router.get('/userinfo/:username', validateJWT, async (req, res) => {
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
            res.status(200).json({
                message: `ID: ${userReturned.id}, First Name: ${userReturned.first_name}, Last Name ${userReturned.last_name}, Username: ${userReturned.username}, Email: ${userReturned.email}, Rating: ${userReturned.rating}, Role: ${userReturned.role}` 
            });
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

//WORKING
//!User Delete Endpoint
//**Admin route
router.delete('/delete/:username', validateJWT, async (req, res) => {
    const targetUserUsername = req.params.username;
    const role = req.user.role;
    //delete user in db by id
    try{
        const query = {
            where: {
                username: targetUserUsername,
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
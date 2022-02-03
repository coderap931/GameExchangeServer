const express = require("express");
const router = express.Router();
const {User} = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        const newUser = await User.create({ //create user server-side
            //v key     v value
            first_name: first_name,
            last_name: last_name,
            username: username,
            email: email,
            password: pwHashed,
            rating: 100,
            role: role,
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

//!User Login Endpoint
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
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong, unable to login"
        });
    }
});

//!User Lookup Endpoint
//**Admin route
router.get('/userinfo/:id', async (req, res) => {
    const targetUserId = req.params.id;
    const role = req.user.role;
    //find user in db by id (if requesting user is admin)
    try {
        const query = {
            where: {
                id: targetUserId,
            }
        };

        //if user is found, return them (if requesting user is admin)
        if (role === 'Admin'){
            const userReturned = await User.findOne(query);
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

//!User Delete Endpoint
//**Admin route
router.delete('/delete/:id', async (req, res) => {
    const targetUserId = req.params.id;
    const role = rew.user.role;
    //delete user in db by id
    try{
        const query = {
            where: {
                id: targetUserId,
            }
        };
        if (role === 'Admin'){
            const result = await User.destroy(query);
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
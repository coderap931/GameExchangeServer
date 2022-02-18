const express = require("express");
const router = express.Router();
const cors = require('cors');
let validateJWT = require('../middleware/validate-jwt');
const { models } = require("../models");
router.use(cors());

//WORKING
//!Pictures Create Endpoint
router.post("/create/:id", validateJWT, async (req, res) => {
    const { picture_one, picture_two, picture_three, picture_four, picture_five } = req.body.pictures;
    const listingId = req.params.id;
    const id = req.user.id;

    //define new Pictures for Listing
    const picturesEntry = {
        listingId: listingId,
        picture_one,
        picture_two,
        picture_three,
        picture_four,
        picture_five,
    }

    //define query
    const query = {
        where: {
            id: listingId,
        }
    }

    //check that user is owner of listing pictures are for
    try {
        const listingReturned = await models.Listing.findOne(query);
        if (id === listingReturned.userId) {
            //add new Pictures to db
            try {
                const newPictures = await models.Pictures.create(picturesEntry);
                res.status(200).json(newPictures);
            } catch (err) {
                res.status(500).json({ error: err });
            }
        } else {
            res.status(401).json({
                message: `You must be the creator of the listing these pictures are for to edit them`,
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Pictures could not be found: ${err}`,
        })
    }

});

//?Unknown
//!Pictures Get All Endpoint
router.get('/all', async (req, res) => {
    //Get all pictures
    try{
        const Pictures = await models.Pictures.findAll();
        res.status(200).json(Pictures)
    } catch (err) {
        res.status(500).json({
            message: `Pictures could not be found: ${err}`,
        })
    }
});

//WORKING
//!Pictures Lookup Endpoint
router.get('/lookup/:id',  async (req, res) => {
    const listingId = req.params.id;
    //get specific pictures from db by listing id
    try {
        const query = {
            where: {
                listingId: listingId,
            }
        };
        const picturesReturned = await models.Pictures.findOne(query);
        res.status(200).json(picturesReturned);
    } catch (err) {
        res.status(500).json({
            message: `Pictures could not be found: ${err}`,
        })
    }
});

//WORKING
//!Pictures Edit Endpoint
router.put('/edit/:id', validateJWT, async (req, res) => {
    const { picture_one, picture_two, picture_three, picture_four, picture_five } = req.body.pictures;
    const listingId = req.params.id;
    const id = req.user.id;

    const query = {
        where: {
            listingId: listingId,
        }
    }

    const query_two = {
        where: {
            userId: id,
        }
    }

    //define editted pictures
    const updatedPictures = {
        picture_one: picture_one,
        picture_two: picture_two,
        picture_three: picture_three,
        picture_four: picture_four,
        picture_five: picture_five,
    }

    //check that user is owner of listing pictures are for
    try {
        const listingReturned = await models.Listing.findOne(query_two);
        if (id === listingReturned.userId) {
            //edit Pictures in db
            try {
                const update = await models.Pictures.update(updatedPictures, query);
                res.status(200).json(update);
            } catch (err) {
                res.status(500).json({ error: err });
            }
        } else {
            res.status(401).json({
                message: `You must be the creator of the listing these pictures are for to edit them`,
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Pictures could not be found: ${err}`,
        })
    }
});

//WORKING
//!Pictures Delete Endpoint
//*Admin Endpoint
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const listingId = req.params.id;
    const role = req.user.role;
    //delete pictures from db by listing id
    try {
        const query = {
            where: {
                listingId: listingId,
            }
        };
        if (role === 'Admin') {
            const result = await models.Pictures.destroy(query);
            res.status(200).json(result);
        } else {
            res.status(401).json({
                message: `You must be an administrator to delete pictures`,
            })
        }
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
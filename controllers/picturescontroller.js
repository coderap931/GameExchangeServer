const express = require("express");
const router = express.Router();
const {Pictures} = require("../models");

//!Pictures Create Endpoint
router.post("/create/:id", async (req, res) => {
    const {picture_one, picture_two, picture_three, picture_four, picture_five} = req.body.pictures;
    const listingId = req.params.id;
    
    //define new Pictures for Listing
    const picturesEntry = {
        listing_id: listingId,
        picture_one,
        picture_two,
        picture_three,
        picture_four,
        picture_five,
    }

    //add new Pictures to db
    try{
        const newPictures = await Pictures.create(picturesEntry);
        res.status(200).json(newPictures);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//!Pictures Lookup Endpoint
router.get('/lookup/:id', async (req, res) => {
    const listingId = req.params.id;
    //get specific pictures from db by listing id
    try{
        const query = {
            where: {
                listing_id: listingId,
            }
        };
        const picturesReturned = await Pictures.findOne(query);
        res.status(200).json(picturesReturned);
    } catch (err) {
        res.status(500).json({
            message: `Pictures could not be found: ${err}`,
        })
    }
});

//!Pictures Edit Endpoint
router.put('/edit/:id', async (req, res) => {
    const {picture_one, picture_two, picture_three, picture_four, picture_five} = req.body.pictures;
    const listingId = req.params.id;

    const query = {
        where: {
            listing_id: listingId,
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

    //update pictures
    try{
        const update = await Pictures.update(updatedPictures, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//!Pictures Delete Endpoint
//*Admin Endpoint
router.delete('/delete/:id', async (req, res) => {
    const listingId = req.params.id;
    const role = req.user.role;
    //delete pictures from db by listing id
    try{
        const query = {
            where: {
                listing_id: listingId,
            }
        };
        if (role === 'Admin'){
            const result = await Pictures.destroy(query);
            res.status(200).json(result);
        } else {
            res.status(401).json({
                message: `You must be an administrator to delete pictures`,
            })
        }

    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;
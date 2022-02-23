const express = require('express');
const router = express.Router();
let validateJWT = require('../middleware/validate-jwt');
const {models} = require('../models');

//WORKING
//!Listing Create Endpoint
router.post('/create', validateJWT, async (req, res) => {
    const {item_name, description, platform, newInBox, condition, price, pictureOne, pictureTwo, pictureThree} = req.body.listing;
    const id = req.user.id;

    //define new listing
    const listingEntry = {
        userId: id,
        sold: false,
        orderId: null,
        item_name,
        description,
        platform,
        newInBox,
        condition,
        price,
        pictureOne,
        pictureTwo,
        pictureThree
    }

    //add new listing to db
    try{
        const newListing = await models.Listing.create(listingEntry);
        res.status(200).json(newListing);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//WORKING
//!Listing Get All Endpoint
router.get('/all', async (req, res) => {
    //get all listings from db
    try{
        const Listings = await models.Listing.findAll();
        res.status(200).json(Listings)
    } catch (err) {
        res.status(500).json({
            message: `Listings could not be found: ${err}`,
        })
    }
}); 

//WORKING
//!Listing Get Users Endpoint
router.get('/yours', validateJWT, async (req, res) => {
    const id = req.user.id;
    //get all of users listings from db by userId
    try{
        const query = {
            where: {
                userId: id,
            }
        };
        const usersListings = await models.Listing.findAll(query);
        res.status(200).json(usersListings);
    } catch (err) {
        res.status(500).json({
            message: `Your Listings could not be found: ${err}`,
        })
    }
})

//WORKING
//!Listing Lookup Endpoint
router.get('/listinginfo/:id', async (req, res) => {
    const listingId = req.params.id;
    //get specific listing from db by id
    try{
        const query = {
            where: {
                id: listingId,
            }
        };
        const listingReturned = await models.Listing.findOne(query);
        res.status(200).json(listingReturned);
    } catch (err) {
        res.status(500).json({
            message: `Listing could not be found: ${err}`,
        })
    }
});

//WORKING
//!Listing Edit Endpoint
router.put('/edit/:id', validateJWT, async (req, res) => {
    const {orderId, sold, item_name, description, platform, newInBox, condition, price, pictureOne, pictureTwo, pictureThree} = req.body.listing;
    const listingId = req.params.id;
    const id = req.user.id;

    const query = {
        where: {
            id: listingId,
            userId: id,
        }
    }

    //define editted listing
    const updatedListing = {
        orderId: orderId,
        sold: sold,
        item_name: item_name,
        description: description,
        platform: platform,
        newInBox: newInBox,
        condition: condition,
        price: price,
        pictureOne: pictureOne,
        pictureTwo: pictureTwo,
        pictureThree: pictureThree
    }

    //update listing
    try{
        const update = await models.Listing.update(updatedListing, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//WORKING
//!Listing Delete Endpoint
//*Admin Endpoint
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const listingId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;

    //delete listing from db by id
    try{
        const query = {
            where: {
                id: listingId,
            }
        };
        const listingResult = await models.Listing.findOne(query);
        const sellerId = listingResult.userId;
        if (userId === sellerId || role === 'Admin'){
            const destroyResult = await models.Listing.destroy(query);
            
            res.status(200).json(destroyResult);
        } else {
            res.status(401).json({
                message: `You must be the seller or an administrator to delete this listing`,
            })
        }
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;
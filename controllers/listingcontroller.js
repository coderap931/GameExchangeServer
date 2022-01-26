const express = require('express');
const router = express.Router();
let validateJWT = require('../middleware/validate-jwt');
const {Listing} = require('../models');

//!Listing Create Endpoint
router.post('/create', validateJWT, async (req, res) => {
    const {sold, name, description, platform, new_used, condition, price, pictures} = req.body.listing;
    const id = req.user;

    //define new listing
    const listingEntry = {
        seller_id: id,
        sold,
        name,
        description,
        platform,
        new_used,
        condition,
        price,
        pictures,
    }

    //add new listing to db
    try{
        const newListing = await Listing.create(listingEntry);
        res.status(200).json(newListing);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//!Listing Get All Endpoint
router.get('/all', async (req, res) => {
    //get all listings from db
    try{
        const Listings = await Listing.findAll();
        res.status(200).json({
            listings: Listings,
            message: "Listings fetched",
        })
    } catch (err) {
        res.status(500).json({
            message: `Listings could not be found: ${err}`,
        })
    }
});

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
        const listingReturned = await Listing.findOne(query);
        res.status(200).json(listingReturned);
    } catch (err) {
        res.status(500).json({
            message: `Listing could not be found: ${err}`,
        })
    }
});

//!Listing Edit Endpoint
router.put('/edit/:id', validateJWT, async (req, res) => {
    const {sold, name, description, platform, new_used, condition, price, pictures} = req.body.listing;
    const listingId = req.params.listingId;
    const id = req.user;

    const query = {
        where: {
            id: listingId,
            seller_id: id,
        }
    }

    //define editted listing
    const updatedListing = {
        sold: sold,
        name: name,
        description: description,
        platform: platform,
        new_used: new_used,
        condition: condition,
        price: price,
        pictures: pictures,
    }

    //update listing
    try{
        const update = await Listing.update(updatedListing, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//!Listing Delete Endpoint
//*Admin endpoint
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const listingId = req.params.id;
    const id = req.user;

    //delete listing from db by id
    try{
        const query = {
            where: {
                id: listingId,
                seller_id: id,
            }
        };
        const result = await Listing.destroy(query);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;
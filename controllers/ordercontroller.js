const express = require('express');
const router = express.Router();
let validateJWT = require('../middleware/validate-jwt');
const {models} = require('../models');

//*SORTA WORKING
//!Order Create Endpoint
router.post('/create/:id', validateJWT, async (req, res) => {
    const {total_price, shipping_address} = req.body.order;
    const listingId = req.params.id;
    const buyerId = req.user.id;

    //define new Order for Listing
    const orderEntry = {
        listing_id: listingId,
        buyer_id: buyerId,
        total_price,
        date_time: new Date,
        shipping_address,
    }

    //add new Order to db
    try{
        const newOrder = await models.Order.create(orderEntry);
        res.status(200).json(newOrder);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//*SORTA WORKING
//!Order Get All by User Endpoint
router.get('/all', validateJWT, async (req, res) => {
    const id = req.user.id;
    //get all orders for user from db by userId
    try{
        const query = {
            where: {
                buyer_id: id,
            }
        }
        const Orders = await models.Order.findAll(query);
        res.status(200).json(Orders)
    } catch (err) {
        res.status(500).json({
            message: `Orders could not be found: ${err}`,
        })
    }
});

//*SORTA WORKING
//!Order Lookup Endpoint
//*Admin Endpoint
router.get('/orderinfo/:id', validateJWT, async (req, res) => {
    const id = req.user;
    const role = req.user.role;
    const orderId = req.params.id;
    //get specific order from db by id (if requesting user is buyer or seller or admin)
    try{
        const query = {
            where: {
                id: orderId,
            }
        };
        const orderReturned = await models.Order.findOne(query);
        const listingId = orderReturned.listing_id;
        const buyerId = orderReturned.buyer_id;
        const query_two = {
            where: {
                id: listingId,
            }
        };
        const listingReturned = await models.Listing.findOne(query_two);
        const sellerId = listingReturned.seller_id;
        if(id === buyerId || id === sellerId || role === 'Admin'){
            res.status(200).json(orderReturned);
        } else {
            res.status(401).json({
                message: `You must be the buyer or seller or administrator to view this order's details`,
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Order could not be found: ${err}`,
        })
    }
});

//?NOT WORKING
//!Order Delete Endpoint
//*Admin Endpoint
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const orderId = req.params.id;
    const role = req.user.role;
    //delete order from db by id and change listing.sold bool to false from true (if requesting user is admin)
    try{
        const query = {
            where: {
                id: orderId,
            }
        };
        if (role === 'Admin') {
            const result = await models.Order.findOne(query);
            const listingId = result.listing_id;
            const query_two = {
                where: {
                    id: listingId,
                }
            }
            const updatedListing = {
                sold: false,
                item_name,
                description,
                platform,
                new_used,
                condition,
                price,
                pictures,
            }
            const relistResult = await models.Listing.update(updatedListing, query_two);
            const destroyResult = await models.Order.destroy(query);
            res.status(200).json(relistResult, destroyResult);
        } else {
            res.status(401).json({
                message: `You must be an administrator to delete this order`,
            })
        }
    } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;
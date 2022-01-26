const express = require('express');
const router = express.Router();
let validateJWT = require('../middleware/validate-jwt');
const {Order, Order, Listing} = require('../models');

//!Order Create Endpoint
router.post('/create/:id', validateJWT, async (req, res) => {
    const {total_price, date_time, shipping_address} = req.body.order;
    const listingId = req.params.id;
    const buyerId = req.user;

    //define new Order for Listing
    const orderEntry = {
        listing_id: listingId,
        buyer_id: buyerId,
        total_price,
        date_time,
        shipping_address,
    }

    //add new Order to db
    try{
        const newOrder = await Order.create(orderEntry);
        res.status(200).json(newOrder);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

//!Order Get All by User Endpoint
//*Admin Endpoint
router.get('/all', validateJWT, async (req, res) => {
    const id = req.user;
    //get all orders for user from db by userId
    try{
        const query = {
            where: {
                buyer_id: id,
            }
        }
        const Orders = await Order.findAll(query);
        res.status(200).json(Orders)
    } catch (err) {
        res.status(500).json({
            message: `Orders could not be found: ${err}`,
        })
    }
});

//!Order Lookup Endpoint
//*Admin Endpoint
router.get('/orderinfo/:id', validateJWT, async (req, res) => {
    const id = req.user;
    const orderId = req.params.id;
    //get specific order from db by id (if user is buyer or seller)
    try{
        const query = {
            where: {
                id: orderId,
            }
        };
        const orderReturned = await Order.findOne(query);
        const listingId = orderReturned.listing_id;
        const buyerId = orderReturned.buyer_id;
        const query_two = {
            where: {
                id: listingId,
            }
        };
        const listingReturned = await Listing.findOne(query_two);
        const sellerId = listingReturned.seller_id;
        if(id === buyerId || id === sellerId){
            res.status(200).json(orderReturned);
        } else {
            res.status(401).json({
                message: `You must be the buyer or seller to view this order's details`,
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Order could not be found: ${err}`,
        })
    }
});

//!Order Delete Endpoint
//*Admin Endpoint
router.delete('/delete/:id', validateJWT, async (req, res) => {
    const orderId = req.params.id;
    const role = req.user.role;
    //delete order from db by id and change listing.sold bool to false from true (if user is admin)
    try{
        const query = {
            where: {
                id: orderId,
            }
        };
        if (role === 'Admin') {
            const result = await Order.findOne(query);
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
            const relistResult = await Listing.update(updatedListing, query_two);
            const destroyResult = await Order.destroy(query);
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
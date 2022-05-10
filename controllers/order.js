const Order = require('../models/Order')
const errorHandler = require('../middleware/errorHandler')
const mongoose = require("mongoose");
const Position = require("../models/Position");

//[GET] localhost/api/order?offset=2&limit=5
module.exports.getAll = async function(req, res){
    const query = {
        user: mongoose.Types.ObjectId(req.user.id)
    }

    //date check $gte - >=; $lte - <=
    if(req.query.start){
        query.date = { $gte: new Date(req.query.start) }
    }
    if(req.query.end){
        if(!query.date){
            query.date = {}
        }
        query.date['$lte'] = new Date(req.query.end)
    }

    if(req.query.number){
        query.number = +req.query.number
    }

    if(req.query.status){
        query.status = +req.query.status
    }

    if(req.query.client){
        query.client = mongoose.Types.ObjectId(req.query.client)
    }

    try {
        // const orders = await Order
        //     .findOne(query)
        //     .sort({date: -1})
        //     .skip(+req.query.offset)
        //     .limit(+req.query.limit)
        const orders = await Order
            .aggregate([
                {$match: query},
                {
                    $lookup: {
                        from: 'clients',
                        localField: 'client',
                        foreignField: '_id',
                        as: 'client_details',
                    }
                },
            ])
        res.status(200).json({
            success: true,
            //orders_count: orders,
            orders: orders
        })

    }catch(e){
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res){
    try {
        //const order = await Order.findOne({_id: req.params.id});
        const query = {
            user: mongoose.Types.ObjectId(req.user.id)
        }
        query._id = mongoose.Types.ObjectId(req.params.id)
        const order = await Order
            .aggregate([
                {$match: query},
                {
                    $lookup: {
                        from: 'clients',
                        localField: 'client',
                        foreignField: '_id',
                        as: 'client_details',
                    }
                },
            ])

        if (order) {
            res.status(200).json({
                success: true,
                order: order[0]
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Order not found!'
            })
        }
    }catch(e){
        errorHandler(res, e)
    }
}

module.exports.add = async function(req, res){
    try {
        const lastOrder = await Order
            .findOne({user: req.user.id})
            .sort({date: -1})

        const order = await new Order({
            list: req.body.list,
            payment: req.body.payment,
            client: req.body.client,
            user: req.user.id,
            status: req.body.status,
            detail: req.body.detail,
            number: ( lastOrder.number ? lastOrder.number : 0 ) + 1
        }).save()
        res.status(200).json({
            success: true,
            order: order
        })
    }catch(e){
        errorHandler(res, e)
    }
}

module.exports.update = async function(req, res){
    try {
        let params = {$set: req.body}

        if(!req.body.payment){
            params.payment =  []
        }
        if(!req.body.list){
            params.list =  []
        }

        params.user = req.user.id
        let updOrder = await Order.findOneAndUpdate(
            {_id: req.params.id},
            params,
            {new: true}
        )
        res.status(200).json({
            success: true,
            order: updOrder
        })
    }catch(e){
        errorHandler(res, e)
    }
}
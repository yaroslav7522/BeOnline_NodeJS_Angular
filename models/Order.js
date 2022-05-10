const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    number: {
        type: Number
    },
    status: {
        type: Number
    },
    detail: {
        type: String
    },
    client: {
        ref: 'clients',
        type: Schema.Types.ObjectId
    },
    list:[
        {
            id: {type: String},
            name: {type: String},
            quantity:{type: Number},
            cost:{type: Number},
            total:{type: Number},
        }
    ],
    payment:[
        {
            type: {type: Number},
            total: {type: Number},
        }
    ],
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('orders', orderSchema)

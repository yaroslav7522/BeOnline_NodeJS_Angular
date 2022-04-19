const mongoose = require('mongoose')
const Schema = mongoose.Schema

const positionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: ''
    },
    cost: {
        type: Number
    },
    barcode: {
        type: String
    },
    category: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('positions', positionSchema)
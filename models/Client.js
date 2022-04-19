const mongoose = require('mongoose')
const Schema = mongoose.Schema

const clientsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    barcode: {
        type: String
    },
    bdate: {
        type: Date
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('clients', clientsSchema)
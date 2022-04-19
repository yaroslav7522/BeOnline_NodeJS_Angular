const Client = require('../models/Client')
const errorHandler = require('../middleware/errorHandler')

module.exports.getById = async function(req, res){
    try {
        const client = await Client.findOne({_id: req.params.id});
        if (client) {
            res.status(200).json({
                success: true,
                client: client
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Client not found!'
            })
        }
    }catch(e){
        errorHandler(res, e)
    }
}

module.exports.getAll = async function(req, res){

    const Clients = await Client.find()
    if(Clients) {
        res.status(200).json({
            success: true,
            clients: Clients
        })
    }else{
        res.status(404).json({success:false, message: 'Clients not found!'})
    }
}

module.exports.add = async function(req, res){
    const NewClient = new Client({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        barcode: req.body.barcode,
        bdate: req.body.bdate,
        user: req.user.id
    })
    try {
        await NewClient.save()
        res.status(201).json({success:true, client: NewClient})
    }catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function(req, res){
    try {
        let updClient = await Client.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
        )
        res.status(200).json({
            success:true,
            client: updClient
        })
    }catch (e){
        errorHandler(res, e)
    }
}

module.exports.remove = async function(req, res){
    try {
        await Client.remove({_id: req.params.id})
        res.status(200).json({
            success: true,
            message: 'Client removed!'
        })
    }catch (e){
        errorHandler(res, e)
    }
}
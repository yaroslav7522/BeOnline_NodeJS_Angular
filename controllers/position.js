const Position = require('../models/Position')
const Category = require('../models/Category')
const errorHandler = require('../middleware/errorHandler')
const fs = require("fs");

module.exports.getAll = async function(req, res) {
    try {
        const positions = await Position.find({user: req.user.id})
        if(positions) {
            res.status(200).json({
                success: true,
                positions: positions
            })
        }else{
            res.status(404).json({success:false, message: 'Positions not found!'})
        }
    }catch(e){
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res){
    try {
        const position = await Position.findOne({_id: req.params.id});
        if (position) {
            res.status(200).json({
                success: true,
                position: position
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Position not found!'
            })
        }
    }catch(e){
        errorHandler(res, e)
    }
}

module.exports.getByCategory = async function(req, res){
    if(!req.params.id || req.params.id === 'null'){
        catID = null
    }else{
        catID = req.params.id
    }

    try {
        const positions = await Position.find({category: catID})
        if(positions) {
            res.status(200).json({
                success: true,
                positions: positions
            })
        }else{
            res.status(404).json({success:false, message: 'Positions not found!'})
        }
    }catch(e){
        errorHandler(res, e)
    }
}

module.exports.add = async function(req, res){
    var fCategory  = ''
    if(req.body.category){
        fCategory = await Category.findOne({_id: req.body.category})
    }
    if(!req.body.category || fCategory) {
        const NewPosition = new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            imageSrc: req.file ? req.file.path : '',
            user: req.user.id
        })
        try {
            await NewPosition.save()
            res.status(201).json({success:true, position: NewPosition})
        }catch (e) {
            errorHandler(res, e)
        }
    }else{
        res.status(404).json({success:false, message: 'Category not found!'})
    }
}

module.exports.update = async function(req, res){
    try {
        let params = {$set: req.body}
        const currentPos = await Position.findById(req.params.id)
        if(req.file){
            if(currentPos.imageSrc && currentPos.imageSrc !== req.file.path && fs.existsSync('./' + currentPos.imageSrc)){
                fs.unlinkSync('./' + currentPos.imageSrc)
            }
            params.imageSrc = req.file.path
        }
        params.user = req.user.id
        let updPosition = await Position.findOneAndUpdate(
            {_id: req.params.id},
            params,
            {new: true}
        )
        res.status(200).json({
            success:true,
            position: updPosition
        })
    }catch (e){
        errorHandler(res, e)
    }
}

module.exports.remove = async function(req, res){
    try {
        await Position.remove({_id: req.params.id})
        res.status(200).json({
            success: true,
            message: 'Position removed!'
        })
    }catch (e){
        errorHandler(res, e)
    }
}
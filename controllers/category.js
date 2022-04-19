const Category = require('../models/Category')
const Position = require('../models/Position')
const fs = require('fs')
const errorHandler = require("../middleware/errorHandler");


module.exports.getAll = async function(req, res){
    let categories = await Category.find({user: req.user.id, parent: req.query.parentId ? req.query.parentId:null})
    if(categories){
        res.status(200).json({
            success:true,
            categories: categories
        })
    }else {
        res.status(404).json({
            success: false,
            message: "Categories not found!"
        })
    }

}

module.exports.getById = async function(req, res){
    let fCategory = await Category.findById(req.params.id)
    if(fCategory){
        res.status(200).json({
            success:true,
            category: fCategory
        })
    }else{
        res.status(404).json({
            success: false,
            message: 'Category nod found!'
        })
    }
}

module.exports.remove = async function(req, res){
    try {
        const curentCat = await Category.findById(req.params.id)
        if(curentCat) {
            if(curentCat.imageSrc){
                fs.unlinkSync('./' + curentCat.imageSrc)
            }
            await Category.remove({_id: req.params.id})
            await Position.remove({category: req.params.id})
            res.status(200).json({
                success: true,
                message: 'Category removed!'
            })
        }else{
            res.status(404).json({success:false, message: 'Category not found!'})
        }
    }catch (e){
        errorHandler(res, e)
    }
}

module.exports.add = async function(req, res){
    let NewCategory = new Category({
        name: req.body.name,
        imageSrc: req.file ? req.file.path : '',
        parent: req.body.parent,
        user: req.user.id
    })
    try {
        await NewCategory.save()
        res.status(201).json({success:true, category: NewCategory})
    }catch (e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function(req, res){
    try {
        let params = {$set: req.body}
        const currentCat = await Category.findById(req.params.id)
        if(req.file){
            if(currentCat.imageSrc && currentCat.imageSrc !== req.file.path && fs.existsSync('./' + currentCat.imageSrc)){
                fs.unlinkSync('./' + currentCat.imageSrc)
            }
            params.imageSrc = req.file.path
        }
        if(currentCat.parent && !req.body.parent){
            await Category.updateOne({_id: req.params.id}, {$unset: {parent:""}})
        }
        let updCategory = await Category.findOneAndUpdate(
            {_id: req.params.id},
            params,
            {new: true}
        )
        res.status(200).json({
            success:true,
            category: updCategory
        })
    }catch (e){
        errorHandler(res, e)
    }

}

//-------------------------------------------------------------------
async function getGategories(parentId, userId, level = 0){
    let categoriesCollection = []
    let categories = await Category.find({user: userId, parent: parentId ? parentId:null})
    for (const element of categories) {
        //element._doc.childs = await getGategories(element._doc._id.toString(), userId)
        categoriesCollection.push(element)
        if(element._doc.level === undefined){
            element._doc.level = level
            childCat = await getGategories(element._doc._id.toString(), userId, (level+1))
            for (const cElement of childCat) {
                //categories.push(cElement)
                categoriesCollection.push(cElement)
            }
        }
    }
    return categoriesCollection
}
//---------------------------------------------------------------------
module.exports.getTree = async function(req, res){
    let tree = await getGategories('', req.user.id)
    res.status(200).json({
        success:true,
        categories: tree
    })
}
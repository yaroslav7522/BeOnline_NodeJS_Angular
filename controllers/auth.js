const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const errorHandler = require('../middleware/errorHandler')

module.exports.login = async function(req, res){
    const existUser = await User.findOne({email: req.body.email})
    if(existUser){
        const passwordResult = bcrypt.compareSync(req.body.password, existUser.password)
        if(passwordResult){
            //token generation
            const token = jwt.sign({
                email: existUser.email,
                userId: existUser._id
            }, keys.jwt, {expiresIn: 3600 * 24})//1hr expires / 1day

            res.status(200).json({success:true, token: `Bearer ${token}`})
        }else{
            res.status(401).json({success:false, message: "Incorrect password!"})
        }
    }else{
        res.status(404).json({success:false, message: "User not found!"})
    }
}

module.exports.register = async function(req, res){
    //email password
    const existUser = await User.findOne({email: req.body.email})

    if(existUser){
        //user already exist
        res.status(409).json({success:false, message: 'User already exists!'})
    }else{
        // create new user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync( password, salt),
            name: req.body.name,
        })
        
        //user.save().then(()=> res.status(201).json({success:false, message: 'User created!'}))
        try {
            await user.save()
            res.status(201).json({success:true, user: user})
        }catch (e) {
            //res.status(400).json({success:false, message: 'Error: ' + e.message})
            errorHandler(res, e)
        }
    }
}
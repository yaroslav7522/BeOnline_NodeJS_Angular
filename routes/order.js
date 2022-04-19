const express = require('express')
const controller = require('../controllers/order')
const passport = require("passport");
const upload = require("../middleware/upload");
const router = express.Router()

router.get('/',     passport.authenticate('jwt', {session:false}), controller.getAll)
router.post('/',    passport.authenticate('jwt', {session:false}), upload.single(''), controller.add)
router.patch('/:id',passport.authenticate('jwt', {session:false}), upload.single(''), controller.update)
router.get('/:id',  passport.authenticate('jwt', {session:false}), controller.getById)

module.exports = router
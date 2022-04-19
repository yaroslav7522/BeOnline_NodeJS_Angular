const express = require('express')
const passport = require('passport');
const controller = require('../controllers/position')
const upload = require('../middleware/upload');
const router = express.Router()

router.get('/',             passport.authenticate('jwt', {session:false}), controller.getAll)
router.get('/:id',          passport.authenticate('jwt', {session:false}), controller.getById)
router.get('/category/:id', passport.authenticate('jwt', {session:false}), controller.getByCategory)
router.post('/',            passport.authenticate('jwt', {session:false}), upload.single('image'), controller.add)
router.patch('/:id',        passport.authenticate('jwt', {session:false}), upload.single('image'), controller.update)
router.delete('/:id',       passport.authenticate('jwt', {session:false}), controller.remove)

module.exports = router
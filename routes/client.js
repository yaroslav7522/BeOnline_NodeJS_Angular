const express = require('express')
const passport = require('passport');
const controller = require('../controllers/client')
const upload = require('../middleware/upload');
const router = express.Router()

router.get('/:id',          passport.authenticate('jwt', {session:false}), controller.getById)
router.get('/',             passport.authenticate('jwt', {session:false}), controller.getAll)
router.post('/',            passport.authenticate('jwt', {session:false}), upload.single(), controller.add)
router.patch('/:id',        passport.authenticate('jwt', {session:false}), upload.single(), controller.update)
router.delete('/:id',       passport.authenticate('jwt', {session:false}), controller.remove)

module.exports = router
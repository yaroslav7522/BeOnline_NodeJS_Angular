const express  = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const passport = require('passport')

const app = express()
mongoose.connect(keys.mongoUrl)
    .then(()=>{ console.log('Database connected!')})
    .catch(error => console.log("Connected error: " + error))

const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')

const angular = require('./routes/client')

app.use(cors())
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use('/api/auth', authRoutes)
app.use('/api/report', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)
app.use('/api/client', clientRoutes)

module.exports = app
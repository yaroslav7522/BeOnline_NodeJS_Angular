const app = require('./app')
const port = 8080 //process.env.PORT || 


app.listen(port, () => { console.log('Server has been started at port ' + port + '!'); })
const app = require('./app')
const port = process.env.PORT || 5000

app.use(sendSpaFileIfUnmatched);
function sendSpaFileIfUnmatched(req, res){
    res.sendFile("/client/dist/client/index.html", { root: '.' });
}



app.listen(port, () => { console.log('Server has been started at port ' + port + '!'); })
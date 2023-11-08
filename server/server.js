const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app)

app.use(cors({
    orient: 'http://localhost:3000/'
}));

app.get('/api', async  (req, res) => {
    res.send({message: 'hello world'});
})

app.listen(8080, () =>{
    console.log('server running on 8080')
})
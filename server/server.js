const express = require('express');
const app = express();
const cors = require('cors');
const {pool} = require("./lib/dbconfig");
const bodyParser = require('body-parser')
const Timer = require("./lib/Timer");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    orient: ['http://localhost:3000/', '211.197.178.97']
}));
app.get('/api', async  (req, res) => {
    res.send({message: 'hello world'});
})
app.post('/api/signup',async (req, res) => {
    const body = req.body
    pool.query(`insert into user(id, name, password) values('${body.id}', '${body.name}', '${body.password}')`)
        .then(() => {
            res.send({status : 200})
        }).catch((err) => {console.log(err)})
    console.log(`다음 쿼리가 실행되었습니다.\n insert into user values('${body.id}', '${body.name}', '${body.password}')`)
})
app.post('/api/login',async (req, res) => {
    const body = req.body
    pool.query(`select id, name from user where name='${body.name}' and password='${body.password}'`)
        .then(([rows]) => {
            res.send(rows)
            console.log(rows)
        }).catch((err) => {console.log(err)})
    console.log(Timer.getCurrentTimeString(),`다음 쿼리가 실행되었습니다.\n select id, name from user where name='${body.name}' and password='${body.password}'`)
})

app.listen(8080, (e) => {
    console.log('server running on 8080')
})
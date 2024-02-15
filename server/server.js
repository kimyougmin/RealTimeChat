const express = require('express');
const app = express();
const cors = require('cors');
const { pool } = require("./lib/dbconfig");
const bodyParser = require('body-parser');
const Timer = require("./lib/Timer");
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});
const { v4 } = require('uuid');
const { header } = require("request/lib/hawk");
// const connection = await  pool.getConnection(async  (conn) => conn);

let msgV4 = v4()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    orient: ['http://localhost:3000/', '211.197.178.97']
}))
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
    console.log(Timer.getCurrentTimeString(),`다음 쿼리가 실행되었습니다.\nselect id, name from user where name='${body.name}' and password='${body.password}'`)
})
app.post('/api/follow', async  (req, res) => {
    const body = req.body
    pool.query(`select id, name from user where id='${body.uuid}'`)
        .then(([rows]) => {
            res.send(rows)
        }).catch((err) => {console.log(err)})
    console.log(Timer.getCurrentTimeString(),`다음 쿼리가 실행되었습니다.\nselect id, name from user where id='${body.uuid}'`)
})
app.post('/api/addHeader', async (req, res) => {
    const body = req.body
    pool.query(`insert into header(id, from_id, to_id, subject, status) values('${v4()}', '${body.uuid}', '${body.userUuid}', '.', '${body.uuid}')`)
})
app.post('/api/send', async  (req, res) => {
    const body = req.body
    pool.query(`insert into message(id, header_id, is_from_sender, content, read_status) values('${msgV4}', '${body.roomUuid}', '${body.uuid}','${body.message}', ${1})`)
    console.log('다음 퀴리 실행',`update header set subject='${body.message}', status='${body.uuid}' where id='$body.roomUuid}'`)
    pool.query(`update header set subject='${body.message}', status='${body.uuid}' where id='${body.roomUuid}'`)
        .then(async ([rows]) => {
            await console.log('rows data => ', rows)
            res.send('ok');
        }).catch((e) => {
        console.log('error => ',e)
    })
})
app.post('/api/charRoom', async (req, res) => {
    const body = req.body;
    console.log(body)
    pool.query(`select h.id, from_id, to_id, subject, update_time, (select name from user where user.id = to_id) name from header h where from_id='${body.uuid}' union select h.id, from_id, to_id, subject, update_time, (select name from user where user.id = from_id) from header h where to_id='${body.uuid}' order by update_time desc`)
        .then(async ([rows]) => {
            const body = await rows
            console.log(body)
            res.send(body)
        })
})
app.post('/api/readMessage', async (req, res) => {
    const body = req.body
    console.log(body)
    pool.query(`update message m set read_status = 0 where m.header_id = '${body.roomUuid}'`)
        .then(() => {
            res.send('ok')
        })
})
app.post('/api/selectChat', async  (req, res) => {
    const body = req.body;
    console.log('selectChat body = ',body)
    pool.query(`select id, content, is_from_sender as isFromSender, read_status as readStatus, time from message where header_id='${body.roomUuid}' order by time`)
        .then(async ([rows]) => {
            await res.send(rows)
            console.log('message return', rows)
        }).catch((e) => {
            console.log('안 쪽',e)
        })
})
app.post('/api/countStatus', async (req, res) => {
    const body = req.body;
    console.log('countStatus body',body)
    pool.query(`select count(read_status) as countStatus from message where header_id='${body.roomUuid}' and read_status=1`)
        .then(async ([row]) => {
            console.log('countStatus row',row)
            await res.send(row)
        })
})
server.listen(8080, (e) => {
    console.log('server running on 8080')
})
io.on('connection', function(socket) {
    // Listen for test and disconnect events
    console.log('connected!')
    socket.on('msgSend', (data) => {
        msgV4 = v4();
        console.log('메시지 수신완료', data)
        const newData = {
            id: msgV4,
            receiveUuid: data.userUuid,
            transmit: data.uuid,
            content: data.message,
            isFromSender: data.uuid,
            readStatus: 1,
            time: data.createdAt
        }
        socket.broadcast.emit('msgBroadcast', newData)

    })
    socket.on('connect', (data) => {
        console.log(data)
    })
    socket.on('disconnect', () => {
        console.log('disconnected from ', socket.id);
    });
});
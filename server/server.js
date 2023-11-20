const express = require('express');
const app = express();
const cors = require('cors');
const {pool} = require("./lib/dbconfig");
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
const {header} = require("request/lib/hawk");
// const connection = await  pool.getConnection(async  (conn) => conn);

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
app.post('/api/send', async  (req, res) => {
    const body = req.body
    let is_from_sender = 0

    pool.query(`select * from header where (from_id='${body.uuid}' and to_id='${body.userUuid}') or (to_id='${body.uuid}' and from_id='${body.userUuid}')`)
        .then(async ([rows]) => {
            console.log('rows values=',rows)
            if (rows[0].id === undefined) { // 첫 메세지 전송 시
                console.log('처음 대화하는 상대방 쿼리가 실행 됨', `insert into header(id, from_id, to_id, subject, status) values('${v4()}', '${body.uuid}', '${body.userUuid}', '${body.message}', '${body.uuid}')\n`);
                pool.query(`insert into header(id, from_id, to_id, subject, status) values('${v4()}', '${body.uuid}', '${body.userUuid}', '${body.message}', '${body.uuid}')`)
                    .then(async () => {
                        await pool.query(`select id, from_id from header where from_id='${body.uuid}' and to_id='${body.userUuid}'`)
                            .then(async ([rows]) => {
                                console.log('마지막 쿼리 실행', `insert into message(id, header_id, is_from_sender, content, read) values('${v4()}', '${rows[0].id}', ${body.from_id}, '${body.message}', ${1})`);
                                await pool.query(`insert into message(id, header_id, is_from_sender, content, read_status) values('${v4()}', '${rows[0].id}', ${1}, '${body.message}', ${1})`);
                                res.send('ok');
                            }).catch((e) => {
                            console.log('error =>',e)
                        })
                    });
            } else { // 첫 메시지가 아닐 때
                rows[0].from_id === body.uuid ? is_from_sender = body.uuid : body.userUuid
                console.log('대화 중인 상대방 다음 쿼리 실행',`insert into message(id, header_id, is_from_sender, content, read_status) values('${v4()}', '${rows[0].id}', '${is_from_sender}','${body.message}', ${1})`)
                pool.query(`insert into message(id, header_id, is_from_sender, content, read_status) values('${v4()}', '${rows[0].id}', '${is_from_sender}','${body.message}', ${1})`)
                console.log('다음 퀴리 실행',`update header set subject='${body.message}', status='${body.uuid}' where id='${rows[0].id}'`)
                pool.query(`update header set subject='${body.message}', status='${body.uuid}' where id='${rows[0].id}'`)
                    .then(async ([rows]) => {
                        await console.log('rows data => ', rows)
                        res.send('ok');
                    }).catch((e) => {
                        console.log('error => ',e)
                    })
            }
            // try {
            //     await connection.beginTransaction();
            //     pool.query('insert into message values()')
            //     await connection.commit();
            // } catch (e) {
            //     await connection.rollback();
            // }
        })
})
// app.post('/api/selectChat', async  (req, res) => {
//     const body = req.body;
//     console.log(body)
//     pool.query(`select * from header where (from_id='${body.id}' and to_id='${body.userUuid}') or (to_id='${body.id}' and from_id='${body.userUuid}')`)
//         .then(async ([rows]) => {
//             console.log('헤더의 반환값', rows)
//             await pool.query(`select * from message where read_status=${1} and header_id='${rows[0].id}' order by time`)
//                 .then(async ([rows]) => {
//                     await res.send(rows)
//                     console.log('message return',rows)
//                 }).catch((e) => {
//                     console.log('안 쪽',e)
//                 })
//         }).catch((e) => {
//             console.log(e)
//         })
// })

server.listen(8080, (e) => {
    console.log('server running on 8080')
})
io.on('connection', function(socket) {
    // Listen for test and disconnect events
    console.log('connected!')
    socket.on('test' , (data) => {
        console.log('chatRoomMember id', data)
        pool.query(`select * from message, (select id from header where (from_id='${data.uuid}' and to_id='${data.userUuid}') or (to_id='${data.uuid}' and from_id='${data.userUuid}')) as header where header_id = header.id order by time`)
            .then(async ([rows]) => {
                const data = await rows
                setTimeout(() => {
                    socket.emit('selectData', data)
                }, 1000)
            }).catch((e) => {
            console.log('조회 오류',e)
        })
    })
    // socket.on('connect', (data) => {
    //     console.log('received: "' + data + '" from client' + socket.id);
    //     socket.emit('test', "Ok, i got it, " + socket.id);
    // });

    socket.on('disconnect', () => {
        console.log('disconnected from ', socket.id);
    });
});
const express = require('express');
const cors = require('cors');

const proxyApi = require('./routes/proxy-api');
const api = require('./routes/api');

const server = express();

const host = process.env.HOST || '0.0.0.0';
let port = process.env.PORT || 3000;

const allowedDomain =
    process.env.WHITE_DOMAIN ?
        process.env.WHITE_DOMAIN.split(',') : ['god-calculator.com'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedDomain.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

server.use(cors(corsOptions));
server.use('/proxy', proxyApi);
server.use('/api', api);

function startServer(host, port) {
    console.log('허용 도메인 : ', allowedDomain)
    server.listen(port, host, () => {
        console.log(`서버가 ${host}:${port} 에서 실행 중`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log('이미 사용 중인 포트입니다. 다른 포트에서 서버를 시작합니다.');
            startServer(host, ++port);
        }
    });
}

startServer(host, port);
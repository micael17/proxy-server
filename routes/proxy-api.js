const express = require('express');
const https = require('https');
const router = express.Router();

router.get('/shortUrl', (req, res) => {
    const { url, api } = req.query;

    if (!url || !api) {
        return res.status(400).send('url과 api 쿼리 파라미터가 필요합니다.');
    }

    const options = {
        headers: {
            'Content-Type': 'application/json',
            'X-Naver-Client-Id': 'zGSqm9ZT8a6IngXswpbt',
            'X-Naver-Client-Secret': 'vo3G6oeWK8'
        }
    };

    https.get(`${api}?url=${url}`, options, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {
            res.send(JSON.parse(data));
        });

    }).on("error", (err) => {
        res.status(500).send('서버에서 에러가 발생했습니다.');
    });
});

module.exports = router;
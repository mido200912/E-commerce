const https = require('https');

const options = {
    hostname: 'rahhalah-back.vercel.app',
    port: 443,
    path: '/api/products',
    method: 'GET',
    headers: {
        'Origin': 'https://different.vercel.app',
    }
};

const req = https.request(options, (res) => {
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', res.headers);
});

req.on('error', (e) => {
    console.error(e);
});
req.end();

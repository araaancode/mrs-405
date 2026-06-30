const https = require('https');

const data = JSON.stringify({
    'to': '09383901146'
});

const options = {
    hostname: 'console.melipayamak.com',
    port: 443,
    path: '/api/send/otp/2783a430de89451a8499166485b11b68',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    console.log('statusCode: ' + res.statusCode);

    res.on('data', d => {
        process.stdout.write(d)
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
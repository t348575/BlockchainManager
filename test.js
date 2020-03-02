const net = require('net');
const fs = require('fs');
const child_process = require('child_process');
const http = require('http');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'kanichai', SECRET_KEY_HASH = bcrypt.hashSync(SECRET_KEY, 8);
const client = net.createConnection({ host: '192.168.43.177', port: '19236' }, () => {
    client.write(JSON.stringify({ request: 'addBlock', inData: 'four', difficulty: 2, prev_hash: 'de04d58dc5ccc4b9671c3627fb8d626fe4a15810bc1fe3e724feea761965fb71', key: SECRET_KEY_HASH}), () => {
        setTimeout(() => client.end(), 5000);
        client.on('data', (data) => {
            console.log(data.toString());
        })
    });
});

const app = require('../app');
/**
 * http访问
 */
// const http = require('http');
// const server = http.createServer(app);
// server.listen(3000);

/**
 * https访问
 */
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./https/4329058_www.tserch.xyz.key'),
  cert: fs.readFileSync('./https/4329058_www.tserch.xyz.pem')
};

const server = https.createServer(options, app);
server.listen(3000);
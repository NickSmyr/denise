// 'use strict';

// let spdy = require('spdy'),fs = require('fs');

// let options = {
//   key: fs.readFileSync(__dirname + '/keys/server.key'),
//   cert: fs.readFileSync(__dirname + '/keys/server.crt')
// };


const path = require("path");
const express = require("express");
const app = express(); // create express app


app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// var server = spdy.createServer(options, function(req, res) {
//   var stream = res.push('/main.js', {
//     status: 200, // optional
//     method: 'GET', // optional
//     request: {
//       accept: '*/*'
//     },
//     response: {
//       'content-type': 'application/javascript'
//     }
//   });
//   stream.on('error', function() {
//     console.log("Stream error")
//   });
//   stream.end('alert("hello from push stream!");');

//   res.end('<script src="/main.js"></script>');
// });
// server.listen(443);

// start express server on port 80
app.listen(30, () => {
  console.log("server started on port 80");
});
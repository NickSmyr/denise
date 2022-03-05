const path = require("path");
const express = require("express");
const app = express(); // create express app
const config = require('./config.js')


// Connect to Cloud SQL database
const createUnixSocketPool = async config => {
  const dbSocketPath = config.DB_SOCKET_PATH || '/cloudsql';

  // Establish a connection to the database
  return mysql.createPool({
    user: config.DB_USER, // e.g. 'my-db-user'
    password: config.DB_PASS, // e.g. 'my-db-password'
    database: config.DB_NAME, // e.g. 'my-database'
    // If connecting via unix domain socket, specify the path
    // socketPath: `${dbSocketPath}/${config.INSTANCE_CONNECTION_NAME}`,
    // Specify additional properties here.
    //...config,
  });
}; 



app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/version", (req, res) => {
  console.log("Version hit")
  res.send(config.version)
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
app.listen(80, () => {
  console.log("server started on port 80");
});
const path = require("path");
const express = require("express");
const app = express(); // create express app
const config = require('./config.js')




// Connect to  PSQL database
const { Client } = require('pg')
const client = new Client({
  user: config.DB_USER,
  host: config.DB_HOSTNAME,
  database: config.DB_NAME,
  password: config.DB_PASS,
  port: 5432,
})
client.connect(function(err) {
  if (err) {
    console.log("Could not connect to database")
  }
  console.log("Connected!");
});

// 
client
  .query('SELECT * from hits')
  .then(res => console.log(res.rows))
  .catch(e => console.error(e.stack))


function logIpAndDate(ip, date){
  const query = 'INSERT INTO hits(ip, date) VALUES($1, $2) RETURNING *'
  const values = [ip, date]
  // promise
  client
    .query(query, values)
    .then(res => {
      console.log("Inserted rows: ")
      console.log(res.rows)
    })
    .catch(e => console.error("Error encountered while logging ip and date " + e.stack))
}

app.get("/", (req, res) => {
  console.log("Request from ip " + req.socket.remoteAddress)
  var datetime = new Date();
  console.log("Current date ", datetime)
  console.log("Logging ip and date")
  logIpAndDate(req.socket.remoteAddress, datetime)
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static('public'))



app.get("/version", (req, res) => {
  console.log("Version hit")
  res.send(config.version)
});


// start express server on port 80
app.listen(80, () => {
  console.log("server started on port 80");
});
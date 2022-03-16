const path = require("path");
const express = require("express");
const app = express(); // create express app
const config = require('./config.js')
const axios = require('axios')




// Connect to  PSQL database
const { Client } = require('pg');
const { DB_HOSTNAME, DJANGO_HOSTNAME } = require("./config.js");
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
  logIpAndDate(req.socket.remoteAddress, datetime)
  res.sendFile(path.join(__dirname, "public","dist", "index.html"));
});

app.use(express.static('public/dist'))



app.get("/version", (req, res) => {
  console.log("Version hit")
  res.send(config.version)
});

app.get("/names", (req, res) => {
  console.log("Names hit")
  res.setHeader('content-type', 'application/json');
  res.send(JSON.stringify({
    'db_hostname' : DB_HOSTNAME,
    'django_hostname' : DJANGO_HOSTNAME 
  }))
})

app.use(express.json())

// Endpoints that are forwarded to the django backend

app.post("/initiateInteraction", (req,res) =>{
  session_id = req.body.session_id
  remote_ip = req.socket.remoteAddress
  data = {
    "session_id" : session_id,
    "remote_ip" : remote_ip
  }
  const headers = {
    'Content-Type': 'application/json',
  }
  console.log("Executing axios post")
  console.log("Sending data ", data)
  axios.post(`http://${config.DJANGO_HOSTNAME}/chat/init`, data, {
      headers: headers
    })
    .then((response) => {
      console.log("Django status ", response.status)
      if (response.status != 200){
        throw new Error('Django backend got error while initializing interaction')
      }
      else{
        // Successful execution
        res.status(200)
        res.send()
      }
    })
    .catch((error) => {
      res.status(500)
      res.send("Failed to connect to django backend")
    })
});

app.post("/advanceInteraction", (req,res) =>{
  data = {
    "session_id" : req.body.session_id,
    "message" : req.body.message
  }
  const headers = {
    'Content-Type': 'application/json',
  }
  console.log("Executing axios post")
  console.log("Sending data ", data)
  axios.post(`http://${config.DJANGO_HOSTNAME}/chat/advance`, data, {
      headers: headers
    })
    .then((response) => {
      console.log("Django status ", response.status)
      if (response.status != 200){
        throw new Error('Django backend got error while initializing interaction')
      }
      else{
        // Successful execution
        console.log("Denise rsponse ", JSON.stringify(response.data))
        res.status(200)
        res.send(JSON.stringify(response.data))
      }
    })
    .catch((error) => {
      res.status(500)
      res.send("Failed to connect to django backend")
    })
});

app.post("/keepAlive", (req,res) =>{
  data = {
    "session_id" : req.body.session_id,
  }
  const headers = {
    'Content-Type': 'application/json',
  }
  console.log("Executing axios post on keepAlive")
  console.log("Sending data ", data)
  axios.post(`http://${config.DJANGO_HOSTNAME}/chat/keepalive`, data, {
      headers: headers
    })
    .then((response) => {
      console.log("Django status ", response.status)
      if (response.status != 200){
        throw new Error('Django backend got error while initializing interaction')
      }
      else{
        // Successful execution
        res.status(200)
        res.send()
      }
    })
    .catch((error) => {
      res.status(500)
      res.send("Failed to connect to django backend")
    })
});


if (config.DEV){
  port = 3000
}
else {
  port = 80
}
// start express server on port 3000
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

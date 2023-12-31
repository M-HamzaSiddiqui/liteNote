const connectToMongo = require('./db');
const express = require('express')
const mongoose = require('mongoose');
const user = require('./models/User');
const cors = require('cors');


connectToMongo();
const app = express()
const port = 5000


app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`litenote app listening on port http://localhost:${port}`)
})






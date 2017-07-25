////////////////////////////////////////////////
//
// Copyright (c) 2017 Matheus Medeiros Sarmento
//
////////////////////////////////////////////////

const express = require('express');
const handler = require('./controllers/handler');
const dispatcher = require('./servers/dispatcher/dispatcher');
const db_driver = require('./database/db_driver')

const app = express();

app.use(express.static(__dirname + '/public'));

// Setup Engine
app.set('view engine', 'ejs');

// Setup Database Driver
db_driver();

// Initialize dispatcher
dispatcher();

// Call handler
handler(app);

// Listen requests
app.listen(8080);
/* STARTING POINT OF APPLICATION */
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// DATABASE SETUP
mongoose.connect('mongodb://localhost:auth/auth');

// APP SETUP

// Middleware Registration
// Logging Framework
app.use(morgan('combined'));
// Handle CORS
app.use(cors());
// Parse JSON Requests
app.use(bodyParser.json({ type: '*/*' }));
// Router
router(app);

// SERVER SETUP
const PORT = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(PORT);
console.log(`Application launched on port: ${PORT}.`);

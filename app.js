const express = require('express');

const app = express();

const router = require('./routes/index'); 

const errorHandler = require('./middleware/errorHandler'); 

const { PORT } = require('./data/constants'); 

app.use(router);

app.use(errorHandler);

app.listen(PORT);

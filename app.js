const express = require('express');

const app = express();

const rootRoute = require('./routes/index'); 
const swaggerSetup = require('./routes/api-docs'); 
const serverStatusRoute = require('./routes/serverStatus');
const coursesRoutes = require('./routes/courses'); 
const errorRoute = require('./routes/error'); 

const errorHandler = require('./utils/errorHandler'); 

const { PORT } = require('./utils/constants'); 

app.use(rootRoute);
app.use(swaggerSetup);
app.use(serverStatusRoute);
app.use('/courses', coursesRoutes);
app.use(errorRoute);

app.use(errorHandler);

app.listen(PORT);

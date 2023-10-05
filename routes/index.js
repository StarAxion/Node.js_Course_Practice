const express = require('express');

const router = express.Router();

const swaggerSetup = require('./api-docs'); 
const serverStatusRoute = require('./serverStatus');
const coursesRoutes = require('./courses'); 

router.get('/', (req, res) => {
  res.redirect('/courses');
});

router.use(swaggerSetup);

router.use(serverStatusRoute);

router.use('/courses', coursesRoutes);

router.use((req, res, next) => {
  const error = new Error('Page not found');
  error.status = 404;
  next(error);
});

module.exports = router;

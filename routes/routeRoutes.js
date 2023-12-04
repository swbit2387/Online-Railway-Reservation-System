const express = require('express');
const routeRouter = express.Router();
const routeController = require(`${__dirname}/../controllers/routeController`);
const auth = require(`${__dirname}/../controllers/authController`);
// const auth = require(`${__dirname}/../controllers/authController`);
// tourRouter.param('id',tourController.checkId);
routeRouter.use(auth.protect, auth.restrictTo('admin'));
routeRouter
  .route('/')
  .post(routeController.addRoute)
  .get(routeController.getAllRoutes);

routeRouter
  .route('/between/:from/:to')
  .get(routeController.getRoutesBetweenStation);

module.exports = routeRouter;

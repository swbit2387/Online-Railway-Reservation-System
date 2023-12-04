const express = require('express');
const tourController = require(`${__dirname}/../controllers/tourController.js`);
const tourRouter = express.Router();
const tourMiddleWare = require(`${__dirname}/../utilities/tourMiddleWare`);
const auth = require(`${__dirname}/../controllers/authController`);
const reviewRouter = require(`${__dirname}/reviewRoutes`);
// tourRouter.param('id',tourController.checkId);
tourRouter.use('/:tourId/reviews', reviewRouter);
tourRouter.use(tourMiddleWare.logger);

tourRouter.route('/').get(tourController.getAllTours);
tourRouter.route('/:id').get(tourController.getTour);

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourController.getDistances);

tourRouter.use(auth.protect);
tourRouter.use(auth.restrictTo('admin', 'lead-guide'));
tourRouter
  .route('/')
  .post(tourController.addTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
module.exports = tourRouter;

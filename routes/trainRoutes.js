const express = require('express');
const trainRouter = express.Router();
const trainController = require(`${__dirname}/../controllers/trainController`);
const auth = require(`${__dirname}/../controllers/authController`);
// tourRouter.param('id',tourController.checkId);
trainRouter
  .route('/')
  .post(auth.protect, auth.restrictTo('admin'), trainController.addTrain)
  .get(trainController.getAllTrains);

trainRouter
  .route('/deleteTrain/:id')
  .delete(auth.protect, auth.restrictTo('admin'), trainController.deleteTrain);

trainRouter
  .route('/updateTrain/:id')
  .patch(auth.protect, auth.restrictTo('admin'), trainController.updateTrain);

trainRouter
  .route('/between/:from/:to/:on/:doj')
  .get(trainController.getTrainsBetweenStation);
trainRouter.use(auth.protect);
trainRouter
  .route('/:trainNumber/seats/:doj')
  .get(trainController.getBookedSeats);
module.exports = trainRouter;

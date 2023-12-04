const express = require('express');
const auth = require(`${__dirname}/../controllers/authController.js`);
const viewController = require(`${__dirname}/../controllers/viewController.js`);
const trainController = require(`${__dirname}/../controllers/trainController.js`);
const userController = require(`${__dirname}/../controllers/userController.js`);
const viewRouter = express.Router({ mergeParams: true });
viewRouter.use(auth.isLoggedIn);

viewRouter.route('/').get(viewController.getAllTours);
viewRouter.route('/login').get(viewController.login);
viewRouter.route('/signup').get(viewController.signup);
viewRouter.route('/services').get(viewController.services);
viewRouter.route('/contact').get(viewController.contact);
viewRouter
  .route('/allUsers')
  .get(auth.protect, auth.restrictTo('admin'), viewController.getAllUsers);

////////////////////
viewRouter.route('/addTrain').get(viewController.getAddTrains);
viewRouter.route('/deleteTrain').get(viewController.getdeleteTrains);
viewRouter.route('/getAllTrains').get(viewController.getAllTrains);

viewRouter.route('/train/updateTrain/:id').get(viewController.updateTrain);

///////////////
viewRouter
  .route('/train/between/:from/:to/on/:doj')
  .get(
    trainController.getTrainsBetweenStation,
    viewController.getTrainsBetweenStation
  );
viewRouter.use(auth.protect);
viewRouter
  .route('/train/:trainNumber/seats/:doj')
  .get(trainController.getBookedSeats, viewController.getBookedSeats);
viewRouter
  .route('/my-bookings')
  .get(userController.getAllTickets, viewController.getMyBookings);

// viewRouter.route('/tour/:slug').get(viewController.getTour);

viewRouter.route('/me').get(viewController.getMe);

module.exports = viewRouter;

const express = require('express');
const bookingRouter = express.Router();
const bookingController = require(`${__dirname}/../controllers/bookingController`);
const auth = require(`${__dirname}/../controllers/authController`);
// tourRouter.param('id',tourController.checkId);
// bookingRouter.use(auth.protect);
bookingRouter.use(auth.protect);
bookingRouter.route('/:trainNumber/:doj').post(bookingController.bookTicket);

module.exports = bookingRouter;

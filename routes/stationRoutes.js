const express = require('express');
const stationRouter = express.Router();
const stationController = require(`${__dirname}/../controllers/stationController`);
// const auth = require(`${__dirname}/../controllers/authController`);
// tourRouter.param('id',tourController.checkId);

stationRouter
  .route('/')
  .post(stationController.addStation)
  .get(stationController.getAllStations);

module.exports = stationRouter;

const Station = require(`${__dirname}/../models/stationModel`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`); // catching Async Errors
const AppError = require(`${__dirname}/../utilities/appError`); //to initialize error
const factory = require(`${__dirname}/handlerFactory`);

exports.addStation = factory.createOne(Station);
exports.getAllStations = factory.getAll(Station);

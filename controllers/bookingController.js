// const APIfeatures = require(`${__dirname}/../utilities/APIfeatures`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`); // catching Async Errors
const AppError = require(`${__dirname}/../utilities/appError`); //to initialize error
const factory = require(`${__dirname}/handlerFactory`);

const Booking = require(`${__dirname}/../models/bookingModel`);
const Train = require(`${__dirname}/../models/trainModel`);
const Station = require(`${__dirname}/../models/stationModel`);
//----------------------------------------------------exports------------------------------------------------------

exports.bookTicket = CatchAsync(async (req, res, next) => {
  let { trainNumber, doj } = req.params;
  if (
    !trainNumber ||
    !doj ||
    doj === ':doj' ||
    trainNumber === ':trainNumber'
  ) {
    return next(
      new AppError(
        'Please provide valid Train Number and Date of journey stations',
        400
      )
    );
  }
  //validate all object Ids and codes
  const currTrain = await Train.findOne({ trainNumber: trainNumber })
    .select('+coaches')
    .populate({
      path: 'route',
      populate: { path: 'route' },
    });
  if (!currTrain) {
    return next(new AppError('Please provide valid Train Number', 400));
  }
  let from = await Station.findOne({ code: req.body.from });
  let to = await Station.findOne({ code: req.body.to });
  if (!from) {
    return next(new AppError(`${req.body.from} station code is Invalid`, 400));
  }
  if (!to) {
    return next(new AppError(`${req.body.to} station code is Invalid`, 400));
  }
  if (req.body.from === req.body.to) {
    return next(new AppError(`Departure and Destination cannot be equal`, 400));
  }
  //set all the return variables
  let price = currTrain.fetchPrice(from._id, to._id);
  console.log(price);
  let train = currTrain._id;
  let dateOfJourney = new Date(doj);
  const seats = req.body.seats;
  const user = req.currUser._id;

  //validate Everything
  let trainValidation = await currTrain.validateJourney(
    dateOfJourney,
    seats,
    from,
    to
  );
  if (!trainValidation.valid) {
    return next(new AppError(trainValidation.message, 400));
  }
  let bookingValidation = await Booking.validateBooking(train, seats, doj);
  if (!bookingValidation.valid) {
    return next(new AppError(bookingValidation.message, 400));
  }
  from = from._id;
  to = to._id;

  //Create booking
  const booking = await Booking.create({
    user,
    train,
    dateOfJourney,
    seats,
    from,
    to,
  });

  //send response
  if (!booking) {
    console.log(booking);
    return next(new AppError('Something went wrong while booking', 500));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: booking,
    },
  });
});

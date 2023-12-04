const Train = require(`${__dirname}/../models/trainModel`);
const Booking = require(`${__dirname}/../models/bookingModel`);
const Station = require(`${__dirname}/../models/stationModel`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`); // catching Async Errors
const AppError = require(`${__dirname}/../utilities/appError`); //to initialize error
const factory = require(`${__dirname}/handlerFactory`);

const notFoundError = (Model) => {
  return new AppError(
    `No ${Model.collection.modelName} found with that ID`,
    404
  );
};

exports.addTrain = factory.createOne(Train);

exports.deleteTrain = factory.deleteOne(Train);
// exports.deleteTrain = (trainNumber) =>
//   CatchAsync(async (req, res, next) => {
//     const doc = await Train.findOneAndDelete({ trainNumber: trainNumber });
//     console.log(req.params);
//     console.log(req.body);
//     if (!doc) {
//       return next(notFoundError(trainNumber));
//     }

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   });

exports.updateTrain = factory.updateOne(Train);

exports.getAllTrains = factory.getAll(Train);
exports.getTrainsBetweenStation = CatchAsync(async (req, res, next) => {
  let { from, to } = req.params;
  if (!from || !to || from === ':from' || to === ':to') {
    return next(new AppError('Please provide valid from and to stations', 400));
  }
  let fromCode = await Station.findOne({ code: from });
  let toCode = await Station.findOne({ code: to });
  if (!fromCode || !toCode) {
    return next(new AppError('Please provide valid from and to stations', 400));
  }
  from = fromCode._id;
  to = toCode._id;
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const da = new Date(req.params.doj);
  if (!da) {
    return next(new AppError('Please provide valid Date', 400));
  }
  const day = weekday[da.getDay()];
  let query = await Train.aggregate([
    {
      $match: {
        $expr: {
          $setIsSubset: [[to, from], '$stops.station'],
        },
      },
    },
    {
      $match: {
        runsOn: {
          $eq: day,
        },
      },
    },
    {
      $set: {
        wanted: {
          $first: {
            $filter: {
              input: '$stops',
              cond: {
                $in: ['$$this.station', [to, from]],
              },
            },
          },
        },
      },
    },
    {
      $match: {
        'wanted.station': from,
      },
    },
    {
      $unset: 'wanted',
    },
  ]);
  let trains = await Train.populate(query, { path: 'stops.station' });
  if (req.originalUrl.startsWith('/api')) {
    res.status(200).json({
      status: 'success',
      results: trains.length,
      data: {
        data: trains,
      },
    });
  } else {
    req.trains = trains;
    next();
  }
});
exports.getBookedSeats = CatchAsync(async (req, res, next) => {
  const train = await Train.findOne({
    trainNumber: req.params.trainNumber,
  }).select('+coaches');
  const trainId = train._id;
  const da = new Date(req.params.doj);
  const bookedSeats = await train.getBookedSeats(da);
  if (req.originalUrl.startsWith('/api')) {
    res.status(200).json({
      status: 'success',
      results: bookedSeats.length,
      data: {
        data: bookedSeats,
      },
    });
  } else {
    req.train = train;
    req.bookedSeats = bookedSeats;
    next();
  }
});

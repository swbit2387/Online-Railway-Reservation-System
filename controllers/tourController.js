const Tour = require(`${__dirname}/../models/tourModel`);
const APIfeatures = require(`${__dirname}/../utilities/APIfeatures`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`); // catching Async Errors
const AppError = require(`${__dirname}/../utilities/appError`); //to initialize error
const factory = require(`${__dirname}/handlerFactory`);
//----------------------------------------------------exports------------------------------------------------------
exports.getAllTours = factory.getAll(Tour);
// CatchAsync(async (req, res, next) => {
//   let features = new APIfeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .field()
//     .page();
//   let query = features.query;
//   //executing query===================================================================================================
//   const tours = await query;
//   //sending response
//   res.json({
//     status: 'success',
//     length: tours.length,
//     data: {
//       tours,
//     },
//   });
// });
exports.getTour = factory.getOne(Tour, { path: 'reviews', select: '-__v' });
// CatchAsync(async (req, res, next) => {
//   let tour = await Tour.findById(req.params.id).populate({
//     path: 'reviews',
//     select: '-__v',
//   });
//   if (tour === null) {
//     next(new AppError(`Tour with id: ${req.params.id} not found`, 404));
//   } else {
//     res.json({
//       status: 'success',
//       tour,
//     });
//   }
// });

exports.addTour = factory.createOne(Tour);
// CatchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     tour: newTour,
//   });
// });

exports.updateTour = factory.updateOne(Tour);
// CatchAsync(async (req, res, next) => {
//   let updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (updatedTour) {
//     res.status(200).json({
//       status: 'success',
//       tour: updatedTour,
//     });
//   } else {
//     next(new AppError(`Tour with id ${req.params.id} not found`, 404));
//   }
// });

exports.deleteTour = factory.deleteOne(Tour);

exports.getToursWithin = CatchAsync(async (req, res, next) => {
  let { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!unit) unit = 'km';
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = CatchAsync(async (req, res, next) => {
  let { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  if (!unit) unit = 'km';
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

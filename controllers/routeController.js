const Route = require(`${__dirname}/../models/routeModel`);
const Station = require(`${__dirname}/../models/stationModel`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`); // catching Async Errors
const AppError = require(`${__dirname}/../utilities/appError`); //to initialize error
const factory = require(`${__dirname}/handlerFactory`);

exports.addRoute = factory.createOne(Route);
exports.getAllRoutes = factory.getAll(Route, {
  path: 'route',
  select: '-nearbyStation -__v',
});
exports.getRoutesBetweenStation = CatchAsync(async (req, res, next) => {
  let { from, to } = req.params;
  if (!from || !to || from === ':from' || to === ':to') {
    return next(new AppError('Please provide from and to stations', 400));
  }
  let fromCode = await Station.findOne({ code: from });
  let toCode = await Station.findOne({ code: to });
  from = fromCode._id;
  to = toCode._id;

  const routes = await Route.aggregate([
    {
      $match: {
        $expr: {
          $setIsSubset: [[to, from], '$route'],
        },
      },
    },
    {
      $set: {
        wanted: {
          $first: {
            $filter: {
              input: '$route',
              cond: {
                $in: ['$$this', [to, from]],
              },
            },
          },
        },
      },
    },
    {
      $match: {
        wanted: from,
      },
    },
    {
      $unset: 'wanted',
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: routes.length,
    data: {
      data: routes,
    },
  });
});

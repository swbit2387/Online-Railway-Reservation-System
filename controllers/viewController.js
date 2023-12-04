const Station = require(`${__dirname}/../models/stationModel`);
const User = require(`${__dirname}/../models/userModel`);
const Train = require(`${__dirname}/../models/trainModel`);
const Route = require(`${__dirname}/../models/routeModel`);
// const APIfeatures = require(`${__dirname}/../utilities/APIfeatures`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`); // catching Async Errors
const AppError = require(`${__dirname}/../utilities/appError`); //to initialize error
const factory = require(`${__dirname}/handlerFactory`);

exports.getAllTours = CatchAsync(async (req, res, next) => {
  const stations = await Station.find();
  res.render('template.ejs', { title: 'FastRail', stations });
});
exports.login = (req, res, next) => {
  res.render('login.ejs', { title: 'Login' });
};
exports.signup = CatchAsync(async (req, res, next) => {
  res.render('signup.ejs', { title: 'SignUp' });
});

exports.getMe = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.currUser.id);
  res.render('userProfile.ejs', { title: 'Profile', user });
});

exports.getAllUsers = CatchAsync(async (req, res, next) => {
  const users = await User.find();
  res.render('allUsers.ejs', { title: 'All Users', users });
});

exports.getTrainsBetweenStation = CatchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 1000),
    // secure: true, enable this in production
    httpOnly: true,
  };
  res
    .cookie('from', req.params.from, cookieOptions)
    .cookie('to', req.params.to, cookieOptions)
    .render('train-details.ejs', {
      title: 'Trains',
      trains: req.trains,
      doj: req.params.doj,
      from: req.params.from,
      to: req.params.to,
    });
});
exports.getBookedSeats = CatchAsync(async (req, res, next) => {
  if (!req.cookies.from || !req.cookies.to) {
    return next(new AppError('Invalid request', 400));
  }
  let bookedSeats = [];
  for (booking of req.bookedSeats) {
    for (seat of booking.seats) {
      bookedSeats.push(`${seat.coach}-${seat.seatNumber}`);
    }
  }
  res.render('seat.ejs', {
    title: `${req.train.name} | ${req.params.trainNumber}`,
    doj: req.params.doj,
    train: req.train,
    from: req.cookies.from,
    to: req.cookies.to,
    bookedSeats,
  });
});
exports.getMyBookings = CatchAsync(async (req, res, next) => {
  res.render('myBookings.ejs', {
    title: 'My Bookings',
    bookings: req.currUser.myBookings,
  });
});

exports.getAddTrains = CatchAsync(async (req, res, next) => {
  const routes = await Route.find().populate({ path: 'route' });
  res.render('addTrain.ejs', { title: 'addTrain', routes });
});

exports.getdeleteTrains = CatchAsync(async (req, res, next) => {
  res.render('deleteTrain.ejs', { title: 'deleteTrain' });
});

exports.getAllTrains = CatchAsync(async (req, res, next) => {
  const trains = await Train.find().populate({ path: 'stops.station' });

  res.render('allTrains.ejs', { title: 'allTrains', trains });
});

exports.updateTrain = CatchAsync(async (req, res, next) => {
  const routes = await Route.find().populate({ path: 'route' });
  const id = req.params.id;
  const train = await Train.findById(id);
  res.render('updateTrain.ejs', { title: 'updateTrain', routes, train });
});

exports.services = CatchAsync(async (req, res, next) => {
  res.render('services.ejs', { title: 'Services' });
});

exports.contact = CatchAsync(async (req, res, next) => {
  res.render('contact.ejs', { title: 'Contact Us' });
});

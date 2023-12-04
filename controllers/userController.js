const User = require(`${__dirname}/../models/userModel`);
const Booking = require(`${__dirname}/../models/bookingModel`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`);
const AppError = require(`${__dirname}/../utilities/appError`);
const factory = require(`${__dirname}/handlerFactory`);
const fileController = require(`${__dirname}/fileController`);
const mongoose = require('mongoose');

exports.uploadUserPhoto = fileController.uploadUserPhoto;

const filterObject = (obj, ...filters) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (filters.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.currUser.id;
  next();
};
exports.getUser = factory.getOne(User, { path: 'myBookings' });
exports.getAllUser = factory.getAll(User);
// CatchAsync(async (req, res) => {
//   let users = await User.find();
//   res.status(200).json({
//     status: '200',
//     message: 'success',
//     users,
//   });
// });
exports.addUser = (req, res) => {
  res.status(404).json({
    status: '404',
    message: 'Not implemented, Please use signup',
  });
};

module.exports.updateMe = CatchAsync(async (req, res, next) => {
  // console.log(req.currUser);
  if (req.body.password) {
    return next(new AppError('This route is not for updating passwords'));
  }
  const filteredObj = filterObject(req.body, 'name', 'email');
  if (req.file) {
    filteredObj.photo = req.file.filename;
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.currUser._id,
    filteredObj,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
module.exports.deleteMe = CatchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.currUser._id, { active: false });
  res.status(204).json({
    status: 'success',
    message: 'User deleted',
  });
});

module.exports.deleteUser = CatchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });
  res.status(204).json({
    status: 'success',
    message: 'User deleted',
  });
});

module.exports.getAllTickets = CatchAsync(async (req, res, next) => {
  const currUser = await User.findById(req.currUser._id).populate({
    path: 'myBookings',
    populate: 'from to train',
  });

  if (req.originalUrl.startsWith('/api')) {
    return res.status(200).json({
      status: 'success',
      data: {
        bookings: currUser.myBookings,
      },
    });
  } else {
    req.currUser = currUser;
    next();
  }
});
module.exports.cancelTicket = CatchAsync(async (req, res, next) => {
  let ID = req.currUser._id;
  const booking = await Booking.findOneAndDelete({
    _id: req.params.pnr,
    user: req.currUser._id,
  });
  if (!booking) {
    return next(new AppError(`You cannot delete this ticket`, 400));
  }
  res.status(200).json({
    status: 'success',
    message: 'Ticket Cancelled',
  });
});

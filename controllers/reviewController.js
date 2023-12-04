const { finished } = require('nodemailer/lib/xoauth2');

const Review = require(`${__dirname}/../models/reviewModel`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`); // catching Async Errors
const AppError = require(`${__dirname}/../utilities/appError`);
const factory = require(`${__dirname}/handlerFactory`);

exports.setData = (req, res, next) => {
  if (!req.body.user || !req.body.tour) {
    req.body.user = req.currUser;
    req.body.tour = req.params.tourId;
  }
  next();
};

module.exports.createReview = factory.createOne(Review, {
  path: 'user',
  select: 'name photo',
});
module.exports.getAllReviews = factory.getAll(Review);
module.exports.updateReview = CatchAsync(async (req, res, next) => {
  const rating = req.body.rating;
  const review = req.body.review;
  const OrgReview = await Review.findById(req.params.id);
  // console.log(OrgReview);

  if (
    req.currUser._id.toString() != OrgReview.user._id.toString() &&
    req.currUser._id != 'admin'
  ) {
    return next(new AppError("This review doesn't belong to you", 401));
  }
  if (rating) {
    OrgReview.rating = rating;
  }
  if (review) {
    OrgReview.review = review;
  }
  await OrgReview.save();
  res.status(200).json({
    status: 'success',
    data: {
      data: OrgReview,
    },
  });
});
module.exports.deleteReview = CatchAsync(async (req, res, next) => {
  console.log(req.params);
  const OrgReview = await Review.findById(req.params.id);
  if (!OrgReview) {
    return next(new AppError('No review found '));
  }

  if (
    req.currUser._id.toString() != OrgReview.user._id.toString() &&
    req.currUser._id != 'admin'
  ) {
    return next(new AppError("This review doesn't belong to you", 401));
  }
  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

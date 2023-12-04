const express = require('express');
const reviewController = require(`${__dirname}/../controllers/reviewController.js`);
const auth = require(`${__dirname}/../controllers/authController.js`);
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.route('/').get(reviewController.getAllReviews);

reviewRouter.use(auth.protect);
reviewRouter
  .route('/')
  .post(
    auth.restrictTo('user'),
    reviewController.setData,
    reviewController.createReview
  );
reviewRouter
  .route('/:id')
  .delete(auth.restrictTo('user', 'admin'), reviewController.deleteReview)
  .patch(auth.restrictTo('user', 'admin'), reviewController.updateReview);
module.exports = reviewRouter;

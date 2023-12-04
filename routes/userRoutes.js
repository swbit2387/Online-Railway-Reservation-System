const express = require('express');
const userController = require(`${__dirname}/../controllers/userController.js`);
const userRouter = express.Router();
const auth = require(`${__dirname}/../controllers/authController`);
const fileController = require(`${__dirname}/../controllers/fileController`);

userRouter.post('/signup', auth.signUp);
userRouter.post('/login', auth.login);
userRouter.patch('/forgotPassword', auth.forgotPassword);
userRouter.patch('/resetPassword/:resetToken', auth.resetPassword);

userRouter.use(auth.protect);
userRouter.patch('/updateMyPassword', auth.updatePassword);
userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  fileController.resizeUserPhoto,
  userController.updateMe
);

userRouter.delete('/deleteMe', userController.deleteMe);
userRouter.delete('/deleteUser/:id', userController.deleteUser);
userRouter.route('/me').get(userController.getMe, userController.getUser);
userRouter.route('/logout').get(auth.logout);

userRouter.route('/tickets').get(userController.getAllTickets);
userRouter.route('/tickets/:pnr').delete(userController.cancelTicket);

userRouter.use(auth.restrictTo('admin'));
userRouter
  .route('/')
  .get(userController.getAllUser)
  .post(userController.addUser);
userRouter.route('/:id').get(userController.getUser);

module.exports = userRouter;

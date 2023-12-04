const User = require(`${__dirname}/../models/userModel`);
const CatchAsync = require(`${__dirname}/../utilities/catchAsyncError`);
const AppError = require(`${__dirname}/../utilities/appError`);
const Email = require(`${__dirname}/../utilities/email`);
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
// const Email = require(`${__dirname}/../utilities/email`);
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, enable this in production
    httpOnly: true,
  };
  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
      token,
    },
  });
};

module.exports.requiredFields = (...fields) => {
  return (req, res, next) => {
    fields.forEach((el) => {
      if (!req.body[el]) {
        return next(new AppError(`${el} is required`, 400));
      }
    });
    next();
  };
};

module.exports.signUp = CatchAsync(async (req, res, next) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  };
  if (req.file) {
    user.photo = req.file.filename;
  }
  const newUser = await User.create(user);
  if (!newUser) {
    return next(
      new AppError(
        'Something went wrong while signing you in please try again',
        500
      )
    );
  }
  new Email(newUser, `${req.protocol}://${req.get('host')}/me`).sendWelcome();
  createAndSendToken(newUser, 201, res);
});
module.exports.login = CatchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(req);
  // console.log('From login api', email, password);
  if (!email || !password) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const currUser = await User.findOne({ email }).select('+password');
  if (
    !currUser ||
    !(await currUser.verifyPassword(password, currUser.password))
  ) {
    return next(new AppError('Incorrect email or password', 401));
  } else {
    createAndSendToken(currUser, 200, res);
  }
});

exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, enable this in production
    httpOnly: true,
  };
  console.log('loggedout');
  res.cookie('token', 'loggedOut', cookieOptions);
  res.status(200).json({ status: 'success' });
};

module.exports.protect = CatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    token = req.cookies.token;
  }
  if (!token) {
    return next(new AppError('Please log in!', 400));
  }
  //verify Token
  let decoded = '';
  decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('No user with the given credential exists', 400));
  }
  //check new password
  if (freshUser.changedPassAfter(decoded.iat)) {
    return next(new AppError('Try logging in again'));
  }
  req.currUser = freshUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currUser.role)) {
      let restricted = '';
      for (let i in roles) {
        restricted += `${roles[i]} or `;
      }

      return next(new AppError(`You are not ${restricted}`, 401));
    }
    next();
  };
};
module.exports.forgotPassword = CatchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(`There is no user with given email ${req.body.email}`, 404)
    );
  }
  //generate Random reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //Mail the reset Token to user
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL} .\nIf you didn't forget your password, please ignore this email!`;

  try {
    // await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!' + err
      ),
      500
    );
  }
});

module.exports.resetPassword = CatchAsync(async (req, res, next) => {
  //get user based on resetToken
  const userResetToken = req.params.resetToken;
  const newPassword = req.body.password;
  const passConfirm = req.body.passwordConfirm;
  const hashedToken = crypto
    .createHash('sha256')
    .update(userResetToken)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, //token expired or not
  });
  //If token has not expired and there is a user, then set new Password
  if (!user) {
    return next(
      new AppError(
        'Token is invalid or has expired......please create a new link'
      )
    );
  }
  user.password = newPassword;
  user.passwordConfirm = passConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //update password Changed at property using middleware
  //send new Token to client

  createAndSendToken(user, 200, res);
});

module.exports.updatePassword = CatchAsync(async (req, res, next) => {
  //check if user is logged in
  if (!req.currUser) {
    return next(new AppError('Pls Login to change update Password', 400));
  }
  //check all parameters are available
  if (
    !req.body.currPassword ||
    !req.body.password ||
    !req.body.passwordConfirm
  ) {
    return next(new AppError('Please provide all the fields', 400));
  }
  //loading userbased on id
  const user = await User.findById(req.currUser._id).select('+password');
  if (!(await user.verifyPassword(req.body.currPassword, user.password))) {
    return next(new AppError('Incorrect password or email'));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //sending token to user
  createAndSendToken(user, 200, res);
});
exports.isLoggedIn = CatchAsync(async (req, res, next) => {
  // console.log('From is LoggedIn', req.cookies);
  if (req.cookies.token) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.token,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPassAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      console.log('From is logged in current logged in user is', currentUser);
      res.locals.currUser = currentUser;
      return next();
    } catch (err) {
      console.log(err);
      return next();
    }
  }
  next();
});

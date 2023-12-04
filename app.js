const express = require('express');
const app = express();
require('dotenv').config();

const AppError = require(`${__dirname}/utilities/AppError`);
const ErrorController = require(`${__dirname}/controllers/errorController`);

const path = require('path');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const trainRouter = require(`${__dirname}/routes/trainRoutes`);
const routeRouter = require(`${__dirname}/routes/routeRoutes`);
const stationRouter = require(`${__dirname}/routes/stationRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);
const bookingRouter = require(`${__dirname}/routes/bookingRoutes`);
const viewRouter = require(`${__dirname}/routes/viewRoutes`);

//for parsing body to req.body
app.use(express.json());
//for serving static files
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); //for directly specifying the method in form
//--------------------------------------------all the routes--------------------------------------------------------------
app.use('/api/train', trainRouter);
app.use('/api/station', stationRouter);
app.use('/api/train_routes', routeRouter);
app.use('/api/user', userRouter);
app.use('/api/book', bookingRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  return next(new AppError(`Resource Not found.\n${req.originalUrl}`, 404));
});
app.use(ErrorController);

//----------------------------------------------connecting to database-----------------------------------------------
const DBstring = process.env.DBSTRING;
mongoose.connect(DBstring).then((con) => {
  // console.log(con.connections);
  console.log('Connected to Database FastRail from atlas');
});

//---------------------------------------------Start The Server-------------------------------------------------------

const server = app.listen(process.env.PORT, () => {
  console.log(`FastRail listening on port ${process.env.PORT}`);
});

//-----------------------------------------Catching unhandled exceptions-----------------------------------------------
process.on('unhandledRejection', (err) => {
  // console.log(err.name, err.message);
  console.log(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

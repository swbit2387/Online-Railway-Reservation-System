//-----------------------------------------------requiring npm packages--------------------------
const mongoose = require('mongoose');
const Route = require(`${__dirname}/routeModel`);
const Station = require(`${__dirname}/stationModel`);
const Booking = require(`${__dirname}/bookingModel`);
//----------------------------------------------------creating schema--------------------------------

const seatMapSchema = new mongoose.Schema(
  {
    train: {
      type: mongoose.Schema.ObjectId,
      ref: 'Train',
      required: [true, 'Booking requires a train'],
    },
    dateOfJourney: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
seatMapSchema.virtual('bookedSeats').get(async function () {
  let bookedSeats = [];
  const temp = await Booking.find({
    train: this.train,
    dateOfJourney: this.dateOfJourney,
  });
  console.log(temp);
});

//----------------------------------------------------creating model-------------------------------------------------
const Schema = mongoose.model('SeatMap', seatMapSchema);
//-----------------------------------------------------exports---------------------------------------------------------
module.exports = SeatMap;

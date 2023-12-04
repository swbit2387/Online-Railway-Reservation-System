//-----------------------------------------------requiring npm packages--------------------------
const mongoose = require('mongoose');
const Route = require(`${__dirname}/routeModel`);
const Station = require(`${__dirname}/stationModel`);
//----------------------------------------------------creating schema--------------------------------

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking requires User. Please Login as user!'],
    },
    train: {
      type: mongoose.Schema.ObjectId,
      ref: 'Train',
      required: [true, 'Booking requires a train'],
    },
    dateOfJourney: {
      type: Date,
      required: [true, 'There must be a date of journey'],
      validate: [
        {
          validator: function (val) {
            let limit = new Date(Date.now());
            limit.setDate(
              limit.getDate() + process.env.BOOKING_ALLOWED_TILL_DAY
            );
            const currDate = new Date(Date.now());
            if (val <= currDate || val > limit) {
              return false;
            }
            return true;
          },
          message: `Bookings for a train is allowed only from ${new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toDateString()} and before or on ${new Date(
            Date.now() +
              process.env.BOOKING_ALLOWED_TILL_DAY * 24 * 60 * 60 * 1000
          ).toDateString()}`,
        },
      ],
    },
    dateOfBooking: {
      type: Date,
      default: Date.now(),
    },
    seats: {
      type: [
        {
          coach: {
            type: String,
            required: [true, `Name required`],
          },
          seatNumber: {
            type: Number,
            required: [true, `Name required`],
          },
          name: {
            type: String,
            required: [true, `Name required`],
          },
          age: {
            type: Number,
            required: [true, `${this.name} is missing age`],
          },
          gender: {
            type: String,
            enum: {
              values: ['M', 'F', 'Tr'],
              message: 'Either M or F or Tr',
            },
            required: [true, `${this.name} is missing gender`],
          },
        },
      ],
      validate: [
        {
          validator: function (val) {
            return val.length >= 1;
          },
          message: 'At least one passenger required for booking',
        },
      ],
    },
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'Station',
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: 'Station',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
bookingSchema.statics.validateBooking = async function (train, seat, doj) {
  const doc = await this.find({ train: train, dateOfJourney: doj });
  for (let userSeat of seat) {
    for (let booking of doc) {
      for (let currSeat of booking.seats) {
        if (
          userSeat.coach === currSeat.coach &&
          userSeat.seatNumber === currSeat.seatNumber
        ) {
          return {
            valid: false,
            message: `${userSeat.coach} ${userSeat.seatNumber} already occupied`,
          };
        }
      }
    }
  }
  return { valid: true };
};
//----------------------------------------------------creating model-------------------------------------------------
const Booking = mongoose.model('Booking', bookingSchema);
//-----------------------------------------------------exports---------------------------------------------------------
module.exports = Booking;

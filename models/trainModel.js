//-----------------------------------------------requiring npm packages--------------------------
const mongoose = require('mongoose');
const Route = require(`${__dirname}/routeModel`);
const Station = require(`${__dirname}/stationModel`);
const Booking = require(`${__dirname}/bookingModel`);
//--------------------------------------------------------------------------------------------------
getValidationError = (path, msg) => {
  let validationError = new mongoose.Error.ValidationError(null);
  validationError.addError(
    path,
    new mongoose.Error.ValidatorError({
      message: msg,
    })
  );
  return validationError;
};
validateSeats = (coach, seatNumber, check) => {
  for (let currCoach of check.coaches) {
    // console.log(currCoach.ID, currCoach.noOfSeats);
    if (
      coach === currCoach.ID &&
      seatNumber <= currCoach.noOfSeats &&
      seatNumber >= 1
    ) {
      return true;
    }
  }
  return false;
};
//----------------------------------------------------creating schema--------------------------------
const stopsSchema = new mongoose.Schema(
  {
    arrival: {
      type: String,
      default: '-',
    },
    departure: {
      type: String,
      default: '-',
    },
    station: {
      type: mongoose.Schema.ObjectId,
      ref: 'Station',
      validate: {
        validator: async function (val) {
          const doc = await Station.findById(val);
          if (!doc) return false;
          return true;
        },
        message: `A Station with code {VALUE} not found`,
      },
    },
  },
  { _id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const trainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Train must have a name'],
      unique: [true, 'This Train Name is already taken'],
      trim: true,
      maxlength: [
        40,
        'A Train name must have less or equal then 40 characters',
      ],
      minlength: [5, 'A Train name must have more or equal then 5 characters'],
      // validate: [validator.isAlpha, 'Train name must only contain characters']
    },
    trainNumber: {
      type: Number,
      unique: [true, 'This Train Number is already taken'],
      required: [true, 'A Train must have a number'],
    },
    trainType: {
      type: String,
      required: [true, 'A Train must have a type'],
      enum: {
        values: ['exp', 'rajdhani'],
        message: 'Train type is either: exp, rajdhani',
      },
    },
    baseFare: {
      type: Number,
      required: [true, 'A Train must have a base fare'],
    },
    route: {
      type: mongoose.Schema.ObjectId,
      ref: 'Route',
      required: [true, 'A train must have a route'],
    },
    stops: {
      type: [stopsSchema],
      required: [true, 'A Train must stops'],
      validate: [
        {
          validator: function (val) {
            return val.length >= 2;
          },
          message: 'A Train must have at least two stops',
        },
      ],
    },
    reservationCharges: {
      type: [Number],
      validate: {
        validator: function (val) {
          return val.length == 5;
        },
        message:
          'Reservation charges of all 5 types: 1AC,2AC,3AC,SL,2S must be mentioned',
      },
    },
    runsOn: {
      type: [String],
      default: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      enum: {
        values: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        message: 'Train runs on Sun,Mon,Tue,Wed,Thu,Fri,Sat',
      },
    },
    superFastCharge: {
      type: Number,
      default: 0,
    },

    coaches: {
      type: [
        {
          coachType: {
            type: String,
            required: [true, 'Coach Type required'],
            enum: {
              values: ['1AC', '2AC', '3AC', 'SL', '2S'],
              message: 'Coach Type should be among 1AC,2AC,3AC,SL,2S',
            },
          },
          noOfSeats: {
            type: Number,
            min: [10, 'No of seats should be greater than or equal to 10'],
            max: [200, 'No of seats should be less than or equal to 200'],
            default: function () {
              if (this.coachType == '1AC') {
                return 10;
              } else if (this.coachType == '2AC') {
                return 21;
              } else if (this.coachType == '3AC') {
                return 64;
              } else if (this.coachType == 'SL') {
                return 72;
              } else if (this.coachType == '2S') {
                return 90;
              } else return null;
            },
          },
          ID: {
            type: String,
            unique: [true, 'Coach {VALUE} already used'],
            required: [true, 'Coach Must have a ID'],
            minLength: [2, 'ID of Coach should be greater than or equal to 2'],
            maxLength: [3, 'ID of Coach should be less than or equal to 3'],
          },
          noOfSeatsInSide: {
            type: Number,
            min: [0, 'There must be atleast 0 seat on side'],
            max: [6, 'There cant be more than 3 seats on side'],
          },
          noOfSeatsInNonSide: {
            type: Number,
            min: [0, 'There must be atleast 1 seat on side'],
            max: [6, 'There cant be more than 3 seats on side'],
          },
        },
      ],
      default: [
        {
          coachType: '1AC',
          noOfSeats: 10,
          ID: 'HA1',
          noOfSeatsInSide: 0,
          noOfSeatsInNonSide: 2,
        },
        {
          coachType: '2AC',
          noOfSeats: 20,
          ID: 'AC1',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 2,
        },
        {
          coachType: '2AC',
          noOfSeats: 20,
          ID: 'AC2',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 2,
        },
        {
          coachType: '3AC',
          noOfSeats: 64,
          ID: 'B1',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
        {
          coachType: '3AC',
          noOfSeats: 64,
          ID: 'B2',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
        {
          coachType: '3AC',
          noOfSeats: 64,
          ID: 'B3',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
        {
          coachType: '3AC',
          noOfSeats: 64,
          ID: 'B4',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
        {
          coachType: 'SL',
          noOfSeats: 72,
          ID: 'SL1',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
        {
          coachType: 'SL',
          noOfSeats: 72,
          ID: 'SL2',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
        {
          coachType: 'SL',
          noOfSeats: 72,
          ID: 'SL3',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
        {
          coachType: 'SL',
          noOfSeats: 72,
          ID: 'SL4',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
        {
          coachType: 'SL',
          noOfSeats: 72,
          ID: 'SL5',
          noOfSeatsInSide: 2,
          noOfSeatsInNonSide: 6,
        },
      ],
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// trainSchema.virtual('stopStationCode').get(function () {
//   let stationCodes = [];
//   for (st of this.stops) {
//     const stat = Station.findById(st.station);
//     stationCodes.push(stat.code);
//   }
//   console.log(stationCodes);
//   return stationCodes;
// });

trainSchema.pre('save', async function (next) {
  const currRoute = await Route.findById(this.route).populate({
    path: 'route',
    select: '-__v',
  });
  if (!currRoute) {
    return next(getValidationError('route', `Route doesn't exists `));
  }
  for (stop of this.stops) {
    let temp = false;
    for (st of currRoute.route) {
      if (st.equals(stop.station)) {
        temp = true;
        break;
      }
    }
    if (!temp) {
      const chk = await Station.findById(stop.station);
      return next(
        getValidationError(
          'stops',
          `Station ${chk.name} doesn't exits in route `
        )
      );
    }
  }
  next();
});
trainSchema.methods.getRoute = async function () {
  console.log('called');
  return 'to be implemented';
};
trainSchema.methods.getBookedSeats = async function (da) {
  const bookedSeats = await Booking.find({
    train: this._id,
    dateOfJourney: da,
  }).select('-user -seats.name -seats.age -seats.gender');
  return bookedSeats;
};
trainSchema.methods.fetchPrice = function (from, to) {
  //takes input from station ID and to station ID
  let distanceOfJourney = 0;
  console.log(this.route.route[0]);
  let found = false;
  for (let i = 0; i < this.route.route.length - 1; i++) {
    let currStation = this.route.route[i];
    let nextStation = this.route.route[i + 1];
    if (!found && currStation._id.equals(from)) {
      found = true;
    }
    if (currStation._id.equals(to)) {
      break;
    }
    if (found) {
      for (let neighbour of currStation.nearbyStation) {
        if (neighbour.station.equals(nextStation._id)) {
          distanceOfJourney += neighbour.distance;
        }
      }
    }
  }
  return distanceOfJourney;
};
trainSchema.methods.validateJourney = function (
  dateOfJourney,
  seats,
  from,
  to
) {
  // console.log(this);
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = weekday[dateOfJourney.getDay()];
  if (!this.runsOn.includes(day)) {
    return {
      valid: false,
      message: `The train doesn't run on ${dateOfJourney.toDateString()}`,
    };
  }
  for (let passenger of seats) {
    if (!validateSeats(passenger.coach, passenger.seatNumber, this)) {
      return { valid: false, message: `Invalid Seat for ${passenger.name}` };
    }
  }
  let toMatch = from._id;
  for (let stop of this.stops) {
    if (stop.station.equals(toMatch)) {
      if (toMatch === from._id) {
        toMatch = to._id;
      } else {
        toMatch = 'success';
        break;
      }
    }
  }
  if (toMatch != 'success') {
    return {
      valid: false,
      message: `Train doesn't run between ${from.name} and ${to.name}`,
    };
  }
  return { valid: true };
};

//----------------------------------------------------creating model-------------------------------------------------
const Train = mongoose.model('Train', trainSchema);
//-----------------------------------------------------exports---------------------------------------------------------
module.exports = Train;

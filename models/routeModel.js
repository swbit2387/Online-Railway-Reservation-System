//-----------------------------------------------requiring npm packages--------------------------
const mongoose = require('mongoose');
const Station = require(`${__dirname}/stationModel`);
// ----------------------------------------------------------------------------------------------
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
//----------------------------------------------------creating schema--------------------------------
const routeSchema = new mongoose.Schema(
  {
    route: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Station',

      validate: [
        {
          validator: function (val) {
            return val.length >= 2;
          },
          message: 'A Route must have at least two stops',
        },
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
routeSchema.pre('save', async function (next) {
  //check all station exists or not

  for (let st of this.route) {
    const doc = await Station.findById(st);
    if (!doc) {
      let validationError = getValidationError(
        'route',
        `There is no station with  ${st}`
      );

      return next(validationError);
    }
  }

  //check all stations are next to each other or not
  for (let i = 1; i < this.route.length; i++) {
    const doc = await Station.findById(this.route[i - 1]);
    let isThere = false;
    for (st of doc.nearbyStation) {
      if (st.station.equals(this.route[i])) {
        isThere = true;
        break;
      }
    }
    if (!isThere) {
      let vE = getValidationError(
        'route',
        `There is no route between ${this.route[i - 1]} and ${this.route[i]}`
      );
      return next(vE);
    }
  }
  next();
});
routeSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'route',
  //   select: '-nearbyStation -__v',
  // });
  next();
});
//----------------------------------------------------creating model-------------------------------------------------
const Route = mongoose.model('Route', routeSchema);
//-----------------------------------------------------exports---------------------------------------------------------
module.exports = Route;

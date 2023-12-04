//-----------------------------------------------requiring npm packages--------------------------
const mongoose = require('mongoose');
//----------------------------------------------------creating schema--------------------------------
const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Station must have a name'],
      unique: [true, 'This Station Name is already taken'],
      trim: true,
      lowercase: true,
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    code: {
      type: String,
      required: [true, 'A Station must have a Code'],
      unique: [true, 'This Station Code is already taken'],
      trim: true,
      uppercase: true,
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    nearbyStation: {
      type: [
        {
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
          distance: {
            type: Number,
          },
        },
      ],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
stationSchema.post('save', function (doc) {
  doc.nearbyStation.forEach(async function (val, index, arr) {
    const temp = await Station.findByIdAndUpdate(val.station, {
      $push: {
        nearbyStation: { station: doc._id, distance: val.distance },
      },
    });
  });
});
//----------------------------------------------------creating model-------------------------------------------------
const Station = mongoose.model('Station', stationSchema);
//-----------------------------------------------------exports---------------------------------------------------------
module.exports = Station;

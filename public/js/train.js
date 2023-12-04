/* eslint-disable */
// import axios from 'axios';
// import swal from 'sweetalert';

const addTrain = async (
  name,
  trainNumber,
  trainType,
  baseFare,
  route,
  // stops,
  reservationCharges,
  runsOn,
  superFastCharge
  // coaches
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/train/',
      data: {
        name,
        trainNumber,
        trainType,
        baseFare,
        route,
        // stops,
        reservationCharges,
        runsOn,
        superFastCharge,
        // coaches,
      },
    });

    if (res.data.status === 'success') {
      swal('Welcome', 'Added successfully!', 'success');
      window.setTimeout(() => {
        location.assign('/');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

//////////////////////////////////////////////////
// const deleteTrain = async (trainNumber) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: '/api/train/deleteTrain',
//       data: {
//         trainNumber,
//       },
//     });

//     if (res.data.status === 'success') {
//       swal('Welcome', 'deleted successfully!', 'success');
//       window.setTimeout(() => {
//         location.assign('/');
//         // location.replace('/');
//       }, 1000);
//     }
//   } catch (err) {
//     swal('error!', err.response.data.message, 'error');
//   }
// };

const deleteTrain = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `api/train/deleteTrain/${id}`,
      data: {},
    });

    if (res.status === 204) {
      swal('Welcome', 'deleted successfully!', 'success');
      window.setTimeout(() => {
        location.assign('/getAllTrains');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

/////////////////////////////////////////////////////
const getAllTrains = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/train/',
      data: {},
    });

    if (res.data.status === 'success') {
      swal('Welcome', 'Added successfully!', 'success');
      window.setTimeout(() => {
        location.assign('/');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

const updateSettings = async (
  id,
  name,
  trainNumber,
  trainType,
  baseFare,
  route,
  // stops,
  reservationCharges,
  runsOn,
  superFastCharge
  // coaches
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/train/updateTrain/${id}`,
      data: {
        name,
        trainNumber,
        trainType,
        baseFare,
        route,
        // stops,
        reservationCharges,
        runsOn,
        superFastCharge,
        // coaches,
      },
    });

    if (res.data.status === 'success') {
      swal('Welcome', 'Updated successfully!', 'success');
      window.setTimeout(() => {
        location.assign('/getAllTrains');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

// const updateSettings = async (
//   name,
//   trainNumber
//   // trainType,
//   // baseFare,
//   // route,
//   // stops,
//   // reservationCharges,
//   // runsOn,
//   // superFastCharge
//   // coaches
// ) => {
//   try {
//     const res = await axios({
//       method: 'PATCH',
//       url: `/api/train/updateTrain/${id}`,
//       data: {
//         name,
//         trainNumber,
//         // trainType,
//         // baseFare,
//         // route,
//         // stops,
//         // reservationCharges,
//         // runsOn,
//         // superFastCharge,
//         // coaches
//       },
//     });

//     if (res.data.status === 'success') {
//       swal('Welcome', 'Updated successfully!', 'success');
//       window.setTimeout(() => {
//         location.assign('/getAllTrains');
//         // location.replace('/');
//       }, 1000);
//     }
//   } catch (err) {
//     swal('error!', err.response.data.message, 'error');
//   }
// };

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
const addTrainForm = document.querySelector('.form-addTrain');
if (addTrainForm) {
  addTrainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name12').value;
    const trainNumber = document.getElementById('trainNumber').value;
    const trainType = document.getElementById('trainType').value;
    const baseFare = document.getElementById('baseFare').value;
    const route = document.getElementById('route').value;
    // const stops = document.getElementById('stops').value;
    // const reservationCharges =
    //   document.getElementById('reservationCharges').value;
    const resArr = document.getElementsByName('resArray[]');
    var reservationCharges = [];
    for (var i = 0; i < resArr.length; i++) {
      var a = resArr[i];
      reservationCharges.push(a.value);
    }
    console.log(reservationCharges);
    //////
    const runsOnArr = document.getElementsByName('runsArray[]');
    var runsOn = [];
    for (var i = 0; i < runsOnArr.length; i++) {
      var a = runsOnArr[i];
      runsOn.push(a.value);
    }
    // const runsOn = document.getElementById('runsOn').value;
    const superFastCharge = document.getElementById('superFastCharge').value;
    // const coaches = document.getElementById('coaches').value;

    addTrain(
      name,
      trainNumber,
      trainType,
      baseFare,
      route,
      // stops,
      reservationCharges,
      runsOn,
      superFastCharge
      // coaches
    );
  });
}
////////////////////////////////

const deleteTrainForm = document.querySelector('.form-deleteTrain');
if (deleteTrainForm) {
  deleteTrainForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const trainNumber = document.getElementById('trainNumber123').value;

    deleteTrain(trainNumber);
  });
}
//////////////////////////////////////////////

const getTrainForm = document.querySelector('.form-addTrain');
if (getTrainForm) {
  getTrainForm.addEventListener('onClick', (e) => {
    e.preventDefault();

    getAllTrains();
  });
}

const trainDataForm = document.querySelector('.form-updateTrain');
if (trainDataForm)
  trainDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = e.target.action;
    const id = url.split('/')[5];
    const form = new FormData();
    const name = document.getElementById('name12').value;
    const trainNumber = document.getElementById('trainNumber').value;
    const trainType = document.getElementById('trainType').value;
    const baseFare = document.getElementById('baseFare').value;
    const route = document.getElementById('route').value;
    // const stops = document.getElementById('stops').value;
    // const reservationCharges =
    //   document.getElementById('reservationCharges').value;
    const resArr = document.getElementsByName('resArray[]');
    var reservationCharges = [];
    for (var i = 0; i < resArr.length; i++) {
      var a = resArr[i];
      reservationCharges.push(a.value);
    }

    const runsOnArr = document.getElementsByName('runsArray[]');
    var runsOn = [];
    for (var i = 0; i < runsOnArr.length; i++) {
      var a = runsOnArr[i];
      runsOn.push(a.value);
    }
    // const runsOn = document.getElementById('runsOn').value;
    const superFastCharge = document.getElementById('superFastCharge').value;
    // const coaches = document.getElementById('coaches').value;
    form.append('name', name);
    form.append('trainNumber', trainNumber);
    // console.log(form);
    console.log(form);

    updateSettings(
      id,
      name,
      trainNumber,
      trainType,
      baseFare,
      route,
      // stops,
      reservationCharges,
      runsOn,
      superFastCharge
      // coaches
    );
  });

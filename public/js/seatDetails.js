/* eslint-disable */

const getSeatDetail = async (name, age, gender, coach, seatNumber) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/book/:trainNumber/:doj',
      data: {
        name,
        age,
        gender,
        coach,
        seatNumber,
      },
    });

    if (res.data.status === 'success') {
      swal('DONE', 'done!', 'success');

      window.setTimeout(() => {
        location.assign('/');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

const seatDeail = document.querySelector('.form--seatDetails');
if (seatDeail) {
  seatDeail.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cname').value;
    const age = document.getElementById('cage').value;
    const gender = document.getElementById('cgender').value;
    const coach = document.getElementById('ccoach').value;
    const seatNumber = document.getElementById('cseatNumber').value;

    getSeatDetail(name, age, gender, coach, seatNumber);
  });
}

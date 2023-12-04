let arr = [];
function myFunc() {
  let checkboxes = $("input[type='checkbox']:checked");
  for (let i = 0; i < checkboxes.length; i++) {
    arr.push(checkboxes[i].value);
  }
  $("input[type='checkbox']:checked").addClass('disable');
  $("input[type='checkbox']:checked~div").removeClass('bg');
  $("input[type='checkbox']:checked~div").addClass('disable-bg');
  console.log(arr);
  console.log(checkboxes);

  $('.tab-div').css('display', 'none');

  for (let seat of arr) {
    $('#show_item').append(`<div class="row">
    <div class="col-md-4 mb-3">
      <input type="text" name="name[]" class="form-control name" placeholder="Name" id="cname" required>
    </div>
    <div class="col-md-2 mb-3">
      <input type="number" name="age[]" class="form-control age" placeholder="Age" id="cage" required>
    </div>
    <div class="col-md-2 mb-3">
      <input type="text" name="gender[]" class="form-control gender" placeholder="Gender" id="cgender" required>
    </div>
    <div class="col-md-2 mb-3">
      <input type="text" name="coach[]" class="form-control coach" placeholder="Coach: ${
        seat.split('-')[0]
      }" id="ccoach" disabled>
    </div>
    <div class="col-md-2 mb-3">
      <input type="text" name="seat[]" class="form-control seatNumber" placeholder="Seat-Number: ${
        seat.split('-')[1]
      }" id="cseatNumber" disabled>
    </div>
  </div>`);
  }
  $('.passenger-info').css('display', 'block');
}

const doBooking = async (trainNumber, doj, from, to, seats) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/book/${trainNumber}/${doj}`,
      data: {
        from,
        to,
        seats,
      },
    });

    if (res.data.status === 'success') {
      swal('Confirmation', 'Booking confirm', 'success');

      window.setTimeout(() => {
        location.assign('/');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

document.querySelector('.info').addEventListener('submit', (el) => {
  el.preventDefault();
  let name = document.getElementsByClassName('name');
  let age = document.getElementsByClassName('age');
  let gender = document.getElementsByClassName('gender');
  let coach = document.getElementsByClassName('coach');
  let seatNumber = document.getElementsByClassName('seatNumber');
  let seats = [];
  for (let i = 0; i < arr.length; i++) {
    let seat = {};
    seat.name = name[i].value;
    seat.age = age[i].value;
    seat.gender = gender[i].value;
    seat.coach = coach[i].placeholder.split(' ')[1];
    seat.seatNumber = seatNumber[i].placeholder.split(' ')[1];
    seats.push(seat);
  }
  let trainNumber = document.getElementById('train-number').innerHTML,
    doj = document.getElementById('doj').innerHTML,
    from = document.getElementById('from').innerHTML,
    to = document.getElementById('to').innerHTML;
  doBooking(trainNumber, doj, from, to, seats);
  // console.log(trainNumber, doj, from, to);
});

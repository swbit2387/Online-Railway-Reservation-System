function viewDetails(clicked) {
  var x = document.getElementById('div' + clicked);
  var button = document.getElementById(clicked);
  if (x.style.display === 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
  if (button.innerHTML === 'View Details') {
    button.innerHTML = 'Close Details';
    button.style.backgroundColor = '#FFC0D0';
  } else {
    button.innerHTML = 'View Details';
    button.style.backgroundColor = '#caf7e3';
  }
}

const cancelTicket = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `api/user/tickets/${id}`,
      data: {},
    });

    if (res.data.status === 'success') {
      swal('Ticket Cancelled Successfully', {
        icon: 'success',
      });
      window.setTimeout(() => {
        location.assign('/my-bookings');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

function doOperation(id) {
  swal({
    title: 'Are you sure?',
    text: 'Once Cancelled you will not be able to revert back',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      cancelTicket(id);
    }
  });
}

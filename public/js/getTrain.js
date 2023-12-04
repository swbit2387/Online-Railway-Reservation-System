/* eslint-disable */

const searchTrain = async (from, to, doj) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `api/train/between/${from}/${to}/on/${doj}`,
      data: {
        from,
        to,
      },
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.assign(`/train/between/${from}/${to}/on/${doj}`);
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('Error!', err.response.data.message, 'error');
  }
};

const searchForm = document.querySelector('.form--search');
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const doj = document.getElementById('date').value;
    searchTrain(from, to, doj);
  });
}

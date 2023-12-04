const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/user/logout',
    });
    if ((res.data.status = 'success')) {
      swal('Success', 'Logged Out successfully!', 'success');

      window.setTimeout(() => {
        location.replace('/');
        // location.reload(true);
      }, 1000);
      // location.reload(true);
    }
  } catch (err) {
    console.log(err.response);
    swal('error!', err.response.data.message, 'error');
  }
};

const logOutBtn = document.querySelector('.nav__el--logout');
if (logOutBtn) logOutBtn.addEventListener('click', logout);

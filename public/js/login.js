/* eslint-disable */
// import axios from 'axios';
// import swal from 'sweetalert';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/user/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      swal('Welcome', 'Logged in successfully!', 'success');
      window.setTimeout(() => {
        location.assign('/');
        // location.replace('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

//////////////////////////
const loginForm = document.querySelector('.form--login');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('toggle-password1').value;
    login(email, password);
  });
}
////////////////////////////////

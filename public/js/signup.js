// import axios from 'axios';
// import swal from 'sweetalert';

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/user/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      swal(
        'Welcome',
        'Account created and logged in successfully',
        'success'
      );

      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
    // swal('Error');
  }
};

const signupForm = document.querySelector('.form--signup');
if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signup(name, email, password, passwordConfirm);
  });

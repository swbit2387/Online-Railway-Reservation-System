/* eslint-disable */
// import axios from 'axios';
// import swal from 'sweetalert';

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        'Mail Sent Successfully. Check your mail to reset password.',
        15
      );
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

const forgotPasswordForm = document.querySelector('.form--forgotPassword');
if (forgotPasswordForm)
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    forgotPassword(email);
  });

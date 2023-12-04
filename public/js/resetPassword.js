export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      swal('Success!', 'Password Updated Successfully.', 'success');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    swal('error!', err.response.data.message, 'error');
  }
};

const resetPasswordForm = document.querySelector('.form--resetPassword');

if (resetPasswordForm)
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const el = document.querySelector('#check');
    const token = el.dataset.token;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    resetPassword(password, passwordConfirm, token);
  });
